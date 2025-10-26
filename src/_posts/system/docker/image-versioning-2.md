---
title: "이미지 버전 관리 (2) – SBOM과 레텐션 정책"
date: 2025-10-23
---

#### 요약  
이미지 버전 관리는 단순한 태그 관리뿐 아니라  
**SBOM(구성 명세서)** 과 **보존 정책(retention)** 을 포함해야 한다.  
이를 통해 보안, 이력, 컴플라이언스를 함께 관리할 수 있다.  

**핵심 정리**
- SBOM을 각 버전에 포함시켜 구성 투명성 확보.  
- Harbor/ECR 등에서 자동 만료(retention policy) 적용.  
- 장기 보존 버전은 별도 `lts` 또는 `archive` 태그로 관리.  

* SBOM은 이미지 버전의 투명성을 높인다.
* Retention Policy로 저장소 용량과 보안을 함께 관리.
* `lts`, `archive` 태그로 장기 유지 버전을 구분한다.

##### 참고자료
- [SBOM with Trivy](https://github.com/aquasecurity/trivy)
- [Harbor Retention Policy Guide](https://goharbor.io/docs/)
- [OCI Image Metadata](https://github.com/opencontainers/image-spec)

---

#### 1. SBOM 첨부 예시
```bash
trivy image --format cyclonedx --output sbom.xml myapp:1.2.3
docker push myapp:1.2.3
```

> SBOM 파일을 함께 보관해 취약점 추적에 활용한다.

---

#### 2. 장기 보존 정책

| 태그           | 설명                           |
| :----------- | :--------------------------- |
| `lts`        | 장기 지원 버전 (Long Term Support) |
| `archive`    | 만료 전 백업용 보관 이미지              |
| `deprecated` | 사용 중단 예정 버전                  |

---

#### 3. 자동 만료 정책 (ECR 예시)

```json
{
  "rules": [
    {
      "rulePriority": 1,
      "selection": { "tagStatus": "any", "countType": "sinceImagePushed", "countUnit": "days", "countNumber": 30 },
      "action": { "type": "expire" }
    }
  ]
}
```

> 30일 이상 지난 이미지는 자동 삭제된다.
---

