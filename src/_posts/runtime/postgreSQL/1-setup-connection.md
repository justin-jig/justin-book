---
title: "설치와 접속 (psql, GUI)"
date: 2025-10-25
---


#### 요약 (핵심 + 리스트 + 정리문단)

- 본 문서는 PostgreSQL 실무 기준으로 작성되었습니다.
- 각 절마다 **표/코드블록/Mermaid**를 포함하며, **공식 문서 톤**으로 구성합니다.
- 예제는 PostgreSQL 16 기준이며, `psql` 사용 예시를 제공합니다.

##### 참고자료 (내부 링크 포함)

- [공식 문서 (PostgreSQL Docs)](https://www.postgresql.org/docs/current/)

#### 1. 서문

이 문서는 GitBook 용도로 작성되었으며, 팀/프로젝트 구성원이 **빠르게 학습 → 일관되게 적용 → 안전하게 운영**할 수 있도록
**표준 템플릿** 형식을 유지합니다.


#### 2. 설치 (Docker 예시)

```bash
docker run --name pg -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16
```

#### 3. psql 접속/기본 명령

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

#### 4. GUI

- **pgAdmin**: 브라우저 기반 관리 도구  
- **DBeaver**: 멀티 DB 클라이언트

#### 5. 설정 파일

- `postgresql.conf` : 포트/메모리/병렬 계획 등
- `pg_hba.conf` : 인증/접속 제어(호스트/메소드)
