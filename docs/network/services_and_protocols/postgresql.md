# PostgreSQL

## Useful Metasploit modules:
- **auxiliary/scanner/postgres/postgres_login:** it enumerates user credentials
- **auxiliary/admin/postgres/postgres_sql:** it executes commands
- **auxiliary/scanner/postgres/postgres_hashdump:** it dumps hashes
- **auxiliary/admin/postgres/postgres_readfile:** it allows an authenticated user to view files of their choosing on the server
- **exploit/multi/postgres/postgres_copy_from_program_cmd_exec:**: it allows arbitrary command execution with the proper user credentials