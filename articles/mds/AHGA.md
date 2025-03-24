---
title: "Process-Oriented heterogeneous graph learning in GNN-Based ICS anomalous pattern recognition"
Author: "Shuaiyi L(y)u, Kai Wang, Liren Zhang, and Bailing Wanga"
Published: "Pattern Recognition"
Date: 2025-03-18
Category: anomaly detection
---

# Introduction

In-depth relationship을 학습하기 위해 많은 연구가 진행됨. 그러나 대부분 시스템 전체의 상태를 학습하려고 노력함. Retracing하거나 공격에 대응하기에 적합하지 않은 형태임.

GNN의 초기 그래프 형태는 거의 random이다 보니, 초기 상태에 영향을 많이 받음. 그래프 초기 퀄리티가 학습에 중요한 영향을 미침.

Attributed Heterogeneous Graph Analyzer (AHGA)를 제안함.

- In-depth process oriented associativity learning을 통한 device-wise (node-level) 이상탐지
- Each node에 대해 distributed decoder로 이상탐지 (joint mapping block 사용X)
- GNN 그래프 초기 상태를 device의 명확한 관계 (industrial process)로 정의

<br/>

총 4 파트로 구성됨

1. `Graph processor`: ICS 구조에 따른 graph structure 초기화
2. `Feature analyzer`: uniform initial vector 생성, entropy 기반 derivation이 추가됨
3. `Link inference decoder`: 이상탐지를 위한 그래프 학습
4. `Anomaly detector`: node-level 이상탐지 수행

# Preliminaries

`Message passing`은 GNN에서 node를 업데이트 하는 방법임. 노드의 representation을 $h_{v}$라 하면 업데이트 하는 과정은 다음과 같다.

$$
h_{v}^{(t+1)} = UPDATE(h_v^{(t)}, AGGR(u \in N(v), MSG(h_v^{(t)}, h_u^{(t), e(u,v)})))
$$

# Related work

- ML-based anomaly detection

  - DAAD, BBAS, AE-GRU + GAN-RNN, ClozeLSTM, AD-RoSM, FATRAF, Design-knowledge in learning plant dynamics for detecting process anomalies in water treatment plants

- GNN models

  - Meta-GNN, Deep cluster infomax, GDN, MST-GNN, UGRL, e-ResGAT, AsGNN, GLIN, GRNN

# Problem Statement

그래프를 정의하기 위해서는 node와 edge가 필요함. Node는 ICS의 devices들임. Edge만 정의하면 됨.

장치 간 관계를 기반으로 구성된 경험적 규칙 집합 $(C)$ = initial edge set

학습 과정에서 AHGA는 C에서 제시한 관계 외에도 추가적인 연관성을 포함하도록 학습함. $G(V,E)$는 이후 이상 탐지에 활용됨.

# Model design

## Graph processor

Edge의 정의는 크게 2가지 타입으로 나뉜다.

- $\psi^{(T)}$, `Physical communications`: 센서간의 직접적인 데이터 전송 및 상응하는 컨트롤러
- $\psi^{(C)}$, `Numeric stream correlations`: 탱크 수위는 탱크 flow 센서와 연관이 있음

Base topology는 다음과 같다. $E_0 = \psi^{(T)} \cup  \psi^{(C)}$

### Physical communicaion 정의

세 가지 정의를 하게 된다.

- $\xi$: SCADA에 의해 감독되는 모든 장비, Central Reference Point (CRP)라고 정의
- $\gamma_i$: i-th stage PLC
- $\varphi_j^{\gamma_i}$: $\gamma_i$와 관련된 모든 필드 장비(sensor, actuator)

<br/>

Node와 edge는 다음과 같이 정의된다.

- Node = [$\xi, \gamma, \varphi_j^{\gamma_i}$]
- Edge
  - $<\xi, \gamma>$
  - $<\gamma, \varphi^{\gamma}>$

### Numeric stream correlation 정의

SWaT과 WADI에 대한 탱크 파이프 관련 edge만 정의해서 사용함. 주요 edge는 다음과 같음.

- FITs from adjacent stages
- FITs and LIT(LT)s within the same stage
- Adjacent devices in the piping diagram
- AITs and other sensors has negativity (no link)
- Devices in same stage (similar periodic features)

<br/>

마지막의 경우, 가령 탱크의 수위가 파이프 flow의 변화에 따라 다양하게 변할 수 있는 것과 같은 경우 edge를 생성함. 거의 대부분의 devices가 edge를 가지게 되어 연구에서는 40% 정도만 초기 edge를 생성하는 데 사용하고, 나머지는 evaluation을 통해 그래프의 퀄리티를 평가하는 데 사용됨.

<br/>

