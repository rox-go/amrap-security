# Nmap

It is an open-source netowrk scannint tool used for discovering hosts and services on a computer network, finding open ports and identifying potential vulnerabilities.

Examples of target specification are:

- **List**: MACHINE_IP scanme.nmap.org example.com will scan 3 IP addresses.
- **Range**: 10.11.12.15-20 will scan 6 IP addresses: 10.11.12.15, 10.11.12.16,… and 10.11.12.20.
- **Subnet**: MACHINE_IP/30 will scan 4 IP addresses.
- **A file** can also be provided as input for a list of targeted IPs: `nmap -iL list_of_hosts.txt`
  - Check the list of hosts that Nmap will scan: `nmap -sL TARGETS`


## Host Discovery

Its purpose is to identify live hosts on the network.

Techniques:
- Ping Sweeps: it sends ICMP Echo Requests (ping) to identify live hosts. This is a quick and commonly used method. Does not work for Windows systems.
- ARP Scanning: using ARP requests to identify hosts on a local network.
- TCP SYN Ping: sending TCP SYN packets to a specific port to check if a host is alive. If the host is alive, it responds with a TCP SYN_ACK. It is stealthier than ICMP.
- UDP Ping: sending UPD packets to a specific port to check if a host is alive. Effective when the hosts do not respond to ICMP or TCP probes.
- TCP ACK Ping: this technique expects no response, but if TCP RST is received, it indicates that the host is alive.
- SYN-ACK Ping: if TCP RST is received, it indicates that the host is alive.


| Scan Type              | Example Command                             |
|------------------------|---------------------------------------------|
| ICMP scan              | `sudo nmap -sn MACHINE_IP`.                 |
| ICMP scan IP range     | `sudo nmap -sn MACHINE_IP/24`               |
| ICMP scan multiple IPs | `sudo nmap -sn IP1 IP2 IP3`                 |
| ICMP scan file         | `sudo nmap -sn -iL targets.txt`             |
| ARP Scan               | `sudo nmap -PR -sn MACHINE_IP/24`           |
| ICMP Echo Scan         | `sudo nmap -PE -sn MACHINE_IP/24`           |
| ICMP Timestamp Scan    | `sudo nmap -PP -sn MACHINE_IP/24`           |
| ICMP Address Mask Scan | `sudo nmap -PM -sn MACHINE_IP/24`           |
| TCP SYN Ping Scan      | `sudo nmap -PS -sn MACHINE_IP`              |
| TCP SYN Ping Scan      | `sudo nmap -PS22,80,443 -sn MACHINE_IP`     |
| TCP SYN Ping Scan      | `sudo nmap -PS22,80,443 -sn MACHINE_IP`     |
| TCP ACK Ping Scan      | `sudo nmap -PA22,80,443 -sn MACHINE_IP`     |
| UDP Ping Scan          | `sudo nmap -PU53,161,162 -sn MACHINE_IP`    |

>`-sn` tells nmap not to perform a port scan.

> In local networks, use the flag --send-ip along with -sn to force ICMP packets.

> `sudo nmap -PS -sn MACHINE_IP`: by default it will send a SYN packet to the target on port 80. If the host is online, it will respond with an SYN-ACK. If not it responds with an RST.

> TCP ACK Ping: if the host is online, it will send an RST packet, if not it does not respond. In certain cases, the operating system blocks ACK/RST packets and results will not be accurate.

## Port Scanning

Nmap considers the following six states:

- **Open**: indicates that a service is listening on the specified port.
- **Closed**: indicates that no service is listening on the specified port, although the port is accessible. By accessible, we mean that it is reachable and is not blocked by a firewall or other security appliances/programs.
- **Filtered**: means that Nmap cannot determine if the port is open or closed because the port is not accessible. This state is usually due to a firewall preventing Nmap from reaching that port. Nmap’s packets may be blocked from reaching the port; alternatively, the responses are blocked from reaching Nmap’s host.
- **Unfiltered**: means that Nmap cannot determine if the port is open or closed, although the port is accessible. This state is encountered when using an ACK scan -sA.
- **Open|Filtered**: This means that Nmap cannot determine whether the port is open or filtered.
- **Closed|Filtered**: This means that Nmap cannot decide whether a port is closed or filtered.

> When dealing with Windows systems, if a port is marked as filtered, that confirms that Windows Firewall is active.


### Basic Scans

```bash
# Default scan, it will only check a 1000 of the most common ports
namp MACHINE_IP

# Default scan on the most used ports without checking if the host is online (needed for Windows targets)
namp -Pn MACHINE_IP
```

