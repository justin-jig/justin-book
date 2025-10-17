---
title: "라이브러리 axios  파일 업로드/다운로드(스트림), 재시도(지수 백오프), 토큰 자동 리프레시(401 → refresh → 재시도)"
date: 2025-10-17
---

1. **파일 업로드/다운로드(진행률 + 취소)**
2. **재시도(지수 백오프)**
3. **토큰 자동 리프레시(401 → refresh → 대기 중 요청 재시도)**

---

# 0) 준비: 토큰 저장소 & 유틸

```ts
// src/lib/authStore.ts
export const authStore = {
  get access() { return localStorage.getItem('access_token') ?? undefined; },
  set access(v: string | undefined) {
    if (v) localStorage.setItem('access_token', v);
    else localStorage.removeItem('access_token');
  },
  get refresh() { return localStorage.getItem('refresh_token') ?? undefined; },
  set refresh(v: string | undefined) {
    if (v) localStorage.setItem('refresh_token', v);
    else localStorage.removeItem('refresh_token');
  },
  clear() { this.access = undefined; this.refresh = undefined; }
};

// 지수 백오프(예: 100ms * 2^attempt + 랜덤 지터)
export const sleepBackoff = (attempt: number, baseMs = 100, maxMs = 2000) => {
  const ms = Math.min(baseMs * Math.pow(2, attempt), maxMs);
  const jitter = Math.random() * 100;
  return new Promise(res => setTimeout(res, ms + jitter));
};
```

---

# 1) ApiClient 확장: 업/다운로드, 재시도, 자동 리프레시

