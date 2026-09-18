# Context7 MCP Server Setup Guide

Context7 is an MCP server that provides up-to-date, version-specific documentation lookups for libraries, SDKs, APIs, and frameworks. It helps ensure you're reading documentation that matches your project's dependency versions.

## Installation

1. Install the Context7 MCP server:
   ```bash
   npx -y @anthropic/context7-mcp
   ```

2. Add the Context7 MCP configuration to your Claude settings (`.claude/settings.json` or project-level `.mcp.json`):
   ```json
   {
     "mcpServers": {
       "context7": {
         "command": "npx",
         "args": ["-y", "@anthropic/context7-mcp"]
       }
     }
   }
   ```

3. Verify the MCP server is running:
   ```bash
   claude mcp list
   ```
   You should see `context7` in the output.

## Usage

Once configured, Context7 provides documentation lookup tools:

- **`resolve-library-id`**: Finds the correct library identifier for a dependency
- **`get-library-docs`**: Fetches version-specific documentation for a library

### Example Workflow

```
1. Identify the dependency and its version from package.json / go.mod / requirements.txt
2. Use context7 resolve-library-id to find the library
3. Use context7 get-library-docs with the resolved ID and target version
4. Verify the documentation version matches the installed dependency version
```

## Fallback Strategy

If Context7 is not available or cannot find documentation:

1. **Web search**: Search for `"{library-name}" documentation v{version}`
2. **Package docs**: Read documentation directly from `node_modules/{package}/README.md` or the package's docs directory
3. **Official sites**: Navigate to the library's official documentation site
4. **Release notes**: Check GitHub release notes for version-specific changes

## Troubleshooting

- **Context7 MCP not found**: Ensure `npx` is available and the package can be fetched
- **Documentation not found**: Not all libraries are indexed — fall back to web search
- **Version mismatch**: Always cross-check the returned documentation version against your `package.json` / lock file
- **Timeout errors**: Context7 fetches docs remotely; slow connections may cause timeouts. Retry or use fallback methods.

## Note

Context7 is optional. The development-guidelines skill works without it by falling back to web search and direct package documentation reading.
