---
name: development-guidelines
description: "Enforces dependency management best practices during code development. Ensures latest library versions, verified documentation lookups, and correct API usage. Use when starting implementation, adding dependencies, importing libraries, upgrading packages, or when unsure how an external API or SDK works. Trigger phrases: 'add dependency', 'install package', 'update library', 'how does this API work', 'check documentation'."
---

# Development Guidelines

## Working with Dependencies

1. Always try to use latest versions for dependencies.
2. If you are not sure, **do not make assumptions about how external dependencies work**. Always consult documentation.
3. Before trying alternative methods, look up documentation for external dependencies (libraries, SDKs, APIs, frameworks, tools):
   - **Preferred**: If a `context7` MCP server is available (see [context7 MCP setup guide](./references/context7-mcp-setup.md)), use it to look up documentation.
   - **Fallback**: Use web-search or read the project's `node_modules`/installed package docs directly.
   - **IMPORTANT! Always make sure that documentation version matches the declared dependency version.**

## Version Management

1. **Pin exact versions in production**: Avoid using caret (`^`) or tilde (`~`) operators in `package.json` for critical dependencies. Use exact versions (`1.2.3` not `^1.2.3`) to ensure reproducible builds and prevent unexpected breaking changes in production environments.

2. **Use lock files and commit them**: Always commit `package-lock.json` (npm), `yarn.lock` (Yarn), or equivalent lock files to your repository. Lock files ensure that all team members and CI/CD pipelines install identical dependency trees.

3. **Review changelogs before major upgrades**: Before upgrading a dependency to a new major version, carefully read its changelog to understand breaking changes. This prevents surprises and helps plan migration efforts.

4. **Test dependency updates in isolation**: When updating dependencies, test changes in a dedicated branch or environment before merging to main. Verify that existing functionality still works and that no new errors appear.

## API and SDK Usage

1. **Read official documentation first**: Never guess how an API or SDK works. Always consult the official documentation before implementing. This saves time and reduces bugs caused by incorrect assumptions.

2. **Check for deprecation warnings**: Pay attention to deprecation warnings in dependency output (npm warnings, build logs, etc.). These indicate APIs or features that may be removed in future versions. Plan migrations accordingly.

3. **Wrap third-party APIs in adapter layers**: Instead of calling third-party APIs directly throughout your codebase, wrap them in dedicated service/adapter classes or functions. This approach:
   - Makes testing easier through dependency injection or mocking
   - Simplifies migration if you need to switch libraries
   - Centralizes error handling and API contract management

4. **Handle API errors gracefully**: Always implement proper error handling for API calls. Use appropriate error types (e.g., custom error classes) to distinguish between different failure modes (network errors, validation errors, rate limiting, etc.), and handle each appropriately.

## Security Considerations

1. **Run security audits regularly**: Execute `npm audit` (npm), `pip audit` (Python), or equivalent tools for your package manager regularly to identify known vulnerabilities in dependencies. Integrate this into your CI/CD pipeline.

2. **Be selective about package sources**: Avoid installing packages with no recent maintenance activity or suspiciously low download counts. These may indicate abandoned projects or potential security risks. Prefer actively maintained, well-known packages.

3. **Review transitive dependencies**: Understand not just your direct dependencies but also their dependencies (transitive dependencies). Tools like `npm audit`, `npm ls`, and dependency visualizers help identify where vulnerabilities come from.

4. **Never commit secrets**: Never commit API keys, tokens, passwords, or other secrets to your repository, even in configuration files. Use environment variables, `.env` files (excluded from git), or secret management tools instead. Use `.gitignore` to prevent accidental commits.

## Troubleshooting

1. **Dependency version conflicts and peer dependencies**: When you encounter peer dependency warnings or version conflicts:
   - Check the error message carefully to understand which packages conflict
   - Review the dependency tree using `npm ls` or `yarn why`
   - Consider upgrading one or more packages to compatible versions
   - As a last resort, use `npm install --legacy-peer-deps` (npm v7+) only temporarily while resolving the underlying issue

2. **"Module not found" errors**: When you get module not found errors:
   - Verify import paths match actual file locations
   - Check the `exports` field in the package's `package.json` to understand the public API
   - Ensure the package is listed in your `package.json` (not just installed in `node_modules`)
   - Verify that bundled types/definitions are available if using TypeScript

3. **Breaking changes after updating**: When a dependency update breaks your code:
   - Check the package's migration guide or upgrade guide
   - Look for available codemods that automate migration steps
   - Review the CHANGELOG for detailed information about what changed
   - Test incrementally: update one package at a time to isolate the issue

4. **Build failures from dependency updates**: If builds fail after updating dependencies:
   - Verify Node.js version compatibility (some packages require Node.js 14+, 16+, etc.)
   - Check if the package has native bindings that need recompilation
   - Clear `node_modules` and reinstall: `rm -rf node_modules package-lock.json && npm install`
   - Consult the package's issue tracker to see if others reported similar problems

## Integration with Other Skills

- **solid-code-review**: After implementing with external dependencies, run a code review to check for proper usage patterns and security
- **implementation-process**: These guidelines apply to every implementation step — always verify dependency documentation before using external APIs
- **testing-process**: When adding new dependencies, ensure tests cover the integration points
