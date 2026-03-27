# PowerShell-Empire

It is a pure PowerShell **exploitation/post-exploitation** framework built on cryptological-secure communications and flexible architecture.

Empire implements the ability to run PowerShell agents without needing powershell.exe.

It is mainly used for Windows targets.

```bash
# Start Empire server
sudo powershell-empire server

# Start Empire client
sudo powershell-empire client

# List listeners
listeners

# List target systems
agents

interact AGENT_NAME
```

## Starkiller

It is a GUI frontend for the PowerShell Empire and provides users with an intuitive way of interacting with Empire.

### Default credentials

- User: `empireadmin`
- Password: `password123`

### Steps to use Starkiller

1. Create a listener
- Type: http
- Host: attacker IP address

2. Generate stager
- Type: windows/csharp_exec
- Listener: http
- OutFile: stager.exe

3. Download stager: Actions>Download

4. Deliver stager to the target system.

5. Execute stager on the target system.
