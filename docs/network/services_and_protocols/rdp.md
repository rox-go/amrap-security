# RDP

RDP normally runs on TCP port 3389.

## Enumeration

**auxiliary/scanner/rdp/rdp_scanner**

```bash
use auxiliary/scanner/rdp/rdp_scanner
set RHOSTS TARGET_IP
set RPORT TARGET_PORT
run
```

## Brute-force with Hydra

```bash
hydra -L USERS_LIST -P PASS_LIST rdp://TARGET_IP -s TARGET_PORT
```

## Connect using xfreerdp

```bash
xfreerdp /u:USER /p:PASSWORD /v:TARGET_IP:TARGET_PORT
```
