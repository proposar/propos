#!/usr/bin/env node
/**
 * Update Recall context from CLI so any AI can set focus/pending without editing JSON by hand.
 * Usage:
 *   node recall/scripts/update-context.mjs --focus "Implement FAQ section"
 *   node recall/scripts/update-context.mjs --pending "Add Redis rate limit"
 *   node recall/scripts/update-context.mjs --change "Fixed landing CTA"
 *   node recall/scripts/update-context.mjs --focus "" --pending "Task one" --pending "Task two"
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const CONTEXT_PATH = join(ROOT, "recall/context.json");

function parseArgs() {
    const args = process.argv.slice(2);
    const out = { focus: null, pending: [], change: null };
    for (let i = 0; i < args.length; i++) {
        if (args[i] === "--focus" && args[i + 1] != null) {
            out.focus = args[i + 1];
            i++;
        } else if (args[i] === "--pending" && args[i + 1] != null) {
            out.pending.push(args[i + 1]);
            i++;
        } else if (args[i] === "--change" && args[i + 1] != null) {
            out.change = args[i + 1];
            i++;
        }
    }
    return out;
}

function main() {
    const { focus, pending, change } = parseArgs();
    if (!focus && pending.length === 0 && !change) {
        console.log("Usage: node recall/scripts/update-context.mjs [--focus \"...\"] [--pending \"...\"] [--change \"...\"]");
        process.exit(0);
    }

    let ctx;
    if (existsSync(CONTEXT_PATH)) {
        ctx = JSON.parse(readFileSync(CONTEXT_PATH, "utf-8"));
    } else {
        ctx = { version: 1, projectName: "", oneLiner: "", stack: [], currentFocus: "", pendingTasks: [], keyPaths: {}, rules: [], lastUpdated: new Date().toISOString(), lastUpdatedBy: "update-context", recentChanges: [] };
    }

    const now = new Date().toISOString();
    if (focus !== null) ctx.currentFocus = focus;
    if (pending.length) ctx.pendingTasks = [...(ctx.pendingTasks || []), ...pending];
    if (change) {
        ctx.recentChanges = ctx.recentChanges || [];
        ctx.recentChanges.unshift({ at: now, what: change });
        ctx.recentChanges = ctx.recentChanges.slice(0, 10);
    }
    ctx.lastUpdated = now;
    ctx.lastUpdatedBy = "update-context";

    writeFileSync(CONTEXT_PATH, JSON.stringify(ctx, null, 2) + "\n", "utf-8");
    console.log("[recall] Updated recall/context.json");
}

main();
