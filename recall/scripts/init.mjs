#!/usr/bin/env node
/**
 * Universal Recall init: bootstrap context.json for ANY project.
 * Run from any repo that has a recall/ folder: node recall/scripts/init.mjs
 * Creates context.json from package.json + folder scan (no project-specific defaults).
 */
import { readFileSync, readdirSync, existsSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");

const COMMON_DIRS = ["app", "src", "lib", "packages", "components", "workers", "docs", "server", "pages", "api"];

function inferStack(pkg) {
    const d = { ...pkg.dependencies, ...(pkg.devDependencies || {}) };
    const stack = [];
    if (d.next) stack.push("Next.js");
    if (d.react) stack.push("React");
    if (d["@supabase/supabase-js"]) stack.push("Supabase");
    if (d.express || d.fastify) stack.push("Node server");
    if (d.ioredis || d.redis) stack.push("Redis");
    if (d.prisma) stack.push("Prisma");
    if (d.pg) stack.push("PostgreSQL");
    return stack.length ? stack : [];
}

function discoverKeyPaths(root) {
    const keyPaths = {};
    for (const dir of COMMON_DIRS) {
        const full = join(root, dir);
        if (existsSync(full)) keyPaths[dir] = dir + "/";
    }
    const pkgPath = join(root, "package.json");
    if (existsSync(pkgPath)) keyPaths["package"] = "package.json";
    return keyPaths;
}

function main() {
    const pkgPath = join(ROOT, "package.json");
    const pkg = existsSync(pkgPath)
        ? JSON.parse(readFileSync(pkgPath, "utf-8"))
        : { name: "unknown", description: "" };

    const projectName = pkg.name || "my-project";
    const oneLiner = (pkg.description && pkg.description.trim()) || "TODO: one-line project summary (edit recall/context.json)";
    const stack = inferStack(pkg);
    const keyPaths = discoverKeyPaths(ROOT);
    const now = new Date().toISOString();

    const context = {
        version: 1,
        projectName,
        oneLiner,
        stack,
        currentFocus: "",
        pendingTasks: [],
        keyPaths,
        rules: [],
        lastUpdated: now,
        lastUpdatedBy: "init",
        recentChanges: [],
        snapshot: null,
    };

    const contextPath = join(ROOT, "recall/context.json");
    writeFileSync(contextPath, JSON.stringify(context, null, 2) + "\n", "utf-8");
    console.log("[recall] Initialized context.json for:", projectName);
    console.log("[recall] Run 'npm run recall:snapshot' to add keyFiles and recent commits.");
}

main();
