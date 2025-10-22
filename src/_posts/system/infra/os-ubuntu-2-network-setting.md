---
title: "overview"
date: 2025-10-16
---

## 1. 개요 및 기본 개념

- Ubuntu 24.04는 `netplan` + `systemd-networkd` 혹은 `NetworkManager` 기반 네트워크 설정 구조를 사용합니다.
- `net-tools`(ifconfig, netstat 등)는 기본 설치되어 있지 않아 별도 설치가 필요합니다.
- DHCP 또는 Static IP 기반 설정이 가능하며, Wi-Fi(WPA2)도 netplan으로 구성할 수 있습니다.

---

## 2. net-tools

`net-tools`는 Ubuntu에서 네트워크 상태를 확인하거나 수동 설정을 하기 위해 사용되는 전통적인 명령어 모음 패키지입니다.  
Ubuntu 18.04 이후부터는 `iproute2`가 기본 도구로 사용되기 시작했지만, `net-tools`는 여전히 유용하며 `ip` 명령어와 **혼용하여 사용할 수 있습니다**.  
상황에 따라 더 직관적인 명령어나 기존 스크립트 호환성을 위해 `net-tools`를 설치해 사용하는 경우가 많습니다.

---

### 2.1 설치 방법 (온라인)
```bash
sudo apt update
sudo apt install net-tools
```

---

### 2.2 주요 명령어 설명 (`net-tools` 패키지에 포함)

| 명령어 | 설명 |
|--------|------|
| `ifconfig` | 네트워크 인터페이스의 IP 주소, MAC 주소, MTU 등을 확인하거나 설정할 수 있음 |
| `ifconfig eth0 up/down` | 특정 인터페이스 활성화 또는 비활성화 |
| `netstat -tulnp` | TCP/UDP 포트 중 리슨 중인 포트와 프로세스를 확인 |
| `netstat -rn` | 커널 라우팅 테이블 확인 |
| `route` | 라우팅 정보 확인 및 설정 (`route add/del`) |
| `arp -a` | ARP 테이블 조회 |
| `nameif` | 네트워크 장치 이름을 MAC 주소 기준으로 변경 |
| `mii-tool`, `ethtool` | 물리적 링크 상태 확인 및 설정 (예: 100Mbps, full-duplex) |

---

### 2.3 현대적인 명령어 (`iproute2` 패키지에 포함)

Ubuntu 24.04에는 `iproute2`가 기본 설치되어 있으며 다음과 같은 명령어들을 제공합니다. `net-tools`와 함께 혼용해서 사용 가능합니다.

| 목적 | 명령어 | 설명 |
|------|--------|------|
| IP 확인 | `ip a`, `ip addr` | 인터페이스의 IP 주소 정보 확인 |
| MAC 주소 확인 | `ip link` | 네트워크 인터페이스의 링크 상태, MAC 주소 확인 |
| 인터페이스 상태 변경 | `ip link set eth0 up/down` | 장치 활성화/비활성화 |
| 라우팅 테이블 | `ip route` | 현재 라우팅 테이블 정보 확인 |
| 게이트웨이 추가 | `ip route add default via 192.168.1.1` | 디폴트 게이트웨이 설정 |
| DNS 확인 | `resolvectl`, `systemd-resolve --status` | 네임서버 상태 조회 |
| 포트 확인 | `ss -tulnp` | netstat 대체. 열려있는 포트 및 연결 상태 확인 |
| ARP 테이블 | `ip neigh` | ARP 테이블 확인 및 수동 등록 가능 |

---

### 2.4 요약

- `net-tools`와 `iproute2`는 **서로 배타적이지 않으며, 함께 설치해서 사용 가능합니다.**
- 실습이나 운영 환경에 따라 **가장 익숙하고 필요한 도구를 선택적으로 사용**하면 됩니다.
- 특히 `ifconfig`, `netstat`에 익숙한 사용자들도 새로운 `ip` 명령어들과 함께 혼용하면서 활용할 수 있습니다.


| 전통 명령어 (`net-tools`) | 대체 명령어 (`iproute2`)    | 설명 |
|---------------------------|-------------------------------|------|
| `ifconfig`                | `ip a`, `ip link`             | IP 주소, MAC, 인터페이스 상태 확인 |
| `netstat -tulnp`          | `ss -tulnp`                   | 리슨 중인 포트 및 프로세스 확인 |
| `netstat -i`              | `ip -s link`                  | 인터페이스별 트래픽 통계 확인 |
| `route -n`                | `ip route`                    | 라우팅 테이블 확인 |
| `arp -a`                  | `ip neigh`                    | ARP 테이블 조회 및 관리 |

> 참고: 보안성과 유지보수 측면에서 `ip` 명령어 기반 도구 사용이 권장되며, `net-tools`는 주로 레거시 지원용으로 사용됩니다.


---


## 3. 유선 네트워크 설정

Ubuntu 24.04에서는 기본적으로 **Netplan**을 사용하여 네트워크 인터페이스를 설정합니다.  
설정 파일은 일반적으로 `/etc/netplan/` 디렉토리에 위치하며, 파일명은 `01-netcfg.yaml`, `00-installer-config.yaml` 등으로 되어 있을 수 있습니다.

---

### 3.1 DHCP (온라인 환경)

DHCP 방식은 네트워크에 자동으로 연결되어 **IP 주소, 게이트웨이, DNS 서버 등을 자동으로 할당받는 방식**입니다.  
가정용 인터넷, 기업의 대부분 네트워크 환경에서 기본적으로 사용됩니다.