최종적으로 초기 node와 edge는 다음과 같이 정해짐.

- Node = [$\xi, \gamma, \varphi_j^{\gamma_i}$]
- Edge
  - $<\xi, \gamma>$
  - $<\gamma, \varphi^{\gamma}>$
  - `Numeric stream correlation`

## Feature analyzer

Node의 initial vector를 random하게 설정하지 않고 3개의 카테고리를 기준으로 나눠 생성함.

- `General process`: device type, process & sub-process
- `Controlling`: controllers performing pooling
- `Measurement`: periodicity, period value, period Max(Min), period entropy Mean(Variance)

### General process

가능한 전체 수에 맞춰 one-hot encoding으로 표현됨. Device는 간섭하는 모든 곳에 포함됨.

### Controlling

Network에서 direct 이웃과의 위치나 관계를 나타냄. 별다른 설명이 없음.

### Measurement

- Periodicity: constant, non-constant, non-periodic으로 나뉨
- Period value: periodic하면 그 period 값이, constant하면 0, non-periodic하면 $\infty$가 할당됨
- Period max(min): largest(smallest) local maxima(minima), non-periodic하면 global maxima(minima)가 할당됨
- Period entropy mean(var): periodic하면 가능 stationary한 엔트로피의 mean(var) 사용, constat면 0, non-periodic이면 $\infty$ 할당됨. 엔트로피는 값이 떨어지는 구간의 수로 결정됨.

### Fusion

각 파트에서 할당된 vector는 concat되어 하나의 벡터 $\vec{e}$가 됨.

$$ \vec{e} = \vec{e_G} || \vec{e_C} || \vec{e_M}$$

SWaT의 경우, $\vec{e_G}$는 14개의 dimension을, $\vec{e_C}$는 6, $\vec{e_M}$은 13개의 dimension을 보유하게 됨. 최종적으로 $\vec{e}$는 33의 길이를 가지게 됨.

$\arctan$로 normalization되며 PCA를 통해 차원 축소되어 각 노드마다 $x_{[1 \times m]}$을 가지게 됨.

## Link inference decoder

Message passing과 aggregation에 대한 내용임. Hidden layer는 제안하는 구조에 따라 2개에서 4개로 제안함. CRP까지 거치면 device간 최대 홉은 4홉이기 때문임.

$$
\overline{msg_1 (v_i, v_j)} = {1 \over d_i} \sum {1 \over d_j}x_j
$$

$$
h_i^{(1)} = ReLU([\overline{msg_1 (v_i, v_j)} + x_i] \cdot W^{(1)})
$$

$$
\overline{msg_2 (v_i, v_j)} = {1 \over d_i} \sum {1 \over d_j}h_j^{(1)}
$$

$$
h_i^{(2)} = ReLU([\overline{msg_2 (v_i, v_j)} + h_i^{(1)}] \cdot W^{(2)})
$$

이런식으로 모든 node의 vector가 연결된 edge에 의해 추론되면 edge possiblity를 계산함.

$$
P_{link} = simgoid(H^T \cdot H)
$$

Sigmoid에 의해 0~1로 제한되며, 모든 node간의 $h_i \times h_j$가 계산됨. 학습의 목표를 두 node간의 연결 확률로 잡음. CEloss가 사용됨. 학습이 종료되고 얻은 $P_{link}$를 바탕으로 새로운 edge set $E$가 정의됨.

## Anomaly detector

앞선 그래프 link inference decoder에 의해 spatial한 관계가 학습됨. Temporal한 관계 및 numeric data 학습을 위해 새로운 GNN 기반의 네트워크를 구성함. Node의 temporal representation은 다음처럼 exponential weighted average로 정의됨.

$$
X[i] = \sum _{j=in}^{(i+1)n-1} exp^{-a(n-j)}S[t-w+1:t]
$$

$$ i \in [0, {w \over n}) $$

SWaT의 경우 $w=4300$, WADI의 경우 $w=5000$, 모두 $n=100$으로 설정됨.

<br/>

이제 $G=<V,E>$와 $X$를 이용해 이상탐지기를 학습함. GCN, GAT, GraphSAGE가 선택됨. 학습 방법은 link inference decoder와 같으며, 대신 마지막에 각 node에서 softmax를 통한 label 추론을 진행함. 모든 device에서의 label에 대해 CEloss를 구해 학습함.

이렇게 해서 저자는 spatial, temporal 구조를 모두 다루는 이상탐지를 학습했다 주장함.

# Evaluation

먼저, link inference decoder의 성능을 측정함. F1 score가 왜 있는지 모르곘음.

