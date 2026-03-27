# Passive Information Gathering

## Interesting files to check

### robots.txt

Check `/robots.txt` for hidden directories/files.

### sitemap.xml/sitemaps.xml

An XML file that provides search engines with a map of a site.

## Web technologies footprinting

Add-ons:
- BuiltWith
- [Wappalyzer](https://addons.mozilla.org/en-US/firefox/addon/wappalyzer/) provides insights about the technologies used on the visited websites. Such extension is handy, primarily when you collect all this information while browsing the website like any other user. A screenshot of Wappalyzer is shown below. You can find Wappalyzer for Firefox here.

Kali utility:
- whatweb: `whatweb TARGET_URL`

## Host command

Usage: `host DOMAIN`

## WHOIS, dig and nslookup
- Identifying Key Personnel: WHOIS records often reveal the names, email addresses, and phone numbers of individuals responsible for managing the domain. This information can be leveraged for social engineering attacks or to identify potential targets for phishing campaigns.

- Discovering Network Infrastructure: Technical details like name servers and IP addresses provide clues about the target's network infrastructure. This can help penetration testers identify potential entry points or misconfigurations.

- Historical Data Analysis: Accessing historical WHOIS records through services like **WhoisFreaks** can reveal changes in ownership, contact information, or technical details over time. This can be useful for tracking the evolution of the target's digital presence.

- This information might be redacted!

| Purpose                             | Commandline Example                     |
|-------------------------------------|-----------------------------------------|
| Lookup WHOIS record                 | `whois WEBSITE`                         |
| Lookup WHOIS record                 | `whois IP`                              |
| Lookup DNS A records                | `nslookup -type=A WEBSITE`              |
| Lookup DNS MX records at DNS server | `nslookup -type=MX WEBSITE 1.1.1.1`     |
| Lookup DNS TXT records              | `nslookup -type=TXT WEBSITE`            |
| Lookup DNS A records                | `dig WEBSITE A`                         |
| Lookup DNS MX records at DNS server | `dig @1.1.1.1 WEBSITE MX`               |
| Lookup DNS TXT records              | `dig WEBSITE TXT`                       |


## Netcraft

It is a service used to gather information regarding a target domain.  
Research tools: https://www.netcraft.com/resources/research-tools  

## DNS

### The Hosts File
- It is a simple text file used to map hostnames to IP addresses, providing a manual method of domain name resolution that bypasses the DNS process.
- It is located in `C:\Windows\System32\drivers\etc\hosts` on **Windows** and in `/etc/hosts` on **Linux and MacOS**. 
- It can also be used to block unwanted websites by redirecting their domains to a non-existent IP address

### Tools

#### DNSRecon

`dnsrecon -d DOMAIN_NAME`

#### DNS Dumpster 

Website: https://dnsdumpster.com/ 


## WAF Detection with wafw00f

It identifies wheter a website is protected by a WAF and gives you information regarding it.

GitHub repository: https://github.com/EnableSecurity/wafw00f
 
### Usage 

- Default usage: `wafw00f DOMAIN_NAME`

- Test for all possible WAF Instances: `wafw00f DOMAIN_NAME -a`


## Passive Subdomain Enumeration
This relies on external sources of information to discover subdomains without directly querying the target's DNS servers. One valuable resource is Certificate Transparency (CT) logs, public repositories of SSL/TLS certificates.
Another passive approach involves utilising search engines like Google or DuckDuckGo. By employing specialised search operators (e.g., site:), you can filter results to show only subdomains related to the target domain.

### Sublist3r

Sublist3r is a python tool designed to enumerate subdomains of websites using OSINT.

GitHub repository: https://github.com/aboul3la/Sublist3r

#### Usage

- Default usage: `sublist3r -d DOMAIN_NAME`
- Check with specific engines: `sublist3r -d DOMAIN_NAME -e google,yahoo`

## Wayback URLs
To dump all of the links that are saved in Wayback Machine, we can use the tool called waybackurls. Hosted in [GitHub](https://github.com/tomnomnom/waybackurls).


## Google Dorks

### Examples

Limit all results to a specific domain: `site:DOMAIN_NAME`

Look for specific results in URL: `site:DOMAIN_NAME inurl:URL_STRING`

Look for specific results in the site's title: `site:DOMAIN_NAME intitle:URL_STRING`

Look for specific file types (PDF,docx,zip,etc): `site:DOMAIN_NAME filetype:FILE_TYPE`

Enumerate subdomains: `site:*.DOMAIN_NAME`

Sites with directory listing enabled: `intitle:"index of"`

Find an older version of a website: `cache:DOMAIN_NAME`

Search for exposed passwords: `inurl:auth_user_file.txt`

Search for exposed passwords: `inurl:password.txt`

### Google Hacking Database

https://www.exploit-db.com/google-hacking-database


## Email Harvesting using theHarvester

Tool that enumerates emails beloing to a specific domain.

GitHub repository: https://github.com/laramies/theHarvester

> It also contains modules that perform active recon.

### Usage

- Using the domain name: `theHarvester -d DOMAIN_NAME -b SOURCES`

- Using the organization name: `theHarvester -d ORG_NAME -b SOURCES`


## Leaked Password Databases

Website: https://haveibeenpwned.com/

## Other passive reconnaissance tools

- https://www.shodan.io/
- https://archive.org
