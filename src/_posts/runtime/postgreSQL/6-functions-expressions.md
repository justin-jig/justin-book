---
title: "함수/표현식 — 문자열, 수치, 캐스팅, 날짜"
date: 2025-10-25
---

#### 요약 

- 본 문서는 PostgreSQL 실무 기준으로 작성
- 각 절마다 **표/코드블록/Mermaid**를 포함하며, **공식 문서 톤**으로 구성
- 예제는 PostgreSQL 16 기준이며, `psql` 사용 예시.

##### 참고자료 

- [공식 문서 (PostgreSQL Docs)](https://www.postgresql.org/docs/current/)


#### 1. 문자열 함수

```sql
SELECT number || name || '님' AS welcome FROM tb1k;
SELECT RIGHT(number,2), LEFT(name,2) FROM tb1k;
SELECT SUBSTRING(number FROM 2 FOR 3) FROM tb1k;
SELECT REPEAT('*', GREATEST(age,0)) FROM tb1k;
SELECT REVERSE(name) FROM tb1k;
```

#### 2. 집계/수치

```sql
SELECT SUM(sales) AS 합계 FROM tb;
SELECT '합계는 ' || SUM(sales) || '만원입니다.' AS 매출 FROM tb;
SELECT '평균은 ' || ROUND(AVG(sales),2) || '만원입니다.' AS 평균 FROM tb;
```

#### 3. 캐스팅/형변환

```sql
SELECT CAST(123 AS TEXT);
SELECT 123::TEXT;
```

#### 4. 날짜/시간

```sql
SELECT NOW() AS 현재시간, CURRENT_DATE, AGE(NOW(), NOW() - INTERVAL '3 days');
SELECT TO_CHAR(NOW(), 'YYYY-MM-DD HH24:MI:SS');
```
