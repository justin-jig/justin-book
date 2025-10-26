---
title: "NULL/불리언 — 3값 논리와 실무 팁"
date: 2025-10-25
---

**v1.0**

#### 요약 (핵심 + 리스트 + 정리문단)

- 본 문서는 PostgreSQL 실무 기준으로 작성
- 각 절마다 **표/코드블록/Mermaid**를 포함하며, **공식 문서 톤**으로 구성
- 예제는 PostgreSQL 16 기준이며, `psql` 사용 예시를 제공

##### 참고자료 (내부 링크 포함)

- [공식 문서 (PostgreSQL Docs)](https://www.postgresql.org/docs/current/)


#### 1. NULL 검사

```sql
SELECT * FROM tb1k WHERE age IS NULL;
SELECT * FROM tb1k WHERE name IS NOT NULL;
```

#### 2. COALESCE/NULLIF

```sql
SELECT COALESCE(age, 0) AS age0 FROM tb1k;
SELECT NULLIF(0,0) AS null_value;
```

#### 3. 불리언 논리

- PostgreSQL은 **TRUE/FALSE/NULL(Unknown)** 3값 논리를 사용합니다.
- `AND`, `OR` 평가 시 NULL 전파에 주의하세요.
