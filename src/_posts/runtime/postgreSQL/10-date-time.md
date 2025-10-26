---
title: "날짜/시간 — NOW, EXTRACT, TO_CHAR, TIME ZONE"
date: 2025-10-25
---

**v1.0**

#### 요약 

- 본 문서는 PostgreSQL 실무 기준으로 작성
- 각 절마다 **표/코드블록/Mermaid**를 포함하며, **공식 문서 톤**으로 구성
- 예제는 PostgreSQL 16 기준이며, `psql` 사용 예시를 제공

##### 참고자료
- [공식 문서 (PostgreSQL Docs)](https://www.postgresql.org/docs/current/)


#### 1. NOW/EXTRACT/AGE

```sql
SELECT NOW(), CURRENT_DATE, EXTRACT(YEAR FROM NOW()) AS yyyy;
SELECT AGE(NOW(), TIMESTAMP '2024-01-01 00:00:00');
```

#### 2. 포맷팅

```sql
SELECT TO_CHAR(NOW(), 'YYYY-MM-DD HH24:MI:SS');
```

#### 3. TIME ZONE

```sql
SET TIME ZONE 'Asia/Seoul';
SELECT NOW() AT TIME ZONE 'UTC' AS utc_now;
```

#### 4. DEFAULT NOW()

```sql
CREATE TABLE rightnow (
  a SERIAL PRIMARY KEY,
  b TIMESTAMP DEFAULT NOW()
);
INSERT INTO rightnow DEFAULT VALUES;
```
