---
title: "PR 및 변경 이력 관리 (Pull Requests & Changelog)"
date: 2025-10-23
---

#### 요약  
변경 이력은 협업과 품질 관리의 근간이다.  
PR(Pull Request) 기반 개발 프로세스와 CHANGELOG 관리로  
코드·문서·이미지 변경 내역을 명확히 추적할 수 있다.  

**핵심 정리**
- 모든 변경은 PR 단위로 리뷰 및 승인 절차를 거친다.  
- CHANGELOG는 버전별 주요 변경 내역을 기록한다.  
- 자동 생성 도구(Conventional Changelog, GitHub Release Note)를 활용한다.  

* 모든 변경은 PR 기반으로 기록되어야 한다.
* CHANGELOG로 버전별 변경 이력을 추적한다.
* 자동화된 changelog 생성 도구로 관리 효율성을 높인다.

##### 참고자료
- [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Release Notes API](https://docs.github.com/en/rest/releases/releases)

---

#### 1. PR 작성 가이드
| 항목 | 내용 |
|:--|:--|
| 제목 | feat: 새로운 기능 추가 |
| 내용 | 변경 이유, 테스트 방법, 관련 이슈 번호 |
| 라벨 | enhancement / bugfix / docs 등 |

---

#### 2. CHANGELOG 구조
```markdown
# Changelog

## [1.2.3] - 2025-10-23
### Added
- Compose 프로파일 기능 추가

### Fixed
- 이미지 태그 캐시 문제 해결

### Changed
- Node 베이스 이미지 20 → 21 버전 업데이트
```

---

#### 3. 자동 생성 명령

```bash
npx conventional-changelog -p angular -i CHANGELOG.md -s
```

> 커밋 메시지 규칙(`feat`, `fix`, `chore` 등)에 따라 자동 생성.

---
