#!/usr/bin/env node
/**
 * Generate a codebase fingerprint for Recall. Works in ANY project (universal).
 * Run: node recall/scripts/generate-snapshot.mjs (or npm run recall:snapshot)
 * Then read recall/context.json (with snapshot) instead of scanning the whole repo.
 * Project root = parent of recall/ folder.
 */
import { readFileSync, readdirSync, existsSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");

function listFiles(dir, ext, max = 50) {
    if (!existsSync(dir)) return [];
    const out = [];
    try {
        const walk = (d, prefix = "") => {
            if (out.length >= max) return;
            const entries = readdirSync(d, { withFileTypes: true });
            for (const e of entries) {
                if (e.name.startsWith(".") || e.name === "node_modules") continue;
                const rel = prefix ? `${prefix}/${e.name}` : e.name;
                if (e.isDirectory()) walk(join(d, e.name), rel);
                else if (ext.some((x) => e.name.endsWith(x))) out.push(rel);
            }
        };
        walk(dir);
    } catch (_) {}
    return out;
}

function gitLog(n = 5) {
    try {
        return execSync(`git log -${n} --oneline`, { cwd: ROOT, encoding: "utf-8" })
            .trim()
            .split("\n")
            .filter(Boolean);
    } catch {
        return [];
    }
}

function main() {
    const pkgPath = join(ROOT, "package.json");
    const pkg = existsSync(pkgPath)
        ? JSON.parse(readFileSync(pkgPath, "utf-8"))
        : { name: "unknown", dependencies: {} };

    const keyDirs = ["app", "src", "lib", "components", "workers", "docs", "server", "pages", "api", "packages"];
    const keyFiles = [];
    const codeExt = [".tsx", ".ts", ".js", ".jsx", ".mjs", ".cjs"];
    const docExt = [".md"];
    for (const dir of keyDirs) {
        const full = join(ROOT, dir);
        if (!existsSync(full)) continue;
        if (dir === "docs")
            keyFiles.push(...listFiles(full, docExt, 30).map((f) => `${dir}/${f}`));
        else
            keyFiles.push(...listFiles(full, codeExt, 35).map((f) => `${dir}/${f}`));
    }

    const snapshot = {
        generatedAt: new Date().toISOString(),
        projectName: pkg.name,
        keyDirs,
        keyFiles: [...new Set(keyFiles)].slice(0, 60),
        recentCommits: gitLog(5),
    };

    const contextPath = join(ROOT, "recall/context.json");
    let context = { version: 1, lastUpdated: new Date().toISOString() };
    if (existsSync(contextPath)) {
        context = JSON.parse(readFileSync(contextPath, "utf-8"));
    }
    context.snapshot = snapshot;
    context.lastUpdated = snapshot.generatedAt;
    context.lastUpdatedBy = "generate-snapshot";

    writeFileSync(contextPath, JSON.stringify(context, null, 2) + "\n", "utf-8");
    console.log("[recall] Snapshot written to recall/context.json");
}

main();
