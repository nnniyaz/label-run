import { spawn } from "node:child_process";

const green = "\x1b[32m";
const red = "\x1b[31m";
const bold = "\x1b[1m";
const dim = "\x1b[2m";
const reset = "\x1b[0m";

function makePrefixer(prefix, writer) {
    let buf = "";
    const tag = `[${prefix}] `;
    return (chunk) => {
        buf += chunk.toString();
        let idx;
        while ((idx = buf.indexOf("\n")) !== -1) {
            const line = buf.slice(0, idx);
            buf = buf.slice(idx + 1);
            writer(`${dim}${tag}${reset}${line}\n`);
        }
    };
}

/**
 * Runs a single command and prefixes its output.
 * @param {string} label A label to prefix the output with (e.g., "build", "test", etc.)
 * @param {string} cmd The command to run (e.g., "npm run build", "jest", etc.)
 * @param {{cwd?: string, env?: NodeJS.ProcessEnv}} [opts]
 */
export function runOne(label, cmd, opts = {}) {
    return new Promise((resolve, reject) => {
        const tag = `[${label}]`;
        process.stdout.write(`${dim}${tag}${reset} > ${cmd}\n`);

        const child = spawn(cmd, {
            shell: true,
            stdio: ["inherit", "pipe", "pipe"],
            cwd: opts.cwd,
            env: { ...process.env, ...opts.env }
        });

        const outPrefix = makePrefixer(label, (chunk) => process.stdout.write(chunk));
        const errPrefix = makePrefixer(label, (chunk) => process.stderr.write(chunk));

        if (child.stdout) child.stdout.on("data", outPrefix);
        if (child.stderr) child.stderr.on("data", errPrefix);

        // Handle SIGINT (Ctrl+C) to kill the child process gracefully
        const onSigint = () => {
            child.kill("SIGINT");
        };
        process.once("SIGINT", onSigint);

        child.on("exit", (code) => {
            process.removeListener("SIGINT", onSigint);
            if (code === 0) {
                process.stdout.write(`${dim}${tag}${reset}  ${green}✔ done${reset}\n`);
                resolve();
            } else {
                process.stderr.write(
                    `${dim}${tag}${reset}  ${bold}${red}✖ failed (code ${code})${reset}\n`
                );
                reject(new Error(`${label} failed with code ${code}`));
            }
        });
    });
}

/**
 * Sequentially runs an array of strings in the format "LABEL:command".
 * If any command fails, the sequence stops and an error is thrown.
 * @param {string[]} items
 * @param {{cwd?: string, env?: NodeJS.ProcessEnv}} [opts]
 */
export async function runMany(items, opts = {}) {
    for (const arg of items) {
        const i = arg.indexOf(":");
        if (i === -1) throw new Error(`Bad arg "${arg}". Use "LABEL:command".`);
        const label = arg.slice(0, i);
        const cmd = arg.slice(i + 1);
        await runOne(label, cmd, opts);
    }
}