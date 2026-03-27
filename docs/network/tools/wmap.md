# WMAP

WMAP is a web application vulnerability scanner that can be used to automate web server enumeration and scan web applications for vulnerabilities.

It is available as an MSF plugin and can be loaded directly into MSF.

```bash
service postgresql start

msfconsole -q

workspace -a WORKSPACE_NAME

setg RHOSTS TARGET_IP

# Load WMAP
load wmap

# Add site
wmap_sites -a TARGET_IP

# Define target IP
wmap_targets -t http://TARGET_IP/

# List sites
wmap_sites -l

# List targets
wmap_targets -l

# Check for the auxiliary modules that would make sense in the target system
wmap_run -t

# Run wmap
wmap_run -e

# List detected vulnerabilities
wmap_vulns -l
```