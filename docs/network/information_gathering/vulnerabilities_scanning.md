# Vulnerability Scanning

## Banner Grabbing

Its purpose is to identify the service running on a specific port as well as its version.

**Nmap banner script**
Nmap's banner script can be used to get the banner information of a specific port. It returns similar data as the `-sV` option.

**netcat**

```bash
nc TARGET_IP TARGET_PORT
```

> For services that support authentication, try to authenticate using any username and check the data returned by the server.

## Nmap Scripting Engine

```bash
# list vulns scripts
ls /usr/share/nmap/scripts | grep vuln

# http-enum usage
nmap -sV -p80 --script=http.enum TARGET_IP
```