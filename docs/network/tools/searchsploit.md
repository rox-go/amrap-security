# Searching For Exploits With Searchsploit
The entire Exploit-db database of exploits comes pre-packed with Kali Linux.

The exploits and shellcodes databases are stored under `/usr/share/exploitdb`.

```bash
# Update the Exploit-db database
sudo apt-get update && sudo apt-get install exploitdb -y

# Get the latest exploits
searchsploit -u

# Generic search
searchsploit vsftpd

# Example specifying the version
searchsploit vsftpd 2.3.4

# Copy an exploit in the current directory: -m
searchsploit -m EXPLOIT_ID

# Case sensitive search: -c
searchsploit -c SERVICE_BANNER

# Title search: -t
searchsploit -t  SEARCH_TERM

# Exact search: -e
searchsploit -e "SEARCH_TERM"

# Remote exploits for Windows that target SMB service
searchsploit remote windows smb

# Remote Linux exploits that target SSH
searchsploit remote linux ssh

# Remote WordPress exploits
searchsploit remote webapps wordpress

# Local exploits for windows
searchsploit local windows

# Links of the remote exploit
searchsploit remote windows smb -w | grep -e "EternalBlue" 
```