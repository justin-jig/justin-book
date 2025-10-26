---
title: "MySQL DCL — 데이터 제어어 (Data Control Language)"
date: 2025-10-26
---

**version: 8.0.x**

---

#### 요약

- DCL(Data Control Language)은 **사용자 계정과 접근 권한을 제어하는 SQL 명령어**다.  
- MySQL 서버의 보안, 데이터 접근 제한, 권한 부여/회수 작업에 활용된다.  
- DCL 명령은 시스템 DB(`mysql` 스키마)의 `user` 테이블을 변경하며,  
  **DBA(관리자) 권한**으로만 실행 가능하다.

> DCL은 MySQL의 보안과 데이터 접근 제어의 핵심이다.
> 사용자 생성 → 권한 부여 → 권한 검증 → 필요 시 회수 → 최종 삭제의
> 일련의 프로세스를 통해 **DB 접근 제어 정책을 명확하게 유지**해야 한다.
> 잘못된 권한 설정은 데이터 유출 및 운영 장애로 이어질 수 있으므로,
> “최소 권한 원칙(Principle of Least Privilege)”을 반드시 준수하자.

**핵심 포인트**
1. 사용자 생성 및 비밀번호 설정 (`CREATE USER`)  
2. 권한 부여 (`GRANT`) / 회수 (`REVOKE`)  
3. 권한 적용 (`FLUSH PRIVILEGES`)  
4. 사용자 관리 및 삭제 (`DROP USER`)  
5. 권한 조회 (`SHOW GRANTS`)  

---

##### 참고자료  
- [공식 문서: MySQL GRANT Syntax](https://dev.mysql.com/doc/refman/8.0/en/grant.html)  

---

#### 1. DCL 개요

| 항목 | 설명 |
|------|------|
| **주요 목적** | 사용자 인증 및 접근 제어 |
| **관리 대상** | 계정(user) / 권한(privilege) / 호스트(host) |
| **실행 권한** | root 또는 SUPER 권한 계정 |
| **관련 시스템 DB** | mysql.user, mysql.db, mysql.tables_priv |

---

#### 2. 사용자 생성

```sql
create user 'testuser'@'localhost' identified by '1234';
```

| 요소              | 설명                  |
| --------------- | ------------------- |
| `'testuser'`    | 사용자명                |
| `'localhost'`   | 접속 호스트(원격 접속 시 `%`) |
| `identified by` | 비밀번호 지정             |

> 💡 `'localhost'` 대신 `'%'` 를 사용하면 모든 IP에서 접근 가능하지만,
> **보안상 제한된 IP 또는 도메인으로 관리하는 것이 권장된다.**

---

#### 3. 사용자 목록 확인

```sql
select user, host, plugin from mysql.user;
```

| user     | host      | plugin                |
| -------- | --------- | --------------------- |
| root     | localhost | caching_sha2_password |
| testuser | localhost | caching_sha2_password |

> ⚙️ `plugin` 컬럼은 인증 방식이며, MySQL 8.0부터 `caching_sha2_password`가 기본값이다.

---

#### 4. 권한 부여 (GRANT)

```sql
grant all privileges on addrdb.* to 'testuser'@'localhost';
flush privileges;
```

| 범위                       | 의미                |
| ------------------------ | ----------------- |
| `addrdb.*`               | 특정 데이터베이스의 모든 테이블 |
| `*.*`                    | 모든 데이터베이스 전체      |
| `select, insert, update` | 개별 권한 지정 가능       |

부분 권한 부여 예시:

```sql
grant select, insert on addrdb.tb1k to 'testuser'@'localhost';
```

---

#### 5. 권한 회수 (REVOKE)

```sql
revoke insert, update on addrdb.* from 'testuser'@'localhost';
flush privileges;
```

> ⚠️ `revoke` 후 `flush privileges;` 명령으로 즉시 적용해야 함.

---

#### 6. 권한 확인

```sql
show grants for 'testuser'@'localhost';
```

출력 예시:

```
GRANT SELECT, INSERT ON `addrdb`.`tb1k` TO `testuser`@`localhost`
```

---

#### 7. 사용자 삭제

```sql
drop user 'testuser'@'localhost';
```

> 💡 `DROP USER` 시 해당 사용자가 보유한 객체(뷰, 이벤트)는 함께 제거되지 않음.

---

#### 8. DCL 실행 흐름 (Mermaid)

```mermaid
flowchart LR
  A[CREATE USER] --> B[GRANT PRIVILEGES]
  B --> C[FLUSH PRIVILEGES]
  C --> D{권한 확인?}
  D -- Yes --> E[SHOW GRANTS]
  D -- No --> F[REVOKE or MODIFY]
  E --> G[DROP USER (필요 시 삭제)]
```

---

#### 9. 권한 관리 실무 예시

```sql
-- 읽기 전용 계정
create user 'readonly'@'%' identified by 'safe123!';
grant select on addrdb.* to 'readonly'@'%';
flush privileges;

-- 개발용 계정
create user 'dev'@'%' identified by 'devpass';
grant all privileges on addrdb.* to 'dev'@'%';
flush privileges;
```

| 구분 | 계정       | 권한      | 용도        |
| -- | -------- | ------- | --------- |
| 운영 | root     | 전체      | 시스템 관리    |
| 개발 | dev      | CRUD 전체 | 개발 DB 접근  |
| 분석 | readonly | SELECT만 | 데이터 조회 전용 |

---

#### 10. 보안 모범 사례

1. root 계정은 직접 로그인 금지, `sudo mysql` 또는 별도 관리자 계정 사용
2. 비밀번호 정책 강화 (`validate_password_policy=STRONG`)
3. 모든 사용자 권한 최소화 (Least Privilege Principle)
4. 원격 접속 허용 시 SSL/TLS 구성 고려 (`require ssl`)
5. 주기적 권한 점검 (`show grants for ...`)

---