### Other Scan Types

| Port Scan Type   | Example Command                     | Explanation                                                                                                                                                                                                                      |
|------------------|-------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| TCP Connect Scan | `nmap -sT MACHINE_IP`               | Full TCP connection.                                                                                                                                                                                                             |
| TCP SYN Scan     | `nmap -sS MACHINE_IP`               | It drops the connection after receiving the SYN-ACK packet.                                                                                                                                                                      |
| TCP Null Scan    | `nmap -sN MACHINE_IP`               | The null scan does not set any flag; all six flag bits are set to zero. No response will be sent if the TCP port is open.                                                                                                        |
| TCP FIN Scan     | `nmap -sF MACHINE_IP`               | It sends a TCP packet with the FIN flag set. No response will be sent if the TCP  port is open.                                                                                                                                  |
| TCP Xmas Scan    | `nmap -sX MACHINE_IP`               | An Xmas scan sets the FIN, PSH, and URG flags simultaneously. If an RST packet is received, it means that the port is closed. Otherwise, it will be reported as open\|filtered.                                                  |
| TCP Maimon Scan  | `nmap -sM MACHINE_IP`               | The FIN and ACK bits are set. The target should send an RST packet as a response.                                                                                                                                                |
| TCP ACK Scan     | `nmap -sA MACHINE_IP`               | An ACK scan will send a TCP packet with the ACK flag set. The target would respond to the ACK with RST regardless of the state of the port. This type of scan is more suitable to discover firewall rule sets and configuration. |
| TCP Window Scan  | `nmap -sW MACHINE_IP`               | The TCP window scan is almost the same as the ACK scan; however, it examines the TCP Window field of the RST packets returned.                                                                                                   |
| UDP Scan         | `nmap -sU MACHINE_IP`               | Scans UDP ports.                                                                                                                                                                                                                 |
| Custom Scan      | `nmap --scanflags FLAGS MACHINE_IP` | If you want to set SYN, RST, and FIN simultaneously, you can do so using `--scanflags RSTSYNFIN`.                                                                                                                                |


| Option                         | Purpose                                  |
|--------------------------------|------------------------------------------|
| -p-                            | all ports                                |
| -p1-1023                       | scan ports 1 to 1023                     |
| -F                             | 100 most common ports                    |
| -r                             | scan ports in consecutive order          |


### Service and OS Detection

Adding `-sV` to your Nmap command will collect and determine service and version information for the open ports. You can control the intensity with `--version-intensity LEVEL` where the level ranges between 0, the lightest, and 9, the most complete. `-sV --version-light` has an intensity of 2, while `-sV --version-all` has an intensity of 9.

> It is important to note that using -sV will force Nmap to proceed with the TCP 3-way handshake and establish the connection. The connection establishment is necessary because Nmap cannot discover the version without establishing a connection fully and communicating with the listening service.


OS detection can be enabled using `-O`; this is an uppercase O as in OS. Example: `nmap -sS -O MACHINE_IP`


### Nmap Scripting Engine (NSE)

Common scripts are located at: `/usr/share/namp/scripts`.

You can choose to run the scripts in the **default category** using `--script=default` or simply adding `-sC`. These are all safe to run scripts.

Example:
```
nmap -sS -sV -sC -p- -T4 TARGET_IP
```

You can also specify the script by name using `--script=SCRIPT_NAME` or a pattern such as `--script=ftp-*`, which would include ftp-brute.

Get details about a script:
```
nmap --script-help=SCRIPT_NAME
```


| Script Category | Description                                                            |
|-----------------|------------------------------------------------------------------------|
| auth            | Authentication related scripts                                         |
| broadcast       | Discover hosts by sending broadcast messages                           |
| brute           | Performs brute-force password auditing against logins                  |
| default         | Default scripts, same as -sC                                           |
| discovery       | Retrieve accessible information, such as database tables and DNS names |
| dos             | Detects servers vulnerable to Denial of Service (DoS)                  |
| exploit         | Attempts to exploit various vulnerable services                        |
| external        | Checks using a third-party service, such as Geoplugin and Virustotal   |
| fuzzer          | Launch fuzzing attacks                                                 |
| intrusive       | Intrusive scripts such as brute-force attacks and exploitation         |
| malware         | Scans for backdoors                                                    |
| safe            | Safe scripts that won’t crash the target                               |
| version         | Retrieve service versions                                              |
| vuln            | Checks for vulnerabilities or exploit vulnerable services              |


## Firewall Detection & IDS Evation

