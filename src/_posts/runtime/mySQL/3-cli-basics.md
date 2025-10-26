---
title: "MySQL CLI 명령어 및 기본 사용법 (Command Line Interface Basics)"
date: 2025-10-26
---

**version: 8.0.x**


#### 요약

- MySQL CLI(Command Line Interface)는 서버와 직접 통신하는 **기본 관리 도구**이다.  
- 데이터베이스 접속, 쿼리 실행, 사용자 관리, 백업/복원 등 모든 작업이 가능하다.  
- 본 문서는 **CLI 환경 구성 → 접속 → 주요 명령어 → 실행 예시**까지 설명한다.  

**핵심 정리**
1. 접속 방법 (local / remote / Docker)
2. CLI 명령 체계와 단축키
3. 데이터베이스 / 테이블 관리 명령
4. 쿼리 실행 및 포맷 설정
5. 로그아웃 및 세션 제어


> MySQL CLI는 단순한 콘솔 도구가 아니라,
> **데이터베이스 관리·테이블 설계·권한 제어·쿼리 최적화**까지 수행 가능한 전방위 도구이다.
> 실무에서는 CLI 기반 자동화 스크립트를 작성해 관리 효율을 높이는 것이 일반적이다.

---

##### 참고자료
- [공식 문서: MySQL Shell & Command-Line Client](https://dev.mysql.com/doc/refman/8.0/en/mysql.html)  

---

#### 1. CLI 접속 명령

```bash
mysql -u root -p
```

> 💡 비밀번호 입력 시 터미널에는 표시되지 않습니다.

원격 접속 예시:

```bash
mysql -h 192.168.0.10 -u admin -p
```

Docker 컨테이너 내부 접속:

```bash
docker exec -it mysql8 mysql -u root -p
```

---

#### 2. CLI 모드 내 주요 명령어

| 명령어             | 설명             |
| --------------- | -------------- |
| `help;` 또는 `\h` | 명령어 목록 보기      |
| `\c`            | 현재 입력 중인 명령 취소 |
| `\G`            | 결과를 세로 형식으로 출력 |
| `\u [DB명]`      | 데이터베이스 전환      |
| `exit;` 또는 `\q` | MySQL 종료       |
| `source 파일.sql` | SQL 스크립트 실행    |
| `pager more`    | 페이지 단위 출력 설정   |

---

#### 3. 데이터베이스 / 테이블 관련 명령

```sql
-- 데이터베이스 목록
show databases;

-- 특정 DB 선택
use addrdb;

-- 테이블 목록
show tables;

-- 테이블 구조 확인
desc tb1k;

-- 생성문 확인
show create table tb1k;
```

> ✅ `desc` 와 `show create table`은 스키마 확인 시 가장 자주 쓰이는 명령입니다.

---

#### 4. 출력 포맷 및 결과 정렬

```sql
select * from tb1k \G   -- 세로 출력
```

결과 예시:

```
*************************** 1. row ***************************
number: A101
name:   강신우
age:    40
```

---

#### 5. 파일로 SQL 실행

```bash
mysql -u root -p < init_schema.sql
```

특정 DB에 실행:

```bash
mysql -u root -p addrdb < data_insert.sql
```

> ⚙️ `source` 명령과 동일하나, CLI 밖에서 바로 실행 가능.

---

#### 6. CLI 환경 변수

```bash
# 환경변수 확인
mysql -e "select @@hostname, @@port, @@version;"

# SQL 모드 확인
mysql -e "select @@sql_mode;"
```

| 항목             | 설명       |
| -------------- | -------- |
| `@@hostname`   | 호스트명     |
| `@@port`       | 연결 포트    |
| `@@version`    | MySQL 버전 |
| `@@autocommit` | 자동 커밋 여부 |

---

#### 7. CLI 단축키 모음

| 단축키      | 기능              |
| -------- | --------------- |
| ↑ / ↓    | 이전 명령 탐색        |
| Ctrl + L | 화면 지우기          |
| Ctrl + C | 현재 명령 취소        |
| Tab      | 명령 자동 완성        |
| Ctrl + R | 명령 검색 (히스토리 탐색) |

---

#### 8. 기본 실행 흐름 (Mermaid)

```mermaid
flowchart LR
  A[CLI 실행] --> B[로그인 (mysql -u -p)]
  B --> C[DB 선택 (use database)]
  C --> D[SQL 실행 (select, insert...)]
  D --> E[결과 확인 (\G, limit)]
  E --> F[필요 시 스크립트 실행 (source)]
  F --> G[exit; 종료]
```

---

#### 9. 오류 상황 대처

| 상황                 | 원인       | 해결 방법                     |
| ------------------ | -------- | ------------------------- |
| `ERROR 1045`       | 비밀번호 오류  | root 암호 재설정 또는 sudo mysql |
| `ERROR 2002`       | 소켓 접근 불가 | MySQL 서비스 실행 여부 확인        |
| `Unknown database` | 잘못된 DB명  | show databases; 로 이름 확인   |

---

#### 10. CLI 종료 및 세션 관리

```sql
exit;
-- 또는
\q
```

* MySQL CLI는 `;` 또는 `\g` 로 명령 종료를 인식함
* 다중 세션 관리 시 `mysql --prompt` 옵션으로 구분 가능

---


