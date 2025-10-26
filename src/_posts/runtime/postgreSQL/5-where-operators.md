---
title: "WHERE/연산자 — 비교/논리/집합/패턴"
date: 2025-10-25
---

#### 요약 

- 본 문서는 PostgreSQL 실무 기준으로 작성
- 각 절마다 **표/코드블록/Mermaid**를 포함하며, **공식 문서 톤**으로 구성
- 예제는 PostgreSQL 16 기준이며, `psql` 사용 예시를 제공.

##### 참고자료 

- [공식 문서 (PostgreSQL Docs)](https://www.postgresql.org/docs/current/)



#### 1. 비교/논리/집합

```sql
SELECT * FROM tb WHERE sales >= 100;
SELECT * FROM tb WHERE sales BETWEEN 50 AND 100;
SELECT * FROM tb WHERE month IN (4,5);
SELECT * FROM tb WHERE sales > 50 AND sales <= 100;
SELECT * FROM tb WHERE sales < 50 OR sales > 2000;
```

#### 2. LIKE vs ILIKE

```sql
SELECT * FROM tb1k WHERE name LIKE '%김%';   -- 대소문자 구분
SELECT * FROM tb1k WHERE name ILIKE '%kim%'; -- 대소문자 무시
```

#### 3. 괄호 우선순위

```sql
SELECT * FROM tb
WHERE number LIKE '%1' AND (month = 4 OR sales >= 200);
```
