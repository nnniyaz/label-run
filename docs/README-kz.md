* [Қазақша](#сипаттама)
* [English](../README.md)
* [Русский](./README-ru.md)

> **Node.js ≥ 18** қажет.

---

## Сипаттама

Shell-бұйрықтарды **кезекпен** іске қосып, әр жолдың алдына метка-префикс қойып және түсіндірме түстермен бояп көрсетеді. Қай қадам қандай шығуды беріп жатқанын оңай бақылауға көмектеседі. Бірнеше скриптті ретімен орындап, логтарды жинақы ұстайтын жағдайларға ыңғайлы.

### Орнату

```bash
npm i -D @nnniyaz/label-run
# немесе бүкіл жүйеге:
# npm i -g @nnniyaz/label-run
```

### Қолдану (CLI)

**Жергілікті орнатылған болса:**

```bash
npx label-run "LINT:npm run lint" "BUILD:npm run build" "TEST:npm test"
```

**`package.json` ішіндегі мысал ретінде берілген скрипттер:**

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

`npm run tidy-dev` іске қосқанда, келесі түрде шығады:

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

**Орнатусыз (scoped пакетті npx арқылы):**

```bash
npx -y @nnniyaz/label-run label-run "LINT:npm run lint" "BUILD:npm run build" "TEST:npm test"
# немесе соңғы нұсқаны нақты көрсету:
# npx -y @nnniyaz/label-run@latest label-run "..."
```

**Көмек**

```bash
label-run --help
```

### Қолдану (API)

```ts
import { runOne, runMany } from "@nnniyaz/label-run";

// Бір бұйрықты меткамен іске қосу
await runOne("ECHO", "echo сәлем", { cwd: process.cwd(), env: { FOO: "bar" } });

// Бірнеше бұйрықты ретімен іске қосу; бірінші қате шыққанда тоқтайды
await runMany(
  ["A:echo бірінші", "B:echo екінші"],
  { cwd: process.cwd(), env: { CI: "true" } }
);
```

### Жұмыс істеу тәртібі

* **Бірінші қателікте** тоқтайды.
* Сәтті орындалса **0** кодымен, қате болса **1** кодымен аяқталады (CI үшін ыңғайлы).
* Параметрлерді қолдайды: `cwd` (жұмыс қалтасы) және `env` (орта айнымалылары).
