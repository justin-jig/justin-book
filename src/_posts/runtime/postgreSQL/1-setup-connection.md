---
title: "설치와 접속 (psql, GUI)"
date: 2025-10-25
---


#### 요약 
- 본 문서는 PostgreSQL 실무 기준으로 작성
- 각 절마다 **표/코드블록/Mermaid**를 포함하며, **공식 문서 톤**으로 구성
- 예제는 PostgreSQL 16 기준이며, `psql` 사용 예시를 제공.

##### 참고자료 
- [공식 문서 (PostgreSQL Docs)](https://www.postgresql.org/docs/current/)


#### 1. 설치 (Docker 예시)

```bash
docker run --name pg -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16
```

#### 2. psql 접속/기본 명령

```bash
psql -h localhost -U postgres -d postgres
-- 비밀번호 입력 후,
\l        -- DB 목록
CREATE DATABASE lab;
\c lab    -- DB 접속
\dt       -- 테이블 목록
\d table  -- 테이블 구조
\q        -- 종료
```

#### 3. GUI

- **pgAdmin**: 브라우저 기반 관리 도구  
- **DBeaver**: 멀티 DB 클라이언트

#### 4. 설정 파일

- `postgresql.conf` : 포트/메모리/병렬 계획 등
- `pg_hba.conf` : 인증/접속 제어(호스트/메소드)
