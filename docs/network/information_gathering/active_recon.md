# Active Information Gathering

Phase of the assessment where the tester actively interacts with the target.

## DNS

DNS is a protocol to that is used to resolve domain names/hostnames to IP addresses.

There are many public DNS servers set up by companies like Cloudflare (1.1.1.1) and Google (8.8.8.8).

### The Hosts File
- It is a simple text file used to map hostnames to IP addresses, providing a manual method of domain name resolution that bypasses the DNS process.
- It is located in `C:\Windows\System32\drivers\etc\hosts` on **Windows** and in `/etc/hosts` on **Linux and MacOS**. 
- It can also be used to block unwanted websites by redirecting their domains to a non-existent IP address.

### DNS Records
- A: IPv4
- AAAA: IPv6
- NS: Name Server
- MX: Mail server
- CNAME: Domain aliases
- TXT: Text record
- HINFO: Host information
- SOA: Domain authority
- SRV: Service records
- PTR: Resolves an IP address to a hostname

### The Zone Transfer Vulnerability

DNS server admins may want to copy or transfer zone files from one DNS server to another. This process is kwnon as a **zone transfer**.

It means that anyone, including malicious actors, could ask a DNS server for a complete copy of its zone file, which contains a wealth of sensitive information (internal IPs, subdomains, aliases, etc).

Misconfigurations can still occur due to human error or outdated practices. This is why attempting a zone transfer (with proper authorization) remains a valuable reconnaissance technique. 

> Even if unsuccessful, the attempt can reveal information about the DNS server's configuration and security posture.

Website to teach users about DNS: https://zonetransfer.me.

```bash
# Zone Transfer using dig
dig axfr @nsztm1.digi.ninja zonetransfer.me

# Zone Transfer using dnsenum
dnsenum zonetransfer.me
```

## Host discovery

It can be done using different tools:

- nmap: `sudo nmap -sn 192.168.1.0/24`
- netdiscover: `sudo netdiscover -i eth0 -r 192.168.1.0/24`

## Netcat
Netcat supports both TCP and UDP protocols. It can function as a client that connects to a listening port; alternatively, it can act as a server that listens on a port of your choice. Hence, it is a convenient tool that you can use as a simple client or server over TCP or UDP.

Connect as a client: `nc MACHINE_IP PORT`

Open a port and listen to it: `nc -vlnp PORT`


| option                 | meaning                                                    |
|------------------------|------------------------------------------------------------|
| -l                     | Listen mode                                                |
| -p                     | Specify the Port number                                    |
| -n                     | Numeric only; no resolution of hostnames via DNS           |
| -v                     | Verbose output (optional, yet useful to discover any bugs) |
| -vv                    | Very Verbose (optional)                                    |
| -k                     | Keep listening after client disconnects                    |



## Sniffing Attack
Sniffing attack refers to using a network packet capture tool to collect information about the target. When a protocol communicates in cleartext, the data exchanged can be captured by a third party to analyse.

There are many programs available to capture network packets. We consider the following:

- **Tcpdump**: `sudo tcpdump port 110 -A`
- **Wireshark**: search for `pop`
- **Tshark**


## Password Attack

### Hydra
Hydra supports many protocols, including FTP, POP3, IMAP, SMTP, SSH, and all methods related to HTTP. The general command-line syntax is: `hydra -l username -P wordlist.txt server service`.

Example:

- `hydra -l username -P rockyou.txt 10.10.123.123 ftp`
- `hydra -l username -P rockyou.txt ftp://10.10.123.123:21`

## Subdomains

### Active Subdomain Enumeration 
Brute-force enumeration, which involves systematically testing a list of potential subdomain names against the target domain. Tools like dnsenum, ffuf, and gobuster can automate this process, using wordlists of common subdomain names or custom-generated lists based on specific patterns.

## Firefox and Chrome Addons
- [FoxyProxy](https://addons.mozilla.org/en-US/firefox/addon/foxyproxy-standard/) lets you quickly change the proxy server you are using to access the target website. This browser extension is convenient when you are using a tool such as Burp Suite or if you need to switch proxy servers regularly. You can get FoxyProxy for Firefox from here.

- [User-Agent Switcher and Manager](https://addons.mozilla.org/en-US/firefox/addon/user-agent-string-switcher/) gives you the ability to pretend to be accessing the webpage from a different operating system or different web browser. In other words, you can pretend to be browsing a site using an iPhone when in fact, you are accessing it from Mozilla Firefox. You can download User-Agent Switcher and Manager for Firefox here.