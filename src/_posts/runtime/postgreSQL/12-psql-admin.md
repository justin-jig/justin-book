---
title: "psql/관리 — 롤/권한/백업/복원"
date: 2025-10-25
---

#### 요약 

- 본 문서는 PostgreSQL 실무 기준으로 작성
- 각 절마다 **표/코드블록/Mermaid**를 포함하며, **공식 문서 톤**으로 구성
- 예제는 PostgreSQL 16 기준이며, `psql` 사용 예시를 제공

##### 참고자료 
- [공식 문서 (PostgreSQL Docs)](https://www.postgresql.org/docs/current/)


#### 1. 롤/권한

```sql
CREATE ROLE app LOGIN PASSWORD 'secret';
GRANT CONNECT ON DATABASE addrdb TO app;
GRANT USAGE, CREATE ON SCHEMA public TO app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app;
```

#### 2. 백업/복원

```bash
pg_dump -h localhost -U postgres -d addrdb -Fc -f addrdb.dump
pg_restore -h localhost -U postgres -d newdb addrdb.dump
# 또는
pg_dump -h localhost -U postgres -d addrdb | psql -h localhost -U postgres -d newdb
```

#### 3. 자주 쓰는 psql 메타

```text
\l   -- DB 목록
\c   -- DB 접속
\dn  -- 스키마 목록
\dt  -- 테이블 목록
\d+ t -- 테이블 상세
```
