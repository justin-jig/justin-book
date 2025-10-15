---
title: "TIL - Next.js 프로젝트 생성"
date: 2025-02-10
---
# Kubernetes HPA 레퍼런스 모음 (업데이트: 2025-08-20)

> **추천 읽기 순서:** ① 한국어 공식 문서 → ② 영어 공식/최신 스펙 → ③ 실무형 가이드 & 베스트 프랙티스

---

## ① 시작 가이드 (한국어 공식 문서)

- **Kubernetes 공식 한국어 문서 – Horizontal Pod Autoscaling**
  - 개념, 적용 대상, 기본 동작(스케일 업/다운) 개요
  - https://kubernetes.io/ko/docs/tasks/run-application/horizontal-pod-autoscale/

- **Kubernetes 공식 한국어 튜토리얼 – HPA 연습(Walkthrough)**
  - 단계별 실습 흐름으로 HPA 테스트
  - https://kubernetes.io/ko/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/

---

## ② 심화 / 최신 스펙 (영어 공식 문서)

- **Kubernetes 공식 문서 – Horizontal Pod Autoscaling (autoscaling/v2 중심)**
  - 최신 권장 API(`autoscaling/v2`), 알고리즘/정책(안정화 윈도우, scaleUp/Down 정책 등) 포함
  - https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/

- **Kubernetes 공식 튜토리얼 – HPA Walkthrough**
  - 실제 예제로 HPA 생성/검증 절차
  - https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/

- **API 레퍼런스 – HorizontalPodAutoscaler (autoscaling/v2)**
  - 스펙 필드(behaviors, metrics, policies 등) 상세 정의
  - https://kubernetes.io/docs/reference/kubernetes-api/workload-resources/horizontal-pod-autoscaler-v2/

- **리소스 메트릭 파이프라인 (metrics-server 동작 개요)**
  - metrics-server가 kubelet에서 수집 → metrics.k8s.io로 노출 → HPA/`kubectl top` 등 사용
  - https://kubernetes.io/docs/tasks/debug/debug-cluster/resource-metrics-pipeline/

---

## ③ 실무 가이드 & 베스트 프랙티스

### 메트릭 파이프라인 구성 요소

- **Metrics Server (공식 사이트)**
  - 리소스(CPU/메모리) 메트릭을 HPA에 제공하는 기본 컴포넌트
  - https://kubernetes-sigs.github.io/metrics-server/
  - GitHub: https://github.com/kubernetes-sigs/metrics-server

- **Prometheus Adapter (공식)**
  - Prometheus 지표를 Custom/External Metrics API로 노출 → HPA에서 RPS 등 맞춤 지표 사용
  - https://github.com/kubernetes-sigs/prometheus-adapter

### 클라우드 벤더 가이드(참고)

- **GKE – Horizontal Pod autoscaling 개념**
  - CPU/메모리/커스텀/외부 메트릭 기반 스케일링 개요
  - https://cloud.google.com/kubernetes-engine/docs/concepts/horizontalpodautoscaler

- **EKS – HPA 개요 & metrics-server 참고**
  - https://docs.aws.amazon.com/eks/latest/userguide/horizontal-pod-autoscaler.html

### 베스트 프랙티스/사이드 리딩

- **Spacelift – HPA 가이드 & 모범 사례**
  - HPA 한계/안정화 윈도우/플래핑 방지 팁
  - https://spacelift.io/blog/kubernetes-hpa-horizontal-pod-autoscaler

- **Plural – 실무형 HPA 가이드(2025)**
  - 안정화 윈도우/튜닝 포인트 등 최신 정리
  - https://www.plural.sh/blog/hpa-kubernetes-guide/

- **LiveWyer – Prometheus + Custom Metrics로 스케일링 설정**
  - Prometheus Adapter 연계 실습형 튜토리얼
  - https://livewyer.io/blog/set-up-kubernetes-scaling-via-prometheus-custom-metrics/

- **IBM Docs – HPA 튜닝(안정화 윈도우/정책 개념 설명)** 
  - https://www.ibm.com/docs/en/cloud-paks/cp-biz-automation/24.0.1?topic=environment-tuning-horizontal-pod-autoscaler-hpa

---

## 읽는 순서 가이드

1) **개념 잡기:** 한국어 공식 문서로 HPA 전반(개념/동작)을 빠르게 훑습니다.  
2) **최신 스펙 확인:** 영어 공식 문서와 API 레퍼런스로 `autoscaling/v2`의 필드/정책을 확인합니다.  
3) **실무 적용:** metrics-server와 Prometheus Adapter로 메트릭 파이프라인을 구성하고, 벤더/블로그 가이드로 베스트 프랙티스를 확인합니다.  

> 메모: 실무에서는 **metrics-server(리소스 메트릭)** + **Prometheus Adapter(커스텀/외부 메트릭)**를 함께 사용해 CPU/MEM + RPS 같은 **혼합 기준** 오토스케일링을 구성하는 경우가 많습니다.

---

### 부록: 빠른 체크리스트

- [ ] HPA API 버전은 `autoscaling/v2` 사용  
- [ ] 대상 워크로드의 `resources.requests` 합리적 설정 (CPU/메모리 기반 스케일링 정확도)  
- [ ] `metrics-server` 설치 및 `kubectl top` 동작 확인  
- [ ] (필요 시) Prometheus + Prometheus Adapter로 **커스텀 지표** 노출  
- [ ] `behavior.scaleUp/scaleDown` 정책과 **stabilizationWindowSeconds**로 플래핑 방지  
- [ ] 로드 테스트(JMeter, k6, wrk 등)로 임계값 보정

