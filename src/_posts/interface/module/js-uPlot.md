---
title: "js-uPlot"
date: 2025-10-17
---

### uPlot 본체
npm install uplot
https://www.npmjs.com/package/uplot
#### React 연동 래퍼(선택)
npm install uplot-react
https://www.npmjs.com/package/uplot-react

# 1. 개요

uPlot은 Canvas 2D 기반의 **초경량·고성능 시계열 차트** 라이브러리이다. 라이선스는 **MIT License**이다. 파일 크기는 수십 KB 수준이며, 대규모 데이터셋을 **빠르게 렌더링**한다. 마우스 휠, 드래그, 줌 등 기본적인 **인터랙션**을 제공하며, 옵션과 훅(hooks)으로 **세밀한 커스터마이징**이 가능하다. 설계 철학은 **시간 시계열 데이터**에 최적화되어 있다.

> 참고: uPlot은 기본적으로 **2D 카테시안(직교 좌표)** 시계열에 특화되어 있으며, **라인·에어리어·스캐터**를 중심으로 제공한다. 막대(Bar), OHLC/캔들스틱 등은 **플러그인·커스텀 시리즈**로 구현하는 패턴이 일반적이다. **파이 차트, 히트맵, 버블 차트**는 기본 제공 대상이 아니다.

---

# 2. 주요 특징

* **빠른 렌더링**. 수십만 포인트의 시계열 데이터를 Canvas로 효율적으로 그린다.
* **작은 번들 크기**. 최소 빌드가 약 수십 KB로 가볍다.
* **상호작용 지원**. 휠 줌, 드래그 팬, 커서 십자선, 선택 박스 줌을 제공한다.
* **유연한 API**. 축/스케일/시리즈/커서/범례/훅 등 대부분을 옵션으로 제어한다.
* **시계열 중심 설계**. x 스케일을 `time: true`로 두고 UNIX seconds 기반 배열을 사용한다.

---

# 3. 지원 차트 유형(현실적인 가이드)

* **기본 제공/권장**

  * 라인(Line), 영역(Area), 포인트/스캐터(Scatter)
* **커스텀/플러그인으로 구현하는 경우가 많은 유형**

  * 막대(Bar), OHLC/캔들스틱(Candlestick)
* **기본 제공 대상 아님(별도 라이브러리 권장)**

  * 파이(Pie), 히트맵(Heatmap), 버블(Bubble), 레이더 등

---

# 4. 설치

```bash
# React + TypeScript 템플릿
npx create-react-app my-app --template typescript

# uPlot 본체
npm install uplot

# React 연동 래퍼(선택)
npm install uplot-react
```

> 래퍼 없이 `new uPlot(...)`으로 직접 제어해도 되며, `uplot-react`를 사용하면 React 컴포넌트 형태로 쉽게 쓸 수 있다.

---

# 5. 데이터 형식

uPlot은 **2차원 배열**을 사용한다. 첫 번째 배열은 **x축(UNIX seconds)**, 나머지는 각 **시리즈의 y값**이다.

```ts
const data: (number[] )[] = [
  [ t1, t2, t3, ... ],   // x: UNIX seconds
  [ y1, y2, y3, ... ],   // series 1
  [ y1, y2, y3, ... ],   // series 2 (있다면)
];
```

> **주의**. x값은 **초 단위**(milliseconds 아님)이다. `Date.getTime()/1000`로 변환한다.

---

# 6. React + TypeScript 구현 예시

아래 예시는 **uplot-react 미사용** 방식으로, 인스턴스를 한 번 생성하고 **`setData`**만 갱신하는 **안전한 패턴**을 보인다. 사용자가 제시한 코드에서 발생할 수 있는 **무한 재생성(useEffect 의존성 문제)**, **불필요한 재마운트**를 방지했다.

## 6.1 `MyChart.tsx`

