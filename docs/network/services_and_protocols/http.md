# HTTP/HTTPS

Example of popular web servers are Apache Nginx and Microsoft IIS.

## Enumeration

### Metasploit Auxiliary Modules

**auxiliary/scanner/http/http_version**

It enumerates the version of the webserver that is running on the target system.

```bash
use auxiliary/scanner/http/http_version

set RHOSTS TARGET_IP

run
```

**auxiliary/scanner/http/http_header**

```bash
use auxiliary/scanner/http/http_header

set RHTOSTS TARGET_IP

run
```

**auxiliary/scanner/http/robots_txt**

```bash
use auxiliary/scanner/http/robots_txt

set RHOSTS TARGET_IP

run
```

**auxiliary/scanner/http/dir_scanner**

```bash
use auxiliary/scanner/http/dir_scanner

set DICTIONARY DICTIONARIES_WORDLIST

set RHOSTS TARGET_IP

run
```

**auxiliary/scanner/http/files_dir**

```bash
use auxiliary/scanner/http/files_dir

set DICTIONARY FILES_WORDLIST

set RHOSTS TARGET_IP

run
```

**auxiliary/scanner/http/http_login**

It allows us to perform brute force on authentication forms.

```bash
use auxiliary/scanner/http/files_dir

set AUTH_URI TARGET_ENDPOINT

set RHOSTS TARGET_IP

set PASS_FILE PASS_WORDLIST
# Example: /usr/share/metasploit-framework/data/wordlist/unix_passwords.txt

set USER_FILE USERS_WORDLIST
# Example: /usr/share/metasploit-framework/data/wordlist/namelist.txt

unset USERPASS_FILE

run
```

**auxiliary/scanner/http/apache_userdir_enum**

It attempts to identify valid users on the server.

```bash
use auxiliary/scanner/http/apache_userdir_enum

set USER_FILE USERS_WORDLIST
# Example: /usr/share/metasploit-framework/data/wordlist/common_users.txt

set RHOSTS TARGET_IP

run
```