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

- $\psi^{(T)}$, Physical communications: 센서간의 직접적인 데이터 전송 및 상응하는 컨트롤러
- $\psi^{(C)}$, Numeric stream correlations: 탱크 수위는 탱크 flow 센서와 연관이 있음

Base topology는 다음과 같다. $E_0 = \psi^{(T)} \cup  \psi^{(C)}$

### Physical communicaion 정의