**Unfiltered Port Status**

It means that Nmap cannot determine if the port is open or closed, although the port is accessible. This state is encountered when using an ACK scan -sA. If a port is marked as unfiltered it means that there is no firewall in place.

An ACK scan will send a TCP packet with the ACK flag set. The target would respond to the ACK with RST regardless of the state of the port. This type of scan is more suitable to discover firewall rule sets and configuration.

```
nmap -sA TARGET_IP
```

> When dealing with Windows systems, if a port is marked as filtered, that confirms that Windows Firewall is active.


**Packets Fragmentation**

Nmap provides the option `-f` to fragment packets. Once chosen, the IP data will be divided into 8 bytes or less. Adding another `-f` (`-f -f` or `-ff`) will split the data into 16 byte-fragments instead of 8. You can change the default value by using the `--mtu`; however, you should always choose a multiple of 8.

```
# Fragment IP data into 8 bytes
-f

## Fragment IP data into 16 bytes

-ff
```

**IP Decoy**

> It is needed to be connected to the network of the decoyed IP.
> Only the initial packet will be sent using the decoyed IP.

```
nmap -D DECOY_IP TARGET_IP 
```

Source port can also be changed using the `-g` option.

**IP/MAC Spoofing**

Spoofed Source IP
```
sudo nmap -S SPOOFED_IP TARGET_IP
```

Spoofed MAC Address
```
--spoof-mac SPOOFED_MAC
```

**Idle (Zombie) Scan**

```
sudo nmap -sI ZOMBIE_IP TARGET_IP
```


## Nmap Scans Optimization

| Option                         | Purpose                                     |
|--------------------------------|---------------------------------------------|
| -T<0-5>                        | -T0 being the slowest and T5 the fastest    |
| --max-rate 50                  | rate <= 50 packets/sec                      |
| --min-rate 15                  | rate >= 15 packets/sec                      |
| --min-parallelism 100          | at least 100 probes in parallel             |
| --host-timeout                 | useful for host disocvery, example: 5s,5m   |
| --scan-delay                   | delay between packets, example: 5s,5ms      |



### Getting More Details

You might consider adding `--reason` if you want Nmap to provide more details regarding its reasoning and conclusions.

For more detailed output, you can consider using `-v` for verbose output or `-vv` for even more verbosity.

| Option   | Purpose                               |
|----------|---------------------------------------|
| --reason | explains how Nmap made its conclusion |
| -v       | verbose                               |
| -vv      | very verbose                          |
| -d       | debugging                             |
| -dd      | more details for debugging            |



### Traceroute

If you want Nmap to find the routers between you and the target, just add `--traceroute`.

## Output Storage

| Option                  | Meaning                                         |
|-------------------------|-------------------------------------------------|
| -oN                     | save output in normal format                    |
| -oG                     | save output in grepable format                  |
| -oX                     | save output in XML format                       |
| -oA                     | save output in normal, XML and Grepable formats |

## Summary

| Option                  | Meaning                                         |
|-------------------------|-------------------------------------------------|
| -sV                     | determine service/version info on open ports    |
|-sV --version-intensity 1| aggressiveness of service version detection     |
| -sV --version-light     | try the most likely probes (2)                  |
| -sV --version-all       | try all available probes (9)                    |
| -O                      | detect OS                                       |
| --traceroute            | run traceroute to target                        |
| --script=SCRIPTS        | nmap scripts to run                             |
| -sC or --script=default | run default scripts                             |
| -A                      | equivalent to -sV -O -sC --traceroute           |
| -oN                     | save output in normal format                    |
| -oG                     | save output in grepable format                  |
| -oX                     | save output in XML format                       |
| -oA                     | save output in normal, XML and Grepable formats |
| --reason                | explains how Nmap made its conclusion           |
| -v                      | verbose                                         |
| -vv                     | very verbose                                    |
| -d                      | debugging                                       |
| -dd                     | more details for debugging                      |
| --top-ports <NUMBER>    | scan top ports                                  |


## Import Nmap results into MSF

1. Start the MSF DB: `service postgresql start`
2. Start MSF: `msfconsole`
3. Check the status of the database: `db_status`
4. Create a new workspace: `workspace -a WORKSPACE_NAME`
5. Import Nmap scan results: `db_import NMAP_FILE.XML`
6. Confirm results have been imported: `hosts`
7. Enumerate services of the imported hosts: `services`
8. List vulnerabilities: `vulns`

> Initiate a nmap scan from MSF: `db_nmap -Pn -sV -sO TRAGET_IP`