| Methods               | Decoder | Accuracy   | Precision  | Recall     | F1         |
| --------------------- | ------- | ---------- | ---------- | ---------- | ---------- |
| **AHGA(GCN)**         | Sigmoid | 0.7753     | 0.6929     | **0.9887** | 0.8148     |
|                       | Softmax | 0.7977     | 0.7431     | 0.9101     | 0.8181     |
| **AHGA(GAT)**         | Sigmoid | 0.7921     | 0.7241     | 0.9438     | **0.8195** |
|                       | Softmax | 0.7753     | 0.7059     | 0.9438     | 0.8077     |
| **AHGA(GSAGE)**       | Sigmoid | 0.7809     | 0.7049     | 0.9663     | 0.8152     |
|                       | Softmax | 0.7865     | **0.7525** | 0.8539     | 0.8000     |
| **PCA**               | N/A     | 0.7564     | 0.2449     | 0.0723     | 0.1116     |
| **Nonlinear-SVC**     | N/A     | 0.7398     | 0.1000     | 0.0938     | 0.0968     |
| **Bayesian**          | N/A     | **0.8517** | 0.6731     | 0.5072     | 0.5785     |
| **Cosine Similarity** | N/A     | 0.8452     | 0.5776     | 0.3121     | 0.4052     |

Recall이 높고 precision이 낮으면 기존의 topology $E_0$를 잘 유지하면서 새로운 edge를 잘 찾은 거라고 해석할 수 있다고 함. 이해하지 못함. 어쨋든 그래서 GCN 선택함.

<br/>

다음은 이상탐지 결과임.

| Methods              | SWaT Accuracy | SWaT Recall | SWaT Precision | SWaT F1    | WADI Accuracy | WADI Recall | WADI Precision | WADI F1    |
| -------------------- | ------------- | ----------- | -------------- | ---------- | ------------- | ----------- | -------------- | ---------- |
| **AHGA(GCN)-GCN**    | 0.7838        | 0.6165      | 0.8009         | 0.6967     | 0.8207        | 0.7330      | 0.8138         | 0.7713     |
| **AHGA(GCN)-GAT**    | 0.7883        | 0.6072      | 0.8855         | 0.7204     | 0.7495        | 0.5794      | **0.8292**     | 0.6822     |
| **AHGA(GCN)-GSAGE**  | **0.8198**    | **0.6675**  | **0.8918**     | **0.7635** | **0.8325**    | **0.7589**  | 0.8196         | **0.7881** |
| **GCN**              | 0.7687        | 0.5733      | 0.8587         | 0.6875     | 0.7189        | 0.5260      | 0.7859         | 0.6302     |
| **GAT**              | 0.7888        | 0.6106      | 0.8704         | 0.7177     | 0.7327        | 0.5499      | 0.8161         | 0.6570     |
| **GSAGE**            | 0.7887        | 0.6103      | 0.8741         | 0.7188     | 0.7295        | 0.5442      | 0.8122         | 0.6517     |
| **TAGCN**            | 0.7630        | 0.5538      | 0.8692         | 0.6766     | 0.7277        | 0.5383      | 0.8115         | 0.6465     |
| **FT-GCN**           | 0.7641        | 0.5587      | 0.8754         | 0.6820     | 0.7345        | 0.5383      | 0.7528         | 0.6277     |
| **OCSVM**            | 0.6519        | 0.5275      | 0.5321         | 0.5298     | 0.6466        | 0.5352      | 0.5371         | 0.5361     |
| **Isolation Forest** | 0.6278        | 0.5271      | 0.5270         | 0.5270     | 0.6172        | 0.5393      | 0.5402         | 0.5398     |
| **K-Means**          | 0.6344        | 0.5295      | 0.5304         | 0.5299     | 0.6145        | 0.5122      | 0.5136         | 0.5129     |

GDN이 SWaT 0.81, WADI 0.57의 F1 score를 보였던 걸로 기억하는데, 비교에 포함시키지 않음.

# Comment

$+$ 포인트

- 성능은 그렇게 안중요한 거 같음
- `Physical communication`과 `Numeric stream`으로 나눠서 관계를 정의하는 것은 좋은 방법이었음
- Link를 찾는 과정과 이상탐지 과정이 합쳐지면 좋을 거 같음

<br/>

$-$ 포인트

- 정수처리 시스템 한정 효과적인 방법
- Process oriented지만 너무 적은 process
- 괜히 어렵게 적은거 같은 논문

<br/>

$?$ 포인트

- Window가 4000, 5000인데 상관없나?
- Link inference decoder를 어떻게 평가한거임?
- Device(node) level에서 이상탐지하면 최종 이상탐지는 어케함? 하나만 이상이면 시스템 이상임?
- Open review 받았는데, 리뷰가 안보임
- Device level anomaly detection -> label 어케함?
