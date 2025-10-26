---
title: "이미지 버전 관리 (1) – 태그 전략"
date: 2025-10-23
---

#### 요약  
이미지 버전은 서비스 배포의 일관성을 결정하는 핵심 요소이다.  
명확한 태그 정책을 수립하면 롤백·재현·릴리스 관리가 용이하다.  

**핵심 정리**
- SemVer(`v1.2.3`) 또는 날짜 기반(`2025.10.23`) 버전 체계 사용.  
- 환경별(`dev`, `staging`, `prod`) 태그 병행 운영.  
- `latest` 사용은 최소화하고 안정 버전을 명시.  
  
* 명확한 태그 규칙은 운영 안정성을 높인다.
* Git 버전과 Docker 이미지 버전을 일관되게 유지.
* 환경별 태그로 배포 단계를 구분한다.

##### 참고자료
- [Docker Tag Reference](https://docs.docker.com/engine/reference/commandline/tag/)
- [Semantic Versioning](https://semver.org/)

---

#### 1. 태그 정책 예시
| 환경 | 예시 태그 | 설명 |
|:--|:--|:--|
| 개발 | myapp:dev-20251023 | 임시 개발용 |
| 스테이징 | myapp:stg-1.2.3 | 테스트 배포용 |
| 운영 | myapp:prod-1.2.3 | 안정화 릴리스용 |

---

#### 2. Git 기반 자동 태깅
```bash
git tag -a v1.2.3 -m "Release 1.2.3"
docker build -t myapp:v1.2.3 .
docker push myapp:v1.2.3
```

> Git 태그와 Docker 태그를 동기화해 일관성을 확보한다.

---

#### 3. 롤백 절차

```bash
docker pull myapp:v1.1.9
docker compose -f docker-compose.yml up -d
```
> 명시적 버전으로 재배포하여 예기치 않은 변경 방지.
---
