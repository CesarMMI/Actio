## Testing the Actio API

### Test suites

- **Unit tests**: located under `tests/unit`.
- **E2E tests**: located under `tests/e2e`.

### Commands

- **Run all non-e2e tests** (unit-style suites)

```bash
npm test
```

- **Run unit tests only**

```bash
npm run test:unit
```

- **Run e2e tests only**

```bash
npm run test:e2e
```

### Environments

- Unit tests do not require a database.
- E2E tests use environment files:
  - `.env.test` for generic test environment.
  - `.env.e2e` for e2e-specific overrides.

