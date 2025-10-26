---
title: "DML — INSERT/UPDATE/DELETE/RETURNING"
date: 2025-10-25
---

#### 요약 

- 본 문서는 PostgreSQL 실무 기준으로 작성
- 각 절마다 **표/코드블록/Mermaid**를 포함하며, **공식 문서 톤**으로 구성
- 예제는 PostgreSQL 16 기준이며, `psql` 사용 예시를 제공.

##### 참고자료 (내부 링크 포함)

- [공식 문서 (PostgreSQL Docs)](https://www.postgresql.org/docs/current/)

#### 1. 서문

이 문서는 GitBook 용도로 작성되었으며, 팀/프로젝트 구성원이 **빠르게 학습 → 일관되게 적용 → 안전하게 운영**할 수 있도록
**표준 템플릿** 형식을 유지합니다.


#### 2. INSERT

```sql
INSERT INTO tb1k VALUES ('A101','강신우',40);
INSERT INTO tb1k (number, name) VALUES ('A104','문소리');
INSERT INTO tb (number, sales, month) VALUES
('A103',101,4), ('A102',54,5), ('A104',181,4);
```

#### 3. UPDATE / DELETE / RETURNING

```sql
UPDATE tb1k SET age = age + 1 WHERE name = '박문수' RETURNING *;
DELETE FROM tb WHERE month = 6 RETURNING number, sales;
```

#### 4. 트랜잭션 기초

```sql
BEGIN;
UPDATE tb SET sales = sales + 10 WHERE number = 'A101';
COMMIT;
-- ROLLBACK; -- 되돌리기
```
