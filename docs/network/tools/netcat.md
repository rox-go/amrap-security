# Netcat

Netcat is a networking utility used to read and write data to network connections using TCP or UDP.

Netcat uses a client-server communication architecture with two modes:
- Client mode: netcat can be used to connect to any TCP/UDP port, `nc -nv MACHINE_IP PORT_NUMBER`.
- Server mode: netcat can be used to listen for connections from clients on a specific port, `nc -nvlp PORT`.

Netcan can be used for:
- Banner grabbing
- Port scanning
- Transferring files
- Bind/revere shells

Options:
- -v: verbose option
- -u: UDP option
- -l: set up a listener
- -n: no DNS option, disables DNS resolution
- -e: allows the execution of commands

Transfer files with Netcat:
- Listen for content: `nc -nvlp 1234 > test.txt`
- Transfer the file: `nc -nv IP 1234 < test.txt`


## Netcat Shell Stabilisation

### Linux

1. Use Python to spawn a bash shell: `python -c 'import pty;pty.spawn("/bin/bash")'`
2. Get access to term commands = `export TERM=xterm`
3. Background the shell using the command Ctrl+Z
4. Turn off our own terminal echo and foregrounds the shell: `stty raw -echo; fg`

>If the shell dies, any input in your own terminal will not be visible (as a result of having disabled terminal echo). To fix this, type `reset` and press enter.