# Development Guide

## Project Structure

```
src/
├── classes/       # Base classes
├── errors/        # Error definitions
├── interfaces/    # TypeScript interfaces
├── resources/     # Static resources
├── services/      # Core services
├── types/         # TypeScript types
└── utils/         # Utility functions
```

## Adding a New Provider

1. Create a new provider class extending [`ProviderBase`](../src/classes/Provider.Base.ts).

2. Implement required methods:

- [`buildSearchParams()`](../src/classes/Provider.Base.ts)
- [`transformResponse()`](../src/classes/Provider.Base.ts)

3. Add provider to the `providers` object in [`server.ts`](../src/server.ts)

## Testing

Currently, the project doesn't include automated tests. Contributions for testing infrastructure are welcome!

## Code Style

The project uses Prettier for code formatting. Run:

```bash
npm run format
```

This will format all the files in the project.
