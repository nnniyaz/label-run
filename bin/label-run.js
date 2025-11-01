#!/usr/bin/env node
import { runMany } from "../src/index.js";

function printHelp() {
    const msg = `
label-run — runs commands sequentially with prefixes (ESM)

Usage:
  label-run "LINT:npm run lint" "BUILD:npm run build" "TEST:npm test"

Argument format:
  "LABEL:command with arguments"

Options:
  -h, --help    show this help message
`;
    process.stdout.write(msg);
}

async function main() {
    const args = process.argv.slice(2);
    if (args.length === 0 || args.includes("-h") || args.includes("--help")) {
        printHelp();
        return;
    }

    try {
        await runMany(args);
    } catch {
        process.exitCode = 1;
    }
}

main();