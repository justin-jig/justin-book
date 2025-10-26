---
title: "SELECT 기본 — 컬럼/별칭/DISTINCT/페이징 입문"
date: 2025-10-25
---

#### 요약 

- 본 문서는 PostgreSQL 실무 기준으로 작성되었습니다.
- 각 절마다 **표/코드블록/Mermaid**를 포함하며, **공식 문서 톤**으로 구성합니다.
- 예제는 PostgreSQL 16 기준이며, `psql` 사용 예시를 제공합니다.

##### 참고자료 (내부 링크 포함)

- [공식 문서 (PostgreSQL Docs)](https://www.postgresql.org/docs/current/)

#### 1. 서문

이 문서는 GitBook 용도로 작성되었으며, 팀/프로젝트 구성원이 **빠르게 학습 → 일관되게 적용 → 안전하게 운영**할 수 있도록
**표준 템플릿** 형식을 유지합니다.


#### 2. SELECT 기초

```sql
SELECT * FROM tb1k;
SELECT number, name AS 이름 FROM tb1k;
SELECT DISTINCT number FROM tb;
```

#### 3. LIMIT/OFFSET (개요)

```sql
SELECT * FROM tb ORDER BY sales DESC LIMIT 5 OFFSET 0;
```

#### 4. 실수 방지 포인트

- `SELECT *` 남용 지양 → 필요한 컬럼만 지정
- 별칭을 적극적으로 사용해 가독성 확보
