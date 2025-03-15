---
title: 'Anomaly Detection based on Robust Spatial-temporal Modeling for Industrial Control Systems'
Author: 'Li, Shijie and Liu, Junjiao and Pan, Zhiwen and Lv, Shichao and Si, Shuaizong and Sun, Limin'
Published: '2022 IEEE 19th International Conference on Mobile Ad Hoc and Smart Systems (MASS)'
Date: 2025-03-14
Category: anomaly detection
---

# Introduction

공격 모델을 산업제어시스템의 스텔시 공격과 같은 데이터 인젝션 공격으로 제한하였다. 공격 유형은 센서 값을 갑자기 변경하거나 점진적으로 변경하여 탐지를 우회하는 방식이 있다. 저자는 이를 해결하기 위해 전통적인 구조에 초점을 맞춰 이상탐지 시스템을 상태 추정 모델과 이상탐지 모델로 나누어 접근한다.

제안하는 프레임워크의 흐름은 다음과 같다.

1. Feature selection: distribution shift가 크게 일어나 학습에 방해가 되는 요소를 제거
2. 상태 추정 모델: 1D CNN (시간적 특성) + Self attention (공간적 특성)
3. 이상탐지 모델: 기존 임계값 기반 탐지에 엔트로피 기반 필터링이 추가
