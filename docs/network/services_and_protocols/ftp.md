# FTP

It typically uses port TCP port 21.

FTP authentication uses a username and password combination; however, in some cases an FTP server can be logged into anonymously.

```bash
# Connecting to an FTP server
ftp TARGET_IP TARGET_PORT

# Anonymous authentication: provide anonymous as username and any password

# nmap also provides a script to check if anonymous authentication is enabled
nmap --script=ftp-anon TARGET_IP
```
Once logged in, files can be downloaded from the FTP server by using the command: `get FILENAME`

## Enumeration 

### Metasploit Auxiliary Modules 

**auxiliary/scanner/ftp/ftp_version**

```bash
# Search for specific modules type
search type:auxiliary name:ftp

# Use module that checks FTP version
use auxiliary/scanner/ftp/ftp_version

# Set target IP
set RHOSTS TARGET_IP

run
```

**auxiliary/scanner/ftp/ftp_login**

```bash
use auxiliary/scanner/ftp/ftp_login

# Set target IP
set RHOSTS TARGET_IP

# It needs username and password lists to be set
set USER_FILE /usr/share/metasploit-framework/data/wordlists/common_users.txt
set PASS_FILE /usr/share/metasploit-framework/data/wordlists/unix_passwords.txt

run
```

> Overwhelming the server with too many login attempts might cause an FTP brute force attempt to temporarily disable the service.

**auxiliary/scanner/ftp/anonymous**

It checks if we can log in to the FTP server anonymously.

```bash
use auxiliary/scanner/ftp/anonymous

# Set target IP
set RHOSTS TARGET_IP

run
```

## Attack Vectors

### Hydra

```bash
hydra -t4 -L USERS_LIST -P PASS_LIST TARGET_IP ftp

hydra -t4 -l USER_NAME -P PASS_LIST TARGET_IP ftp
```