```tsx
import { FC, useEffect, useRef } from 'react';
import uPlot, { Options } from 'uplot';
import 'uplot/dist/uPlot.min.css';
import './Chart.css';

// 유틸: 날짜를 UNIX seconds로
const ts = (y: number, m: number, d: number) =>
  Math.floor(new Date(y, m, d).getTime() / 1000);

const initialData: number[][] = [
  // x
  [ts(2024, 0, 1), ts(2024, 1, 1), ts(2024, 2, 1)],
  // y
  [50, 60, 70],
];

const MyChart: FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const uplotRef = useRef<uPlot | null>(null);
  const dataRef = useRef<number[][]>(initialData.map(arr => [...arr])); // 내부 변경용
  const monthRef = useRef<number>(3);
  const valueRef = useRef<number>(80);
  const timerRef = useRef<number | undefined>(undefined);

  // 옵션(가로 100%, 반응형 대응은 setSize로 처리)
  const optsRef = useRef<Options>({
    title: 'Time Series Chart',
    class: 'my-chart',
    width: 800,
    height: 400,
    scales: {
      x: { time: true },
      y: { range: [0, 200] },
    },
    series: [
      {}, // x (더미 자리)
      {
        label: 'Value',
        stroke: 'red',
        fill: 'rgba(255,0,0,0.1)',
      },
    ],
    axes: [
      {
        stroke: 'gray',
        grid: { show: true },
        values: (u, ticks) =>
          ticks.map(t => new Date(t * 1000).toLocaleDateString()),
      },
      { stroke: 'gray', grid: { show: true } },
    ],
    cursor: {
      show: true,
      x: true,
      y: true,
      lock: false,
    },
    legend: {
      show: true,
    },
  });

  // 최초 1회: 차트 생성
  useEffect(() => {
    if (!containerRef.current) return;

    const u = new uPlot(optsRef.current, dataRef.current, containerRef.current);
    uplotRef.current = u;

    // 반응형 리사이즈: 부모 너비를 기준으로 재계산
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        const w = Math.floor(entry.contentRect.width);
        if (w > 0) {
          u.setSize({ width: w, height: optsRef.current.height! });
        }
      }
    });
    ro.observe(containerRef.current);

    // 10초마다 데이터 추가
    timerRef.current = window.setInterval(() => {
      const newX = ts(2024, monthRef.current, 1);
      const newY = valueRef.current;

      monthRef.current += 1;
      valueRef.current += 10;

      dataRef.current[0].push(newX);
      dataRef.current[1].push(newY);

      // 인스턴스를 재생성하지 않고 데이터만 교체
      u.setData(dataRef.current);
    }, 10000);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      ro.disconnect();
      u.destroy();
      uplotRef.current = null;
    };
  }, []);

  return (
    <div className="chart-wrap">
      <div ref={containerRef} />
    </div>
  );
};

export default MyChart;
```

## 6.2 `Chart.css`

```css
.chart-wrap {
  width: 100%;
  /* 부모 컨테이너가 크기를 결정한다. 높이는 uPlot 옵션 height로 제어한다. */
}

.my-chart {
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
}
```

> 위 코드는 **마운트 시 1회 인스턴스 생성 → 주기적 `setData`만 갱신** 흐름을 따른다. `ResizeObserver`로 **가로 100% 반응형**을 처리한다. 필요 시 `optsRef.current.height`도 동적으로 조절해 세로 반응형을 구현한다.

---

# 7. `uplot-react`를 쓰는 대안

아래처럼 래퍼를 사용하면 더 간결해진다. 다만 대규모 실시간 갱신에서는 **불필요한 리렌더**를 피하도록 주의한다.

```tsx
import { FC, useMemo } from 'react';
import UplotReact from 'uplot-react';
import 'uplot/dist/uPlot.min.css';

const ts = (y: number, m: number, d: number) =>
  Math.floor(new Date(y, m, d).getTime() / 1000);

const ReactUplotDemo: FC = () => {
  const data = useMemo(() => [
    [ts(2024, 0, 1), ts(2024, 1, 1), ts(2024, 2, 1)],
    [50, 60, 70],
  ], []);

  const opts = useMemo(() => ({
    width: 800,
    height: 400,
    scales: { x: { time: true }, y: { range: [0, 200] } },
    series: [{}, { label: 'Value', stroke: 'red', fill: 'rgba(255,0,0,0.1)' }],
  }), []);

  return <UplotReact options={opts} data={data} />;
};

export default ReactUplotDemo;
```

---

# 8. 옵션 정리(필수만 간결하게)

## 8.1 General

* `title: string` · 차트 제목을 설정한다.
* `id: string` · 루트 엘리먼트 ID를 설정한다.
* `class: string` · 루트 엘리먼트 클래스명을 설정한다.
* `width: number` / `height: number` · 픽셀 단위 크기를 설정한다.

## 8.2 Axes (`axes: Array<AxisOpts>`)

* `scale: string` · 축이 참조할 스케일 키를 설정한다(기본 `x`, `y`).
* `label: string` · 축 레이블을 설정한다.
* `grid: { show: boolean }` · 그리드 노출을 설정한다.
* `ticks: { show: boolean }` · 틱 노출을 설정한다.
* `values: (u, ticks) => string[]` · 눈금 레이블 포맷터를 지정한다.
* `size: number` · 축 영역 두께를 지정한다.

## 8.3 Series (`series: Array<SeriesOpts>`)