```ts
// src/lib/axios.ts
import axios, {
  AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse
} from 'axios';
import { authStore, sleepBackoff } from './authStore';

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export interface ApiClientOptions {
  baseURL: string;
  refreshURL: string;                // 토큰 갱신 엔드포인트 (예: /auth/refresh)
  timeoutMs?: number;                // 15s 기본
  withCredentials?: boolean;         // 세션/쿠키 인증일 때 true
  onAuthFailed?: () => void;         // 리프레시 실패 시 로그아웃/리다이렉트 훅
  maxRetries?: number;               // 5xx/네트워크 재시도 횟수 (기본 2)
}

type PendingRequest = {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
  config: AxiosRequestConfig;
};

export class ApiClient {
  private AXIOS: AxiosInstance;
  private isRefreshing = false;
  private queue: PendingRequest[] = [];
  private maxRetries: number;
  private refreshURL: string;
  private onAuthFailed?: () => void;

  constructor(opts: ApiClientOptions) {
    const {
      baseURL,
      refreshURL,
      timeoutMs = 15000,
      withCredentials = true,
      onAuthFailed,
      maxRetries = 2
    } = opts;

    this.refreshURL = refreshURL;
    this.onAuthFailed = onAuthFailed;
    this.maxRetries = maxRetries;

    this.AXIOS = axios.create({
      baseURL,
      timeout: timeoutMs,
      withCredentials,
      headers: { 'Content-Type': 'application/json' },
    });

    // 요청 인터셉터: Access 토큰 주입
    this.AXIOS.interceptors.request.use((config) => {
      const token = authStore.access;
      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      // 사용자 정의 재시도 카운터 초기화
      (config as any).__retryCount = (config as any).__retryCount ?? 0;
      return config;
    });

    // 응답 인터셉터: 401 자동 리프레시 + 지수 백오프 재시도
    this.AXIOS.interceptors.response.use(
      (res) => res,
      async (error: AxiosError) => {
        const original = error.config as AxiosRequestConfig & { __retryCount?: number };

        // --- 네트워크/5xx 재시도 (지수 백오프) ---
        const status = error.response?.status;
        const retriable =
          !status /* 네트워크 에러 */ ||
          (status >= 500 && status < 600);
        if (retriable && (original.__retryCount ?? 0) < this.maxRetries) {
          original.__retryCount = (original.__retryCount ?? 0) + 1;
          await sleepBackoff(original.__retryCount);
          return this.AXIOS.request(original);
        }

        // --- 401 처리: refresh 흐름 (refresh 요청 자체는 제외) ---
        if (status === 401 && original.url && !original.url.includes(this.refreshURL)) {
          if (!this.isRefreshing) {
            this.isRefreshing = true;
            try {
              await this.refreshToken();               // access 갱신
              this.isRefreshing = false;
              // 대기 중이던 요청 재시도
              this.queue.forEach(p => p.resolve(this.AXIOS.request(p.config)));
              this.queue = [];
              // 현재 요청도 재시도
              return this.AXIOS.request(original);
            } catch (e) {
              this.isRefreshing = false;
              // 대기 중이던 요청 전체 실패 처리
              this.queue.forEach(p => p.reject(e));
              this.queue = [];
              this.onAuthFailed?.(); // 로그인 페이지로 이동 등
              return Promise.reject(e);
            }
          } else {
            // 이미 갱신 중이면 큐에 넣고 기다림
            return new Promise((resolve, reject) => {
              this.queue.push({ resolve, reject, config: original });
            });
          }
        }

        // 상태별 로깅(선택)
        switch (status) {
          case 400: console.warn('HTTP 400 Bad Request'); break;
          case 403: console.warn('HTTP 403 Forbidden'); break;
          case 404: console.warn('HTTP 404 Not Found'); break;
          case 406: console.warn('HTTP 406 Not Acceptable'); break;
          case 500: console.error('HTTP 500 Server Error'); break;
          default:  console.error('HTTP error', status);
        }

        return Promise.reject(error);
      }
    );
  }

  // --- 토큰 리프레시 ---
  private async refreshToken() {
    const refresh = authStore.refresh;
    if (!refresh) {
      authStore.clear();
      throw new Error('No refresh token');
    }
    // refresh API는 인증 헤더 없이 호출한다고 가정(백엔드 규약에 맞게 수정)
    const res = await axios.post(this.AXIOS.defaults.baseURL + this.refreshURL, { refresh });
    const { accessToken, refreshToken } = res.data as { accessToken: string; refreshToken?: string };
    authStore.access = accessToken;
    if (refreshToken) authStore.refresh = refreshToken; // 서버가 새 리프레시 토큰도 줄 수 있음
  }

  // --- 기본 요청 ---
  request<T = unknown>(method: HttpMethod, url: string, data?: any, config?: AxiosRequestConfig) {
    return this.AXIOS.request<T>({ method, url, data, ...config });
  }
  get<T = unknown>(url: string, config?: AxiosRequestConfig) { return this.request<T>('get', url, undefined, config); }
  post<T = unknown>(url: string, data?: any, config?: AxiosRequestConfig) { return this.request<T>('post', url, data, config); }
  put<T = unknown>(url: string, data?: any, config?: AxiosRequestConfig) { return this.request<T>('put', url, data, config); }
  patch<T = unknown>(url: string, data?: any, config?: AxiosRequestConfig) { return this.request<T>('patch', url, data, config); }
  delete<T = unknown>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request<T>('delete', url, undefined, { data, ...(config || {}) });
  }

  // --- 파일 업로드 (FormData + 진행률 + 취소 가능) ---
  async upload(
    url: string,
    fileOrBlob: File | Blob,
    fields?: Record<string, string | number | boolean>,
    opts?: { signal?: AbortSignal; onProgress?: (pct: number) => void }
  ) {
    const form = new FormData();
    form.append('file', fileOrBlob);
    Object.entries(fields ?? {}).forEach(([k, v]) => form.append(k, String(v)));

    return this.AXIOS.post(url, form, {
      signal: opts?.signal, // AbortController.signal
      onUploadProgress: (e) => {
        if (!e.total) return;
        const pct = Math.round((e.loaded * 100) / e.total);
        opts?.onProgress?.(pct);
      },
      // 중요: multipart는 Content-Type을 자동으로 설정(수동 설정 금지)
    });
  }

  // --- 파일 다운로드 (blob + 진행률 + 저장) ---
  async download(
    url: string,
    filename: string,
    opts?: { signal?: AbortSignal; onProgress?: (pct: number) => void }
  ) {
    const res = await this.AXIOS.get<ArrayBuffer>(url, {
      responseType: 'arraybuffer',
      signal: opts?.signal,
      onDownloadProgress: (e) => {
        if (!e.total) return;
        const pct = Math.round((e.loaded * 100) / e.total);
        opts?.onProgress?.(pct);
      },
    });

    // 다운로드 저장(브라우저)
    const blob = new Blob([res.data]);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);

    return res;
  }
}

// 싱글턴
export const api = new ApiClient({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  refreshURL: '/auth/refresh',
  maxRetries: 2,
  onAuthFailed: () => {
    authStore.clear();
    // 예: window.location.href = '/login';
  },
});
```

