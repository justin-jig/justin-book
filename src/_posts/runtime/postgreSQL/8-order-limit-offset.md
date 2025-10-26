---
title: "정렬/페이징 — ORDER BY, LIMIT, OFFSET"
date: 2025-10-25
---


#### 요약 

- 본 문서는 PostgreSQL 실무 기준으로 작성
- 각 절마다 **표/코드블록/Mermaid**를 포함하며, **공식 문서 톤**으로 구성
- 예제는 PostgreSQL 16 기준이며, `psql` 사용 예시를 제공

##### 참고자료 (

- [공식 문서 (PostgreSQL Docs)](https://www.postgresql.org/docs/current/)



#### 1. ORDER BY

```sql
SELECT * FROM tb ORDER BY sales DESC, number ASC;
```

#### 2. LIMIT/OFFSET

```sql
SELECT * FROM tb ORDER BY sales DESC LIMIT 2 OFFSET 3;
```

#### 3. 상위 N 패턴

```sql
SELECT * FROM tb ORDER BY sales DESC LIMIT 10;
```