* 첫 번째 요소는 **x축 자리**이므로 `{}`로 둔다.
* `label: string` · 범례에 노출할 시리즈명을 지정한다.
* `stroke: string` · 선 색상을 지정한다.
* `fill: string` · 영역 채우기를 지정한다.
* `scale: string` · 연결할 y 스케일명을 지정한다(멀티 y 스케일 구성 시).

## 8.4 Scales (`scales: Record<string, ScaleOpts>`)

* `x: { time: boolean }` · 시계열인 경우 `time: true`를 설정한다.
* `distr: number` · 분포를 설정한다(0: 선형, 1: 로그).
* `range: [min, max] | (u, min, max) => [min, max]` · 범위를 지정한다.

## 8.5 Legend (`legend`)

* `show: boolean` · 범례 노출을 설정한다.
* `live: boolean` · 커서 위치에 따른 실시간 값 갱신을 설정한다.
* `width: number` · 범례 영역 너비를 지정한다.

## 8.6 Cursor (`cursor`)

* `show: boolean` · 커서 교차선을 노출한다.
* `x: boolean` / `y: boolean` · 축 방향 교차선 노출을 설정한다.
* `lock: boolean` · 커서 고정을 설정한다.

## 8.7 Hooks (`hooks`)

주요 훅은 다음과 같다.

* `init(u)` · 초기화 직후 실행한다.
* `ready(u)` · 모든 렌더링 완료 후 실행한다.
* `draw(u)` · 차트가 그려진 직후 실행한다.
* `drawAxes(u)` / `drawSeries(u, i)` · 축/시리즈 그린 직후 실행한다.
* `setSize(u)` · 크기 변경 후 실행한다.
* `drawClear(u)` · 캔버스를 지운 직후 실행한다.

---

# 9. 런타임 API 정리(핵심 위주)

> 버전에 따라 일부 메서드의 존재 여부나 시그니처가 다를 수 있다. 아래는 안정적으로 많이 쓰는 축약 정리이다.

* **`setData(nextData: number[][], fireHooks = true)`**
  데이터 전체를 교체한다. 실시간 스트리밍 시 가장 많이 사용한다.

* **`setScale(key: string, range: {min?: number, max?: number})`**
  `x`, `y` 등 스케일의 범위를 갱신한다.

* **`setSize({ width, height })`**
  차트의 크기를 바꾼다. 반응형 대응에 사용한다.

* **`setSelect(box)`**
  `box: { left, top, width, height }` 형태로 선택영역을 프로그래밍 방식으로 지정한다.

* **`posToIdx(px: number)`**
  x축 **픽셀**을 데이터 **인덱스**로 변환한다.

* **`posToVal(px: number, scaleKey: string)`**
  픽셀 좌표를 해당 스케일의 **값**으로 변환한다.

* **`valToPos(val: number, scaleKey: string)`**
  값을 픽셀 좌표로 변환한다.

* **`destroy()`**
  인스턴스를 정리한다. 언마운트 시 반드시 호출한다.

> 참고: `addSeries(...)`, `delSeries(idx)` 같은 동적 시리즈 관리 메서드는 버전·플러그인 조합에 따라 제공된다. 동적으로 시리즈를 추가/삭제하려면 사용 중인 uPlot 버전 문서를 확인하고, 가능하면 **초기 `series`를 선언해 둔 뒤 `show` 토글**로 대체하는 방법을 권장한다.

---

# 10. 실무 팁

1. **인스턴스는 1회 생성**하고, 데이터만 `setData`로 갱신한다.
2. **UNIX seconds**를 사용한다. `Date.getTime()/1000`로 변환한다.
3. **반응형**은 `ResizeObserver`로 부모 넓이를 읽어 `setSize`로 갱신한다.
4. **대용량 데이터**에서는 다운샘플링(예: every Nth point)이나 윈도우링을 적용한다.
5. **바 차트·캔들스틱**은 커스텀 시리즈나 예제 코드를 참고해 구현한다. 별도 차트 유형이 대거 필요하면 목적에 맞는 라이브러리를 검토한다.

---

# 11. 사용자가 제시한 코드의 개선점 요약

* `useEffect` 의존성에 `data`를 넣으면 **차트가 주기적으로 재생성**될 수 있다. 인스턴스는 **한 번** 만들고 `setData`만 호출한다.
* `uplot-react`를 설치했다면 실제로 **래퍼를 쓰거나** 제거한다. 혼용 시 혼동이 생긴다.
* x축 단위는 **초**이며, 초기·증분 시 모두 동일 단위를 유지한다.
* 레이아웃은 **부모 컨테이너가 폭을 결정**하고, uPlot은 `setSize`로 따라가게 한다.

---
