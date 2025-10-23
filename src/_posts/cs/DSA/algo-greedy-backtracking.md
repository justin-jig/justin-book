---
title: "CS 알고리즘 (Algorithm) - 탐욕 알고리즘과 백트래킹"
date: 2025-10-17
---

탐욕 알고리즘과 백트래킹 (Greedy & Backtracking)
(탐욕·백트래킹·완전 탐색 비교)도 


#### 정리 요약

탐욕(Greedy)과 백트래킹(Backtracking)은 **문제 해결 전략(Algorithm Paradigm)** 의 두 가지 대표 방식이다.  
탐욕 알고리즘은 매 순간 “가장 최적”이라고 판단되는 선택을 하며 전체 해를 구하고,  
백트래킹은 가능한 모든 경우를 탐색하면서 **불가능한 경로를 조기에 차단(Pruning)** 한다.  

두 방식 모두 완전 탐색(Brute Force)에서 발전된 형태로,  
**최적화(Optimization)** 와 **조합 탐색(Combinatorial Search)** 문제에서 자주 사용된다.

* **탐욕 알고리즘**은 현실의 스케줄링, 자원 분배, 네트워크 설계 등에서 자주 사용된다.

  * 예: 네트워크 최소 비용 연결(Kruskal), Huffman 압축, 캐시 교체 정책(LRU 근사).
* **백트래킹**은 제약 충족 문제(Constraint Satisfaction Problem, CSP) 해결의 기초이다.

  * 예: 스도쿠, 퍼즐, 조합 최적화, 경로 탐색(A*, DFS 기반).
* 실무에서는 **탐욕 + 백트래킹 혼합형 접근(예: Branch & Bound)** 이 사용되기도 한다.
* AI, 최적화, 게임 탐색(예: 미니맥스 알고리즘)에서도 백트래킹과 가지치기 원리가 핵심이다.


##### 완전 탐색(Brute Force)과의 관계

| 구분    | 완전 탐색 (Brute Force) | 백트래킹 (Backtracking)      |
| :---- | :------------------ | :----------------------- |
| 탐색 방식 | 가능한 모든 경우 탐색        | 조건 불만족 시 조기 중단 (Pruning) |
| 효율성   | 매우 낮음               | 경우의 수 대폭 감소              |
| 적용 예  | 순열, 조합, DFS         | N-Queens, 스도쿠, 경로 탐색     |


##### 탐욕 vs 백트래킹 비교

| 항목     | 탐욕 알고리즘 (Greedy)   | 백트래킹 (Backtracking)  |
| :----- | :----------------- | :------------------- |
| 접근 방식  | 매 순간 최적의 선택        | 모든 가능한 해 탐색          |
| 해의 최적성 | 항상 보장되지 않음         | 완전 탐색으로 보장 가능        |
| 시간 복잡도 | 낮음 (보통 O(n log n)) | 매우 높음 (O(n!))        |
| 대표 문제  | 최소 신장 트리, 허프만 코딩   | N-Queens, 스도쿠, 조합 생성 |
| 사용 상황  | 빠른 근사 해 필요         | 정확한 최적해 필요           |
| 장점     | 구현 간단, 빠름          | 최적해 보장               |
| 단점     | 근사 해, 일부 경우 오답     | 계산량 많음               |

