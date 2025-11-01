* [Қазақша](./README-kz.md)
* [English](../README.md)
* [Русский](#описание)

> Requires **Node.js ≥ 18**.

---

## Описание

Запускайте shell-команды **последовательно** с меткой-префиксом и цветным выводом — сразу видно, какая команда печатает строку.

### Установка

```bash
npm i -D @nnniyaz/label-run
# или глобально:
# npm i -g @nnniyaz/label-run
```

### Использование (CLI)

**Если пакет установлен локально:**

```bash
npx label-run "LINT:npm run lint" "BUILD:npm run build" "TEST:npm test"
```

**Пример скриптов в `package.json`:**

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

Как это выглядит при запуске `npm run tidy-dev`:

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

**Без установки (через npx для scoped-пакета):**

```bash
npx -y @nnniyaz/label-run label-run "LINT:npm run lint" "BUILD:npm run build" "TEST:npm test"
```

**Справка**

```bash
label-run --help
```

### Использование (API)

```ts
import { runOne, runMany } from "@nnniyaz/label-run";

// Запускает одну команду с меткой
await runOne("ECHO", "echo привет", { cwd: process.cwd(), env: { FOO: "bar" } });

// Запускает несколько команд по порядку; останавливается при первой ошибке
await runMany(
    ["A:echo первый", "B:echo второй"],
    { cwd: process.cwd(), env: { CI: "true" } }
);
```

**Поведение**

* Останавливается на **первой ошибке**.
* Возвращает код **0** при успехе, **1** при ошибке (удобно для CI).
* Поддерживаются опции `cwd` и `env`.
