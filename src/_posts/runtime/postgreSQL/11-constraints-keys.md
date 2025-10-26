---
title: "제약조건/키 — PK/UK/NN/CHECK/FK"
date: 2025-10-25
---

#### 요약 

- 본 문서는 PostgreSQL 실무 기준으로 작성
- 각 절마다 **표/코드블록/Mermaid**를 포함하며, **공식 문서 톤**으로 구성
- 예제는 PostgreSQL 16 기준이며, `psql` 사용 예시를 제공

##### 참고자료 

- [공식 문서 (PostgreSQL Docs)](https://www.postgresql.org/docs/current/)


#### 1. 기본 예시

```sql
CREATE TABLE customer (
  id      SERIAL PRIMARY KEY,
  email   TEXT UNIQUE NOT NULL,
  age     INT  CHECK (age >= 0),
  team_id INT,
  CONSTRAINT fk_team FOREIGN KEY (team_id) REFERENCES team(id) ON DELETE SET NULL
);
```

#### 2. SERIAL vs IDENTITY

| 항목 | SERIAL | IDENTITY |
|---|---|---|
| 정의 | 시퀀스 + 기본값 | 표준 SQL IDENTITY |
| 사용 | 간단/익숙 | 표준호환/세밀 제어 |
