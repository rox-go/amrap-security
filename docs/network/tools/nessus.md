# Nessus

Nessus automates the process of identifying vulnerabilities and also provides information regarding vulnerabilities like their CVE code.

## Initial setup

1. Start Nessus service

```bash
sudo systemctl start nessusd.service
```

2. Create new scan: New scan > Basic Network Scan

3. Modify needed configuration to adapt it to your needs.

4. Run scan

5. Export results

6. Import results into Metasploit

```bash
msfconsole -q

workspace -a WORKSPACE_NAME

# Import results
db_import Nessus_report_path

# Show hosts
hosts

# Open services
services

# Check vulnerabilities
vulns

# Check SMB vulnerabilities 
vulns -p 445

# Search for vulnerabilities using the CVE
search cve:2017 name:smb
search cve:2012 name:rdp
search Microsoft_Vuln_ID
```