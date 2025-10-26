---
title: "SELECT 기본 — 컬럼/별칭/DISTINCT/페이징 입문"
date: 2025-10-25
---

#### 요약 

- 본 문서는 PostgreSQL 실무 기준으로 작성
- 각 절마다 **표/코드블록/Mermaid**를 포함하며, **공식 문서 톤**으로 구성
- 예제는 PostgreSQL 16 기준이며, `psql` 사용 예시를 제공

##### 참고자료 (내부 링크 포함)

- [공식 문서 (PostgreSQL Docs)](https://www.postgresql.org/docs/current/)


#### 1. SELECT 기초

```sql
SELECT * FROM tb1k;
SELECT number, name AS 이름 FROM tb1k;
SELECT DISTINCT number FROM tb;
```

#### 2. LIMIT/OFFSET (개요)

```sql
SELECT * FROM tb ORDER BY sales DESC LIMIT 5 OFFSET 0;
```

#### 3. 실수 방지 포인트

- `SELECT *` 남용 지양 → 필요한 컬럼만 지정
- 별칭을 적극적으로 사용해 가독성 확보