**설정 방법:**

1. Netplan 설정 파일 열기:
```bash
sudo nano /etc/netplan/01-netcfg.yaml
```

2. 아래와 같이 수정:
```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    enp0s3:
      dhcp4: true
```

> `enp0s3`는 인터페이스 이름입니다. 환경에 따라 `eth0`, `ens33` 등으로 다를 수 있습니다. `ip a` 명령으로 확인하세요.

3. 설정 적용:
```bash
sudo netplan apply
```

4. IP 주소 확인:
```bash
ip a
```

---

### 3.2 Static IP (폐쇄망 환경)

Static IP는 DHCP 서버가 없거나, **네트워크가 고정 IP를 요구하는 환경**(예: 서버, 폐쇄망)에 사용됩니다.  
수동으로 IP 주소, 서브넷 마스크, 게이트웨이, DNS 서버를 설정해야 합니다.

**설정 방법:**

1. Netplan 설정 파일 열기:
```bash
sudo nano /etc/netplan/01-netcfg.yaml
```

2. 아래와 같이 수정:
```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    enp0s3:
      dhcp4: no
      addresses: [192.168.1.100/24]
      gateway4: 192.168.1.1
      nameservers:
        addresses: [8.8.8.8, 1.1.1.1]
```

- `addresses`: 고정 IP와 서브넷 마스크 (CIDR 표기, 예: `/24`는 255.255.255.0)
- `gateway4`: 라우팅 게이트웨이 주소 (일반적으로 공유기의 IP)
- `nameservers`: DNS 서버 주소 (구글 DNS 등)

3. 설정 적용:
```bash
sudo netplan apply
```

4. 정상 적용 여부 확인:
```bash
ip a
ip route
```

> 네트워크가 끊길 위험이 있다면 `sudo netplan try` 명령으로 먼저 테스트할 수도 있습니다.


---


## 4. 무선 네트워크(Wi-Fi) 설정

Ubuntu에서 Wi-Fi 연결도 Netplan을 통해 설정할 수 있습니다. 일반적으로 노트북, 내장 무선랜, USB 무선랜 카드 등에서 사용됩니다.

---

### 4.1 WPA2 기반 Wi-Fi 설정

WPA2 방식은 일반적인 가정/사무실 무선 공유기에서 사용하는 **SSID + 비밀번호 기반 암호화 방식**입니다.

**설정 방법:**

1. 무선 장치 이름 확인
```bash
ip link show
```
- `wlan0`, `wlp2s0` 등으로 표시되는 것이 무선 장치입니다.
- 장치 이름은 환경마다 다를 수 있으므로 정확한 이름을 확인해야 합니다.

2. Netplan 설정 파일 열기
```bash
sudo nano /etc/netplan/01-netcfg.yaml
```

3. 다음 내용을 입력 (SSID와 비밀번호를 실제 값으로 변경):
```yaml
network:
  version: 2
  renderer: networkd
  wifis:
    wlan0:
      dhcp4: true
      access-points:
        "Your_SSID":
          password: "Your_PASSWORD"
```

- `"Your_SSID"`: 연결할 무선 네트워크 이름
- `"Your_PASSWORD"`: 해당 Wi-Fi 비밀번호
- `dhcp4: true`는 IP 주소를 자동으로 할당받는 설정

4. 설정 적용
```bash
sudo netplan apply
```

> 참고: 무선 장치가 제대로 잡히지 않는다면 `iwconfig` 명령 (net-tools 설치 시 제공)을 통해 SSID 및 무선 링크 상태를 확인할 수 있습니다.

---

## 5. 폐쇄망 환경 수동 설치 방법

### 5.1 외부 PC에서 다운로드
```
mkdir ~/offline_debs
cd ~/offline_debs
apt download net-tools isc-dhcp-client
```

또는
```
sudo apt-get install --download-only net-tools isc-dhcp-client
```

### 5.2 복사 및 설치
```
sudo mkdir -p /tmp/debs
sudo cp *.deb /tmp/debs
cd /tmp/debs
sudo dpkg -i *.deb
sudo apt-get install -f
```

---

## 6. 네트워크 상태 점검 및 트러블슈팅

설정 후 네트워크 연결이 되지 않거나 이상이 있을 경우 다음과 같은 명령으로 상태를 확인할 수 있습니다.

---

### 6.1 기본 점검

- 현재 IP 주소 확인
```bash
ip a
```

- 라우팅 테이블 확인 (게이트웨이 설정 확인)
```bash
ip route
```

- DNS 서버 설정 확인
```bash
cat /etc/resolv.conf
```

---

### 6.2 서비스 상태 확인

- 네트워크 서비스가 정상 작동 중인지 확인
```bash
systemctl status systemd-networkd
```

- 최근 서비스 로그 확인 (오류 메시지 등)
```bash
journalctl -u systemd-networkd | tail -n 30
```

---

### 6.3 인터넷 연결 테스트

- 외부 네트워크(Public IP)로 핑 테스트
```bash
ping 8.8.8.8 -c 3
```

- 도메인 이름을 통한 네임서버 정상 여부 확인
```bash
ping google.com -c 3
```

---

### 6.4 netplan 설정 적용 전 테스트

설정 오류로 인해 연결이 끊기는 것을 방지하려면 아래 명령어로 먼저 테스트 적용하세요.

```bash
sudo netplan try
```

- 120초 이내에 연결이 실패하면 자동으로 설정이 되돌아갑니다.
- 이상이 없다면 다음 명령으로 확정 적용:
```bash
sudo netplan apply
```


---

