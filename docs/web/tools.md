# Nikto

```bash
# General scan
nikto -url TARGET_URL/TARGET_IP

# Scan specific endpoint
nikto -url TARGET_URL -Tunning 5 -o nikto.htm
```

# Gobuster

```bash
# Directory scan
gobuster dir -u TARGET_URL -w WORDLIST_PATH

# Excludes specfific response codes
gobuster dir -u TARGET_URL -w WORDLIST_PATH -b 403,404

# Find files with specific extensions
gobuster dir -u TARGET_URL -w WORDLIST_PATH -x .php,.xml,.txt
```