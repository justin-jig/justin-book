---
title: "js-echart"
date: 2025-10-17
---

npm install echarts
https://www.npmjs.com/package/echarts
npm install --save echarts-for-react
https://www.npmjs.com/package/echarts-for-react

---
## 1. Apache ECharts

### 1-1. 개요

**Apache ECharts**는 웹 환경에서 대화형 데이터 시각화를 손쉽게 구현할 수 있는 **JavaScript 기반 오픈소스 라이브러리**입니다.
풍부한 차트 종류와 강력한 인터랙티브 기능을 제공하며, 대규모 데이터 시각화에도 최적화되어 있습니다.

> **라이선스:** Apache License 2.0

#### 🔹 주요 특징

| 구분            | 설명                                          |
| ------------- | ------------------------------------------- |
| **다양한 차트 유형** | 기본 2D부터 3D, 지도, 트리 구조 등 다양한 형태의 차트를 지원      |
| **강력한 인터랙션**  | 확대/축소, 드릴다운, 데이터 하이라이트, 툴팁 등 다양한 상호작용 기능 제공 |
| **고성능 렌더링**   | Canvas 기반으로 대규모 데이터도 부드럽게 렌더링               |
| **플랫폼 호환성**   | PC, 모바일, Node.js 등 다양한 환경에서 동작              |
| **테마 및 스타일링** | 기본 테마 또는 커스텀 테마 적용 가능                       |
| **지리정보 시각화**  | GeoJSON 기반의 지도 시각화 제공                       |
| **3D 시각화 지원** | 3D Bar, Scatter, Globe 등 3D 데이터 표현 가능       |

#### 🔹 지원 차트 종류

* **2D 차트:** Line, Bar, Area, Scatter, Pie, Bubble, Funnel, Boxplot, Gauge, Heatmap
* **계층형 차트:** Treemap, Sunburst, Tree, Graph(관계도)
* **3D 차트:** 3D Bar, 3D Scatter, 3D Globe
* **지도 시각화:** Geo, Map, Baidu Map 연동

---

### 1-2. 구현

#### 📦 의존성 (Dependencies)

* **echarts**
* **React.js**
* **TypeScript**

#### 📥 설치 예시

```bash
npm install echarts
npm install --save echarts-for-react
```

#### ⚙️ 기본 구현 예시 (React + TypeScript)

```tsx
import React from 'react';
import ReactECharts from 'echarts-for-react';

const LineChart: React.FC = () => {
  const option = {
    title: { text: 'ECharts Line Chart' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    yAxis: { type: 'value' },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line',
        smooth: true,
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: 400 }} />;
};

export default LineChart;
```

---

### 1-3. 결과 화면 예시

React 컴포넌트로 렌더링 시 다음과 같은 대화형 그래프가 출력됩니다.

* 마우스 오버 시 값 표시 (Tooltip)
* 드래그 확대/축소 가능
* 범례 클릭으로 시리즈 온/오프 제어 가능

---

### ✅ 요약

| 항목           | 내용                                 |
| ------------ | ---------------------------------- |
| **라이브러리명**   | Apache ECharts                     |
| **라이선스**     | Apache License 2.0                 |
| **언어**       | JavaScript / TypeScript            |
| **주요 특징**    | 인터랙티브 차트, 대용량 데이터 처리, 2D/3D/지도 시각화 |
| **지원 환경**    | 웹, 모바일, Node.js                    |
| **React 통합** | `echarts-for-react` 패키지 사용         |

