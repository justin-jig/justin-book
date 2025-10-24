---
title: "실무 패턴(Recipes) — 파일 업로드, 무한 스크롤, i18n, 에러 바운더리"
date: 2025-10-24
---

**Next.js 15 / React 19 기준**

#### 요약
Next.js는 App Router와 Server Actions를 활용해  
복잡한 실무 기능(파일 업로드, 무한 스크롤, 다국어 지원, 에러 경계)을 간결하게 구성할 수 있다.  
본 문서는 **재사용 가능한 코드 패턴(Recipes)** 중심으로 정리된다.

- S3 Direct Upload 패턴 (Route Handler + Client Form)  
- 무한 스크롤 Intersection Observer  
- 다국어(i18n) 동적 로딩 구조  
- Error Boundary 패턴 (`error.tsx`, Client Error Wrapper)  
- Server Actions 기반 비동기 이벤트 처리  

> 요약 정리:  
> Next.js 15는 RSC, Server Actions, Edge 런타임을 조합해  
> 복잡한 UX 패턴을 프레임워크 수준에서 단순화했다.

> **정리:**
>
> * 파일 업로드 → Route Handler + FormData
> * 무한 스크롤 → Intersection Observer
> * i18n → URL 세그먼트 기반
> * 에러 바운더리 → Client Error Wrapper
>
> 이 네 가지 패턴은 대부분의 실무 웹앱에 즉시 적용 가능한 “Next.js 베스트 프랙티스”이다.

##### 참고자료  
- [File Upload Guide](https://nextjs.org/docs/app/building-your-application/data-fetching/file-uploads)  
- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)  
- [Next.js i18n Internationalization](https://nextjs.org/docs/app/building-your-application/routing/internationalization)  
- [Intersection Observer API](https://developer.mozilla.org/docs/Web/API/Intersection_Observer_API)

---

#### 1. 파일 업로드 (S3 Direct Upload)

##### 1-1. 서버(Route Handler) 구성

```ts
// app/api/upload/route.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
  },
});

export async function POST(req: Request) {
  const data = await req.formData();
  const file = data.get("file") as File;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET!,
    Key: file.name,
    Body: await file.arrayBuffer(),
    ContentType: file.type,
  });

  await s3.send(command);
  return Response.json({ message: "uploaded", name: file.name });
}
```

##### 1-2. 클라이언트(Form)

```tsx
"use client";
import { useState } from "react";

export default function UploadForm() {
  const [status, setStatus] = useState("");

  async function handleUpload(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const result = await res.json();
    setStatus(result.message);
  }

  return (
    <form onSubmit={handleUpload}>
      <input type="file" name="file" />
      <button type="submit">업로드</button>
      <p>{status}</p>
    </form>
  );
}
```

> AWS S3 외에도 Cloudflare R2, MinIO 등 S3 호환 스토리지를 동일한 방식으로 처리 가능하다.

---

#### 2. 무한 스크롤 (Infinite Scroll)

##### 2-1. 데이터 로드 API

```ts
// app/api/posts/route.ts
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") ?? 1);
  const posts = await db.post.findMany({ skip: (page - 1) * 10, take: 10 });
  return Response.json(posts);
}
```

##### 2-2. 클라이언트 구현

```tsx
"use client";
import { useEffect, useRef, useState } from "react";

export default function InfiniteScroll() {
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const loader = useRef(null);

  useEffect(() => {
    fetch(`/api/posts?page=${page}`)
      .then(res => res.json())
      .then(data => setPosts(prev => [...prev, ...data]));
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) setPage(p => p + 1);
    });
    if (loader.current) observer.observe(loader.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      {posts.map(p => <p key={p.id}>{p.title}</p>)}
      <div ref={loader}>Loading more...</div>
    </div>
  );
}
```

> Intersection Observer는 브라우저 스크롤 이벤트보다 성능이 뛰어나며,
> React Suspense와 함께 Streaming UI에도 적합하다.

---

#### 3. 다국어(i18n) 구성

Next.js는 URL 기반 혹은 `useLocale()` 훅 기반의 다국어 구조를 지원한다.

##### 설정 (`next.config.js`)

```js
module.exports = {
  i18n: {
    locales: ["en", "ko", "ja"],
    defaultLocale: "ko",
  },
};
```

##### 다국어 라우팅 예시

```text
/app/[locale]/page.tsx
/app/[locale]/about/page.tsx
```

##### 번역 JSON 동적 로딩

```tsx
import fs from "fs/promises";
import path from "path";

export async function getDictionary(locale) {
  const file = path.join(process.cwd(), "dictionaries", `${locale}.json`);
  return JSON.parse(await fs.readFile(file, "utf8"));
}
```

```tsx
// app/[locale]/page.tsx
export default async function Page({ params }) {
  const dict = await getDictionary(params.locale);
  return <h1>{dict.title}</h1>;
}
```

> 다국어 라우팅은 URL 세그먼트로 처리되며,
> RSC 환경에서도 번역 JSON을 서버에서 직접 불러올 수 있다.

---

#### 4. 에러 바운더리 (Error Boundary Pattern)

##### 4-1. 전역 에러 페이지

```tsx
// app/error.tsx
"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <h2>문제가 발생했습니다 😥</h2>
        <p>{error.message}</p>
        <button onClick={() => reset()}>다시 시도</button>
      </body>
    </html>
  );
}
```

##### 4-2. 특정 라우트 전용 에러 페이지

```tsx
// app/dashboard/error.tsx
"use client";
export default function DashboardError({ error }) {
  return <p>대시보드 오류: {error.message}</p>;
}
```

##### 4-3. Client Error Boundary Wrapper

```tsx
"use client";
import { Component, ReactNode } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return <h3>UI 복구 중...</h3>;
    return this.props.children;
  }
}
```

> RSC 영역은 try/catch로, 클라이언트 영역은 Error Boundary로 각각 보호하는 것이 일반적이다.

---

#### 5. 비동기 이벤트 처리(Server Actions + UI 연동)

Server Actions를 사용하면
사용자 액션 → 서버 처리 → UI 갱신의 플로우를 단일 함수로 구성할 수 있다.

```tsx
"use server";

import { revalidatePath } from "next/cache";

export async function deletePost(id) {
  await db.post.delete({ where: { id } });
  revalidatePath("/dashboard");
}
```

```tsx
"use client";
import { useTransition } from "react";
import { deletePost } from "./actions";

export default function DeleteButton({ id }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      onClick={() => startTransition(() => deletePost(id))}
      disabled={pending}
    >
      {pending ? "삭제 중..." : "삭제"}
    </button>
  );
}
```

> 이 패턴은 API 라우트를 직접 호출하지 않고,
> 서버 함수만으로 데이터를 변경하고 UI를 즉시 갱신한다.

---

#### 6. 결론

Next.js 15는 복잡한 실무 패턴을 “**Server Actions + App Router + Suspense**” 조합으로 단순화했다.
파일 업로드, 무한 스크롤, 다국어, 에러 복구 등
모든 기능이 React의 서버/클라이언트 경계를 유지한 채 통합된다.



