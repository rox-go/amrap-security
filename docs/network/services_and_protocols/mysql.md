# MySQL

It usually uses TCP port 3306.

## Enumeration

### Metasploit Auxiliary Modules

**auxiliary/scanner/mysql/mysql_version**

```bash
use auxiliary/scanner/mysql/mysql_version

set RHOSTS TARGET_IP

set RPORT TARGET_PORT

run
```

**auxiliary/scanner/mysql/mysql_login**

It can be used to perform brute force.

```bash
use auxiliary/scanner/mysql/mysql_login

set RHOSTS TARGET_IP

set RPORT TARGET_PORT

set USERNAME root

set PASS_FILE PASS_WORDLIST

set STOP_ON_SUCCESS true

run
```

**auxiliary/admin/mysql/mysql_enum**

It enumerated information regarding the MySQL Database. It needs credentials to connect to the MySQL server.

```bash
use auxiliary/admin/mysql/mysql_enum

set RHOSTS TARGET_IP

set RPORT TARGET_PORT

set USERNAME USERNAME_VALUE

set PASSWORD PASS_VALUE

run
```

**auxiliary/admin/mysql/mysql_sql**

It needs credentials to connect to the MySQL server. It allows pentesters to execute SQL queries.

```bash
use auxiliary/admin/mysql/mysql_sql

set RHOSTS TARGET_IP

set RPORT TARGET_PORT

set USERNAME USERNAME_VALUE

set PASSWORD PASS_VALUE

set SQL SQL_QUERY

# Display a list of all databases
set SQL show databases;

# select a database
set SQL use DATABASE_NAME;

run
```

**auxiliary/scan/mysql/mysql_schemadump**

Displays databases and tables of a MySQL server.

```bash
use auxiliary/scan/mysql/mysql_schemadump

set RHOSTS TARGET_IP

set RPORT TARGET_PORT

set USERNAME USERNAME_VALUE

set PASSWORD PASS_VALUE

```