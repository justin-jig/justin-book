---
title: "GROUP BY/HAVING — 표준 규칙과 실습"
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


#### 2. 기본 패턴

```sql
SELECT number, COUNT(*) AS 건수
FROM tb
GROUP BY number;

SELECT number, SUM(sales) AS 합계
FROM tb
GROUP BY number
ORDER BY SUM(sales) DESC;

SELECT number, AVG(sales) AS 평균
FROM tb
GROUP BY number
HAVING SUM(sales) >= 200
ORDER BY AVG(sales) DESC;
```

#### 3. WHERE vs HAVING

- WHERE: **그룹화 이전**의 행 필터
- HAVING: **그룹화 이후**의 그룹 필터
