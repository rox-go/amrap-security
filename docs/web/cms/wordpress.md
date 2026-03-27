# WordPress

WordPress requires a fully installed and configured LAMP stack (Linux operating system, Apache HTTP Server, MySQL database, and the PHP programming language) before installation on a Linux host.

## File Structure

```
.
├── index.php: is the homepage of WordPress.
├── license.txt: contains useful information such as the version WordPress installed.
├── readme.html
├── wp-activate.php: is used for the email activation process when setting up a new WordPress site.
├── wp-admin: folder contains the login page for administrator access and the backend dashboard.
├── wp-blog-header.php
├── wp-comments-post.php
├── wp-config.php: contains information required by WordPress to connect to the database, such as the database name, database host, username and password, authentication keys and salts, and the database table prefix. This configuration file can also be used to activate DEBUG mode, which can useful in troubleshooting.
├── wp-config-sample.php
├── wp-content: folder is the main directory where plugins and themes are stored
    ├── index.php
    ├── plugins
    └── themes
├── wp-cron.php
├── wp-includes: contains everything except for the administrative components and the themes that belong to the website. This is the directory where core files are stored, such as certificates, fonts, JavaScript files, and widgets.
├── wp-links-opml.php
├── wp-load.php
├── wp-login.php: The login page can be located at one of the following paths /wp-admin/login.php, /wp-admin/wp-login.php, /login.php or /wp-login.php.
├── wp-mail.php
├── wp-settings.php
├── wp-signup.php
├── wp-trackback.php
└── xmlrpc.php: is a file representing a feature of WordPress that enables data to be transmitted with HTTP acting as the transport mechanism and XML as the encoding mechanism.
```


## WordPress User Roles

- **Administrator:** This user has access to administrative features within the website. This includes adding and deleting users and posts, as well as editing source code.
- **Editor:**	An editor can publish and manage posts, including the posts of other users.
Author	Authors can publish and manage their own posts.
Contributor	These users can write and manage their own posts but cannot publish them.
Subscriber	These are normal users who can browse posts and edit their profiles.

## Information gathering
### WordPress Core Version Enumeration

#### WP Version 

**Source Code**
```bash
curl -s -X GET TARGET_URL | grep '<meta name="generator"'
```

**CSS**
```
...SNIP...
<link rel='stylesheet' id='bootstrap-css'  href='http://TARGET_URL/wp-content/themes/ben_theme/css/bootstrap.css?ver=5.3.3' type='text/css' media='all' />
<link rel='stylesheet' id='transportex-style-css'  href='http://TARGET_URL/wp-content/themes/ben_theme/style.css?ver=5.3.3' type='text/css' media='all' />
<link rel='stylesheet' id='transportex_color-css'  href='http://TARGET_URL/wp-content/themes/ben_theme/css/colors/default.css?ver=5.3.3' type='text/css' media='all' />

...SNIP...
```

**JS**
```
<script type='text/javascript' src='http://TARGET_URL/wp-includes/js/jquery/jquery-migrate.min.js?ver=1.4.1'></script>
<script type='text/javascript' src='http://TARGET_URL/wp-content/plugins/mail-masta/lib/subscriber.js?ver=5.3.3'></script>
```

> In older WordPress versions, another source for uncovering version information is the readme.html file in WordPress's root directory.


#### Plugins and Themes Enumeration

**Plugins**
``` bash
curl -s -X GET TARGET_URL | sed 's/href=/\n/g' | sed 's/src=/\n/g' | grep 'wp-content/plugins/*' | cut -d"'" -f2
```

**Themes**
```bash
curl -s -X GET TARGET_URL | sed 's/href=/\n/g' | sed 's/src=/\n/g' | grep 'themes' | cut -d"'" -f2
```

**Plugins Active Enumeration**
```bash
curl -I -X GET TARGET_URL/wp-content/plugins/mail-masta
```

> Even if a plugin is deactivated, it may still be accessible, and therefore we can gain access to its associated scripts and functions. Deactivating a vulnerable plugin does not improve the WordPress site's security. It is best practice to either remove or keep up-to-date any unused plugins.

> It is best practice to disable directory indexing on web servers so a potential attacker cannot gain direct access to any files or folders other than those necessary for the website to function properly.


## Common vulnerabilities

- Vulnerable plugins and themes
- Brute force attacks
- SQL Injection
- Cross-Site Scripting (XSS)
- Cross-Site Request Forgery (CSRF)
- Insecure configuration: misconfigurations, weak passwords and overly permissive settings

### User Enumeration


#### First Method

- The first method is reviewing posts to uncover the ID assigned to the user and their corresponding username. If we mouse over the post author link titled "by admin," as shown in the below image, a link to the user's account appears in the web browser's lower-left corner.
- The admin user is usually assigned the user ID 1. We can confirm this by specifying the user ID for the author parameter in the URL.
- The below cURL request then redirects us to the user's profile page or the main login page. If the user does not exist, we receive a 404 Not Found error: `curl -s -I TARGET_URL/?author=1`

#### Second Method
- The second method requires interaction with the JSON endpoint, which allows us to obtain a list of users. 
- This was changed in WordPress core after version 4.7.1, and later versions only show whether a user is configured or not. 
- Before this release, all users who had published a post were shown by default: `curl TARGET_URL/wp-json/wp/v2/users | jq`

#### Login
Once we are armed with a list of valid users, we can mount a password brute-forcing attack to attempt to gain access to the WordPress backend. This attack can be performed via the login page or the xmlrpc.php page.


## WPScan

WPScan can pull in vulnerability information from external sources to enhance our scans. We can obtain an API token from WPVulnDB, which is used by [WPScan](https://wpscan.com/) to scan for vulnerability and exploit proof of concepts (POC) and reports. The free plan allows up to 50 requests per day.

```bash
# Default scan
wpscan --url TARGET_URL

# Enumerate users
wpscan --url TARGET_URL -e u

# Enumerate vulnerable plugins
wpscan --url TARGET_URL -e vp

# Enumerate vulnerable themes
wpscan --url TARGET_URL -e vt

# Perform brute-force attack to gain access as admin user
wpscan --url TARGET_URL -U admin -P WORDLIST_PATH
```