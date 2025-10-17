---
title: "js-highchart"
date: 2025-10-17
---
https://www.npmjs.com/package/highcharts
https://www.npmjs.com/package/highcharts-react-official

---
# Highcharts 소개
•	Highcharts는 대화형 차트를 쉽게 만들 수 있게 도와주는 JS 차트 라이브러리.
•	Line, Bar, Area, Pie, Heatmap, Scatter 등 다양한 차트 지원.
•	React 공식 지원은 없지만, highcharts-react-official이라는 래퍼 라이브러리를 사용하면 편리하게 연동 가능.

### 설치
npm install highcharts highcharts-react-official

#### 차트 커스터마이징 요소
1. title.text (차트제목)
Ex) “CPU 사용률 변화”
2. xAxis.categories (x축 레이블)
Ex) ['월', '화', '수']

3. tooltip.formatter (커스텀 툴팁 함수)
값들에 정보 값 값 포맷 제어 가능

4. plotOptions.series.dashStyle	(선 스타일)
"Dash", "Solid" 등

5. series.name (시리즈 이름) 
Ex) "서버1"


### ForecastChart 사용
1. 주요 라이브러리 사용
highcharts: 차트 엔진
highcharts-react-official: React용 Highcharts 래퍼
useRef: 차트 인스턴스 참조 (필요 시 제어 가능) 

2. X축 구성 기능
xAxis는 'datetime' 타입으로 설정되어 있어, 날짜별 시계열 차트로 동작한다.
JavaScript의 Date.UTC(year, month, day)를 이용하여 날짜를 UTC 타임스탬프로 변환하고 이를 x축 값으로 사용한다.
예측 시작일(7월 8일)을 기준으로 다음 기능들이 사용됨:
plotLines: 기준일(7월 8일)에 빨간 수직선을 표시하며 라벨("기준일")을 함께 출력한다.
plotBands: 기준일예측 종료일(7월 8일11일) 사이에 옅은 파란색 배경을 그려 예측 영역임을 강조한다

3. 시리즈 구성: 실측과 예측 구분
총 6개의 시리즈가 그려진다.
각 항목(Min, Avg, Max)에 대해 실측과 예측 데이터를 각각 별도로 표시한다.

실측 시리즈는 dashStyle: 'Solid'로 실선으로 표현되며,
예측 시리즈는 dashStyle: 'Dash'로 점선으로 표현된다.

색상도 고정되어 있어 동일 항목은 실측/예측 모두 같은 색으로 구분 가능하다 (파랑, 주황, 초록).

이러한 구성은 동일 지표에 대한 시간에 따른 실측값과 예측값의 차이를 직관적으로 보여주기 위함이다.

4. 커스텀 기능: 차트 로드시 작업
chart.events.load를 활용해 차트가 로드되었을 때 사용자 정의 작업이 가능하도록 구현해두었다.
현재는 예측 시작일과 종료일을 직접 라벨로 표시하는 코드가 주석 처리되어 있지만, 추후 시각적 강조가 필요할 때 사용할 수 있다.

5. 기타 구성
legend.enabled: true 설정을 통해 범례를 활성화하여 시리즈별 항목을 쉽게 구분할 수 있도록 했다.
yAxis.title.text에 "사용률 (%)"을 명시하여 y축이 의미하는 지표를 명확히 하였다.
chartComponentRef를 통해 차트 객체에 직접 접근 가능하게 설계되어 있어, 추후 zoom reset, tooltip 제어, export 등도 구현 가능하다.

구현) 

 