##### 참고 자료
* [GeeksforGeeks – Greedy Algorithms](https://www.geeksforgeeks.org/greedy-algorithms/)
* [GeeksforGeeks – Backtracking Introduction](https://www.geeksforgeeks.org/backtracking-algorithms/)
* [Wikipedia – Backtracking](https://en.wikipedia.org/wiki/Backtracking)
* [MIT 6.006 – Algorithmic Paradigms Lecture Notes](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/)


---

## 1. 탐욕 알고리즘 (Greedy Algorithm)

탐욕 알고리즘은 각 단계에서 **현재 가장 최선의 선택(Local Optimum)** 을 반복하여  
전체 해(Global Optimum)를 도출하려는 방식이다.  
단, 항상 최적해를 보장하지는 않으며 **“탐욕 선택 속성(Greedy Choice Property)”** 과  
**“최적 부분 구조(Optimal Substructure)”** 가 만족되어야 한다.

### 기본 구조

```python
def greedy_algorithm(problem):
    solution = []
    while not problem.is_done():
        best = problem.find_best_choice()
        if problem.is_valid(best):
            solution.append(best)
        problem.update_state(best)
    return solution
```

### 대표 예시

#### (1) 거스름돈 문제 (Coin Change)

가장 큰 단위의 동전부터 차례대로 선택하여 최소 개수의 동전으로 목표 금액을 만든다.
단, **모든 경우에 최적해를 보장하지는 않는다** (예: 1, 3, 4 단위 동전).

```python
def greedy_coin_change(coins, amount):
    result = []
    for coin in sorted(coins, reverse=True):
        while amount >= coin:
            amount -= coin
            result.append(coin)
    return result

print(greedy_coin_change([500, 100, 50, 10], 1260))
# [500, 500, 100, 100, 50, 10]
```

| 구분     | 설명                            |
| :----- | :---------------------------- |
| 시간 복잡도 | O(n)                          |
| 특징     | 빠르고 단순하지만, 전역 최적해를 항상 보장하지 않음 |
| 대표 활용  | 스케줄링, 최소 신장 트리, 허프만 코딩        |

---

#### (2) 활동 선택 문제 (Activity Selection Problem)

각 활동의 시작과 종료 시간이 주어졌을 때,
**서로 겹치지 않게 최대한 많은 활동**을 선택하는 문제이다.

```python
def activity_selection(activities):
    activities.sort(key=lambda x: x[1])  # 종료시간 기준 정렬
    result = [activities[0]]
    last_end = activities[0][1]

    for start, end in activities[1:]:
        if start >= last_end:
            result.append((start, end))
            last_end = end
    return result
```

> 탐욕적 선택: 종료 시간이 가장 빠른 활동을 먼저 선택
> → 전체 활동 수 최대화 가능 (최적해 보장)

---

## 2. 최소 신장 트리 (MST, Minimum Spanning Tree)

탐욕 알고리즘의 대표적인 예시로, **모든 정점을 최소 비용으로 연결하는 트리**를 찾는 문제이다.

### Kruskal 알고리즘 (간선 선택 기반)

```python
def kruskal(graph):
    edges = sorted(graph['edges'], key=lambda x: x[2])  # 가중치 기준 정렬
    parent = {v: v for v in graph['vertices']}

    def find(v):
        if parent[v] != v:
            parent[v] = find(parent[v])
        return parent[v]

    mst = []
    for u, v, w in edges:
        if find(u) != find(v):
            mst.append((u, v, w))
            parent[find(u)] = find(v)
    return mst
```

| 특징      | 설명                    |
| :------ | :-------------------- |
| 알고리즘 유형 | 탐욕적 (Greedy)          |
| 시간 복잡도  | O(E log E)            |
| 대표 응용   | 네트워크 연결, 최소 배선, 클러스터링 |

---

## 3. 백트래킹 (Backtracking)

백트래킹은 가능한 모든 경우를 시도하되,
**조건을 만족하지 않는 경우 조기에 중단(Pruning)** 하여 불필요한 탐색을 줄이는 완전 탐색 기법이다.

### 기본 구조

```python
def backtrack(path, candidates):
    if is_solution(path):
        print(path)
        return
    for candidate in candidates:
        if is_valid(path, candidate):
            path.append(candidate)
            backtrack(path, candidates)
            path.pop()
```

| 구분      | 설명                                |
| :------ | :-------------------------------- |
| 알고리즘 유형 | 완전 탐색 + 가지치기                      |
| 시간 복잡도  | 최악 O(n!) (경우의 수에 따라 달라짐)          |
| 특징      | 모든 가능한 조합 탐색, 불필요한 분기 제거          |
| 대표 응용   | N-Queens, 순열/조합, 부분집합, 스도쿠, 경로 탐색 |

---

### 예시 1: N-Queens 문제

N×N 체스판에 퀸을 서로 공격하지 않게 배치하는 문제.

```python
def solve_n_queens(n):
    board = [-1]*n
    result = []

    def is_safe(row, col):
        for r in range(row):
            if board[r] == col or abs(board[r]-col) == abs(r-row):
                return False
        return True

    def backtrack(row):
        if row == n:
            result.append(board[:])
            return
        for col in range(n):
            if is_safe(row, col):
                board[row] = col
                backtrack(row+1)
                board[row] = -1

    backtrack(0)
    return result
```

> 백트래킹은 가능한 조합을 모두 탐색하지만,
> 조건 불만족 시 즉시 분기(branch)를 종료하여 효율성을 확보한다.

---

### 예시 2: 부분집합 생성 (Subsets)

```python
def subsets(nums):
    result = []
    def backtrack(start, path):
        result.append(path[:])
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()
    backtrack(0, [])
    return result
```

| 입력        | 출력                                                  |
| :-------- | :-------------------------------------------------- |
| `[1,2,3]` | `[[], [1], [2], [3], [1,2], [1,3], [2,3], [1,2,3]]` |

---


