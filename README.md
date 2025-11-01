* [Қазақша](./docs/README-kz.md)
* [English](#description)
* [Русский](./docs/README-ru.md)

> Requires **Node.js ≥ 18**.

---

## Description

Run shell commands sequentially with prefixed, colorized output so you can easily identify which command is producing which output. Useful for running multiple commands in sequence and keeping their outputs organized.

### Installation

```bash
npm i -D @nnniyaz/label-run
# or globally:
# npm i -g @nnniyaz/label-run
```

### Usage (CLI)

**If installed locally:**

```bash
npx label-run "LINT:npm run lint" "BUILD:npm run build" "TEST:npm test"
```

**Example `package.json` scripts:**
```json
{
    "scripts": {
      "dev": "next dev",
      "lint": "eslint",
      "format": "prettier --write \"**/*.{ts,tsx,js,jsx}\"",
      "tidy": "label-run \"LINT:npm run lint\" \"FORMAT:npm run format\"",
      "tidy-dev": "label-run \"TIDY:npm run tidy\" \"DEV:npm run dev\""
    }
}
```

How it looks when you run `npm run tidy-dev`:

```text

> project-name@0.1.0 tidy-dev
> label-run "TIDY:npm run tidy" "DEV:npm run dev"

[TIDY] > npm run tidy
[TIDY] 
[TIDY] > project-name@0.1.0 tidy
[TIDY] > label-run "LINT:npm run lint" "FORMAT:npm run format"
[TIDY] 
[TIDY] [LINT] > npm run lint
[TIDY] [LINT] 
[TIDY] [LINT] > project-name@0.1.0 lint
[TIDY] [LINT] > eslint
[TIDY] [LINT] 
[TIDY] [LINT]  ✔ done
[TIDY] [FORMAT] > npm run format
[TIDY] [FORMAT] 
[TIDY] [FORMAT] > project-name@0.1.0 format
[TIDY] [FORMAT] > prettier --write "**/*.{ts,tsx,js,jsx}"
[TIDY] [FORMAT] 
[TIDY] [FORMAT] app/layout.tsx 19ms (unchanged)
[TIDY] [FORMAT] app/page.tsx 1ms (unchanged)
[TIDY] [FORMAT] next.config.ts 2ms (unchanged)
[TIDY] [FORMAT]  ✔ done
[TIDY]  ✔ done
[DEV] > npm run dev
[DEV] 
[DEV] > project-name@0.1.0 dev
[DEV] > next dev
[DEV] 
[DEV]    ▲ Next.js 16.0.1 (Turbopack)
[DEV]    - Local:        http://localhost:3000
[DEV]    - Network:      http://10.102.76.102:3000
[DEV] 
[DEV]  ✓ Starting...
[DEV]  ✓ Ready in 392ms

```

**Without installing (scoped package via npx):**

```bash
npx -y @nnniyaz/label-run label-run "LINT:npm run lint" "BUILD:npm run build" "TEST:npm test"
```

**Help**

```bash
label-run --help
```

### Usage (API)

```ts
import { runOne, runMany } from "@nnniyaz/label-run";

// Runs one command with a label
await runOne("ECHO", "echo hello", { cwd: process.cwd(), env: { FOO: "bar" } });

// Runs several commands in order; stops on first failure
await runMany(
  ["A:echo first", "B:echo second"],
  { cwd: process.cwd(), env: { CI: "true" } }
);
```

**Behavior**

* Stops on the **first error**.
* Returns code **0** on success, **1** on error (useful for CI pipelines).
* Supports `cwd` and `env` options to specify the working directory and environment variables for the commands.
