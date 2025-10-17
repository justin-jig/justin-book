---
title: "json-to-pretty"
date: 2025-10-17
---

npm 라이브러리 설치 https://www.npmjs.com/package/json-to-pretty-yaml  

#  JSON → YAML 변환 처리 구조 정리
## 🔹 1. Back-End에서 포맷팅하는 경우
###  처리 순서

1. **브라우저 요청 (HTTP Request)**

   * `Content-Type: application/json`
   * JSON 형식으로 데이터를 요청

2. **서버(Back-End) 처리**

   * API Controller에서 요청을 받음
   * 내부적으로 **Kubernetes API** 등에 HTTP 요청 → JSON 데이터 응답 수신

3. **데이터 포맷팅**

   * JSON 데이터를 **YAML 형식으로 변환**

4. **HTTP 응답**

   * 변환된 YAML 데이터를 HTTP Response로 반환
   * 헤더 설정:

     ```
     Content-Type: application/x-yaml
     ```

### ✅ 장점

* 포맷팅 로직이 중앙화되어 유지보수가 용이
* 클라이언트가 단순히 다운로드만 수행하면 됨
* 일관된 YAML 포맷 유지 가능

### ⚠️ 단점

* 서버 부하 증가 (요청마다 변환 작업 수행)
* 프런트엔드에서 사용자별 커스텀 포맷 적용 어려움

---

## 🔹 2. Front-End에서 포맷팅하는 경우

### ✅ 처리 순서

1. **라이브러리 설치**

   * [json-to-pretty-yaml](https://www.npmjs.com/package/json-to-pretty-yaml)

     ```bash
     npm install json-to-pretty-yaml
     ```

2. **HTTP 요청**

   * 백엔드에서 JSON 데이터를 응답으로 받음

3. **클라이언트에서 변환**

   * 라이브러리를 이용해 JSON → YAML 변환

4. **파일 다운로드 처리**

   * 변환된 YAML 데이터를 `Blob` 객체로 생성
   * Local URL 생성 후 `a` 태그 클릭으로 자동 다운로드

---

## 🔹 구현 예시 코드 (Front-End)

```javascript
import yaml from 'json-to-pretty-yaml';

// 예시 JSON 데이터
const jsonData = {
  name: "example",
  type: "deployment",
  replicas: 3
};

// JSON → YAML 변환
const yamlData = yaml.stringify(jsonData);

// Blob 객체 생성 (바이너리 데이터용)
const blob = new Blob([yamlData], { type: 'application/x-yaml' });

// 다운로드용 링크 생성
const link = document.createElement('a');
link.href = URL.createObjectURL(blob);
link.download = 'data.yaml';

// 다운로드 트리거
link.click();
```

---

## 📎 추가 설명

| 개념                            | 설명                                             |
| ----------------------------- | ---------------------------------------------- |
| **Blob 객체**                   | 브라우저에서 파일, 이미지, 텍스트 등 **바이너리 데이터를 저장**하기 위한 객체 |
| **URL.createObjectURL(blob)** | Blob 데이터를 임시 URL로 만들어 브라우저에서 접근할 수 있게 함        |
| **application/x-yaml**        | YAML 파일 형식의 MIME 타입 (다운로드 시 올바른 확장자 지정)        |

---

## 🔍 비교 요약

| 구분      | Back-End 포맷팅         | Front-End 포맷팅         |
| ------- | -------------------- | --------------------- |
| 변환 위치   | 서버 내부                | 클라이언트 브라우저            |
| 부하      | 서버에 집중               | 클라이언트 분산              |
| 제어권     | 서버에서 일괄 관리           | 사용자 측 커스터마이징 가능       |
| 다운로드 방식 | HTTP 응답 스트림          | Blob 객체를 통한 local URL |
| MIME 타입 | `application/x-yaml` | `application/x-yaml`  |

---