> **왜 큐잉이 필요하나요?**
> 탭/화면 곳곳에서 동시에 API를 호출하다가 Access 토큰이 만료되면, **동시에 401**이 발생합니다. 이때 한 요청만 리프레시를 수행하고, **나머지는 큐에서 대기 → 리프레시 완료 후 재시도**해야 **중복 리프레시/경합**을 막을 수 있습니다.

---

# 2) React에서 사용 예시

## (1) 업로드(진행률 + 취소)

```tsx
import { useRef, useState } from 'react';
import { api } from '@/lib/axios';

export default function Uploader() {
  const [pct, setPct] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  const onUpload = async (file: File) => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    try {
      await api.upload('/files', file, { folder: 'docs' }, {
        signal: abortRef.current.signal,
        onProgress: setPct,
      });
      alert('업로드 완료');
    } catch (e: any) {
      if (e?.name === 'CanceledError' || e?.code === 'ERR_CANCELED') {
        console.log('사용자 취소');
      } else {
        alert('업로드 실패');
      }
    } finally {
      abortRef.current = null;
    }
  };

  return (
    <div>
      <input type="file" onChange={(e) => e.target.files && onUpload(e.target.files[0])}/>
      <div>진행률: {pct}%</div>
      <button onClick={() => abortRef.current?.abort()}>취소</button>
    </div>
  );
}
```

## (2) 다운로드(진행률 + 취소)

```tsx
import { useRef, useState } from 'react';
import { api } from '@/lib/axios';

export default function Downloader() {
  const [pct, setPct] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  const onDownload = async () => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    try {
      await api.download('/files/report.pdf', 'report.pdf', {
        signal: abortRef.current.signal,
        onProgress: setPct,
      });
    } catch (e: any) {
      if (e?.name === 'CanceledError' || e?.code === 'ERR_CANCELED') {
        console.log('사용자 취소');
      } else {
        alert('다운로드 실패');
      }
    } finally {
      abortRef.current = null;
    }
  };

  return (
    <div>
      <button onClick={onDownload}>다운로드</button>
      <div>진행률: {pct}%</div>
      <button onClick={() => abortRef.current?.abort()}>취소</button>
    </div>
  );
}
```

---

# 3) 동작 요약(“결과화면” 관점)

* **401 응답** 발생 시

  1. 첫 번째 에러의 요청이 **refresh** 시도
  2. 다른 동시 요청들은 **큐에서 대기**
  3. 갱신 성공 → 대기 요청 모두 **새 토큰으로 재시도**
  4. 갱신 실패 → **모두 실패 처리** 후 `onAuthFailed()` 실행(로그아웃/이동)

* **네트워크/5xx 에러**

  * 각 요청은 `maxRetries`(기본 2) 만큼 **지수 백오프 재시도** 후 최종 실패.

* **업/다운로드**

  * 진행률 콜백으로 **% 표시**, `AbortController`로 **사용자 취소** 가능.
  * 업로드는 `FormData` 사용(브라우저가 `Content-Type` 자동 처리).
  * 다운로드는 `arraybuffer → Blob → a.href` 방식으로 파일 저장.

---

# 4) request/response

* **/auth/refresh** 응답 예(권장):

  ```json
  { "accessToken": "new-access", "refreshToken": "new-refresh" }
  ```

  * 새 리프레시 토큰을 매번 주지 않는다면 `refreshToken`은 생략 가능.

* **파일 업로드**: 필드명 `file`(또는 서버 규약)로 수신하도록 합의.

* **다운로드**: `Content-Disposition: attachment; filename="..."` 응답 헤더를 보내면 파일명 파싱도 가능(여기서는 프런트에서 `filename`을 지정).

---
