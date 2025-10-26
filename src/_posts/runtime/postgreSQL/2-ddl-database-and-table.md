---
title: "DDL — 데이터베이스/테이블 관리"
date: 2025-10-25
---

#### 요약 

- 본 문서는 PostgreSQL 실무 기준으로 작성
- 예제는 PostgreSQL 16 기준이며, `psql` 사용 예시를 제공

##### 참고자료 
- [공식 문서 (PostgreSQL Docs)](https://www.postgresql.org/docs/current/)


#### 1. 데이터베이스

```sql
CREATE DATABASE addrdb;
\c addrdb;
```

#### 2. 테이블 생성/변경/삭제

```sql
CREATE TABLE tb1k (
  number VARCHAR(5),
  name   VARCHAR(10),
  age    INT
);

CREATE TABLE tb (
  number VARCHAR(10),
  sales  INT,
  month  INT
);

CREATE TABLE sungjuck (
  num  INT,
  name VARCHAR(10),
  kor  INT,
  eng  INT,
  math INT
);

ALTER TABLE sungjuck ADD COLUMN total INT;
UPDATE sungjuck SET total = kor + eng + math;
ALTER TABLE sungjuck ADD COLUMN avg FLOAT;

DROP TABLE IF EXISTS old_table;
```

#### 3. 데이터 타입/제약조건 요약

| 타입/제약 | 설명 |
|---|---|
| SERIAL/IDENTITY | 자동 증가 기본키 |
| VARCHAR(n) | 가변 문자열 |
| TIMESTAMP | 날짜/시간 |
| PRIMARY/UNIQUE/NOT NULL | 무결성 보장 |
| CHECK | 값 제약 |
| FOREIGN KEY | 참조 무결성 |
