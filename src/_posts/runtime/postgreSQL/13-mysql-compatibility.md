---
title: "MySQL ↔ PostgreSQL 변환 포인트"
date: 2025-10-25
---

#### 요약 

- 본 문서는 PostgreSQL 실무 기준으로 작성
- 각 절마다 **표/코드블록/Mermaid**를 포함하며, **공식 문서 톤**으로 구성
- 예제는 PostgreSQL 16 기준이며, `psql` 사용 예시를 제공

##### 참고자료 (내부 링크 포함)

- [00-overview](./00-overview.md)
- [01-setup-and-connection](./01-setup-and-connection.md)
- [공식 문서 (PostgreSQL Docs)](https://www.postgresql.org/docs/current/)

#### 1. 서문

이 문서는 GitBook 용도로 작성되었으며, 팀/프로젝트 구성원이 **빠르게 학습 → 일관되게 적용 → 안전하게 운영**할 수 있도록
**표준 템플릿** 형식을 유지합니다.


#### 2. 변환 요약 표

| 항목 | MySQL | PostgreSQL |
|---|---|---|
| 자동 증가 | AUTO_INCREMENT | SERIAL / IDENTITY |
| 문자열 연결 | CONCAT(a,b) | a || b |
| LIKE | 대소문자 무시 옵션 없음 | ILIKE (대소문자 무시) |
| GROUP BY | 느슨 | 엄격 (비집계 컬럼 모두 명시) |
| LIMIT | LIMIT n OFFSET m, 또는 LIMIT m,n | LIMIT n OFFSET m |

#### 3. 예시 변환

```sql
-- MySQL
SELECT CONCAT(number,name,'님') FROM tb1k;
-- PostgreSQL
SELECT number || name || '님' FROM tb1k;
```

```sql
-- MySQL
CREATE TABLE t (id INT AUTO_INCREMENT PRIMARY KEY);
-- PostgreSQL
CREATE TABLE t (id SERIAL PRIMARY KEY);
```
