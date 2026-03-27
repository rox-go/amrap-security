# Simple Network Management Protocol (SNMP)
It is an application layer protocol for monitoring and managing devices on the network.

Components:
- **SNMP Manager:** it is the system responsible for querying and interacting with SNMP agents.
- **SNMP Agents:** they respond to  SNMP queries.

It uses UDP ports 161 (SNMP queries) and 162 (traps/notifications).

## Enumeration

```bash
# Check if SNMP is enabled
nmap -sU -sV -p 161 TARGET_IP


# Find server community strings
nmap -sU -p161 --script=snmp-brute TARGET_IP

# Possible community strings: public, private, secret

# Run all SNMP scripts
namp -sU -p161 --script=snmp* TARGET_IP > snmp_info

```

### snmpwalk

snmpwalk is an SNMP application that uses SNMP GETNEXT requests to query a network entity for a tree of information.

```bash
snmpwalk -v 1 -c public TARGET_IP
```