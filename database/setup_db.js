#!/usr/bin/env node
"use strict";
const path = require("path");
const fs = require("fs");
const { spawnSafe, execShell } = require("../scripts/run-safe.js");

const scriptDir = path.resolve(__dirname);
const root = path.join(scriptDir, "..");
const schemaPath = path.join(scriptDir, "sql", "001_schema.sql");
const seedPath = path.join(scriptDir, "sql", "003_seed.sql");
const resetPath = path.join(scriptDir, "sql", "sql_run.sql");
const composePath = path.join(scriptDir, "compose.yaml");
const shouldReset = process.argv.includes("--reset");

function runCompose(args, opts = {}) {
  const r = spawnSafe("docker", ["compose", "-f", composePath, ...args], { cwd: opts.cwd || root, stdio: "inherit", ...opts });
  return r.status === 0;
}

function runComposeQuiet(args, opts = {}) {
  const r = spawnSafe("docker", ["compose", "-f", composePath, ...args], {
    cwd: opts.cwd || root,
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
    ...opts,
  });
  return r.status === 0 ? (r.stdout && r.stdout.toString()) : null;
}

function dockerExecSql(containerName, sqlContent) {
  const r = spawnSafe(
    "docker",
    ["exec", "-i", containerName, "psql", "-v", "ON_ERROR_STOP=1", "-U", "root", "-d", "craftless_db"],
    { input: sqlContent, cwd: root, stdio: ["pipe", "inherit", "inherit"] }
  );
  return r.status === 0;
}

function dockerExecCmd(containerName, psqlArgs) {
  const r = spawnSafe("docker", ["exec", containerName, "psql", "-U", "root", "-d", "craftless_db", ...psqlArgs], { cwd: root, stdio: "inherit" });
  return r.status === 0;
}

function dockerQuery(containerName, sql) {
  const r = spawnSafe(
    "docker",
    ["exec", "-i", containerName, "psql", "-U", "root", "-d", "craftless_db", "-t", "-A", "-F", "|", "-c", sql],
    { cwd: root, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }
  );
  return r.status === 0 ? (r.stdout && r.stdout.toString()) : null;
}

function composeExecSql(sqlContent) {
  const r = spawnSafe(
    "docker",
    ["compose", "-f", composePath, "exec", "-T", "pgdatabase", "psql", "-v", "ON_ERROR_STOP=1", "-U", "root", "-d", "craftless_db"],
    { input: sqlContent, cwd: root, stdio: ["pipe", "inherit", "inherit"] }
  );
  return r.status === 0;
}

function composeQuery(sql) {
  return runComposeQuiet(["exec", "-T", "pgdatabase", "psql", "-U", "root", "-d", "craftless_db", "-t", "-A", "-F", "|", "-c", sql]);
}

function psqlExecSql(baseArgs, sqlFilePath, env) {
  const r = spawnSafe("psql", [...baseArgs, "-v", "ON_ERROR_STOP=1", "-f", sqlFilePath], { cwd: scriptDir, stdio: "inherit", env });
  return r.status === 0;
}

function psqlExecCmd(baseArgs, env, psqlArgs) {
  const r = spawnSafe("psql", [...baseArgs, ...psqlArgs], { cwd: scriptDir, stdio: "inherit", env });
  return r.status === 0;
}

function psqlQuery(baseArgs, env, sql) {
  const r = spawnSafe("psql", [...baseArgs, "-t", "-A", "-F", "|", "-c", sql], {
    cwd: scriptDir,
    env,
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
  });
  return r.status === 0 ? (r.stdout && r.stdout.toString()) : null;
}

function getTableCounts(queryFn) {
  const out = queryFn([
    "select",
    "  (select count(*) from item),",
    "  (select count(*) from player),",
    "  (select count(*) from chest),",
    "  (select count(*) from villager),",
    "  (select count(*) from \"transfer\"),",
    "  (select count(*) from transfer_line_item);",
    /* (GUIDE) #1.4.1 ADD select (*) statement for your corresponding table */
    /* (select count(*) from TABLE_NAME);", */
  ].join(" "));
  if (!out) return null;

  const counts = String(out).trim().split("|").map((value) => Number(String(value).trim()));
  if (counts.length !== 6 || counts.some((value) => Number.isNaN(value))) return null;

  return {
    item: counts[0],
    player: counts[1],
    chest: counts[2],
    villager: counts[3],
    transfer: counts[4],
    transferLineItem: counts[5],
    /* (GUIDE) #1.4.2 ADD YOUR CORRESPONDING TABLE TO THE LIST, USE camelCase */
  };
}

function getSeedDecision(counts) {
  const allEmpty = Object.values(counts).every((value) => value === 0);
  if (allEmpty) {
    return { run: true, reason: "🌱 Database is empty. Running seed data..." };
  }

  const hasReferenceData = counts.item > 0 || counts.player > 0 || counts.chest > 0 || counts.villager > 0;
  const missingCraftLessData = counts.transfer === 0 && counts.transferLineItem === 0;
  /* (GUIDE) #1.4.3 ADD a check */
  /* && counts.tableNameInCamelCase === 0 */
  if (hasReferenceData && missingCraftLessData) {
    return { run: true, reason: "🩹 Reference data exists but transfer data is missing. Repairing seed data..." };
  }

  return { run: false, reason: "✅ Existing data found. Skipping seed." };
}

function logCounts(counts) {
  console.log(
    "📊 Current rows: item=" + counts.item +
    ", player=" + counts.player +
    ", chest=" + counts.chest +
    ", villager=" + counts.villager +
    ", transfer=" + counts.transfer +
    ", transfer_line_item=" + counts.transferLineItem /* LAST ITEM IN LIST MUST NOT HAVE "+" in the end */
    /* (GUIDE) #1.4.4 ADD LOGGING TO YOUR CORRESPONDING TABLE */
    /* {previous table name in snake case}=" + counts.{previous table name in camel case} +
    ", TABLE_NAME_IN_SNAKE_CASE=" + counts.tableNameInCamelCase */
  );
}

function verifyDocker(containerName) {
  dockerExecCmd(containerName, ["-c", "\\dt"]);
}

function verifyCompose() {
  runCompose(["exec", "-T", "pgdatabase", "psql", "-U", "root", "-d", "craftless_db", "-c", "\\dt"]);
}

function verifyPsql(baseArgs, env) {
  psqlExecCmd(baseArgs, env, ["-c", "\\dt"]);
}

function runSetupWithDocker(containerName, setupSqlContent, seedSqlContent) {
  console.log("✅ Docker container (" + containerName + ") is running");
  console.log(shouldReset ? "♻️  Applying reset SQL..." : "🧱 Applying schema...");
  if (!dockerExecSql(containerName, setupSqlContent)) return false;

  if (shouldReset) {
    console.log("✅ Database reset successfully!");
    console.log("🔍 Verifying created tables:");
    verifyDocker(containerName);
    return true;
  }

  const counts = getTableCounts((sql) => dockerQuery(containerName, sql));
  if (!counts) return false;
  logCounts(counts);

  const seedDecision = getSeedDecision(counts);
  console.log(seedDecision.reason);
  if (!seedDecision.run) {
    console.log("🔍 Verifying created tables:");
    verifyDocker(containerName);
    return true;
  }

  if (!dockerExecSql(containerName, seedSqlContent)) return false;

  console.log("✅ Schema applied and seed data loaded!");
  console.log("🔍 Verifying created tables:");
  verifyDocker(containerName);
  return true;
}

function runSetupWithCompose(setupSqlContent, seedSqlContent) {
  console.log("✅ Docker container (pgdatabase) is running");
  console.log(shouldReset ? "♻️  Applying reset SQL..." : "🧱 Applying schema...");
  if (!composeExecSql(setupSqlContent)) return false;

  if (shouldReset) {
    console.log("✅ Database reset successfully!");
    console.log("🔍 Verifying created tables:");
    verifyCompose();
    return true;
  }

  const counts = getTableCounts((sql) => composeQuery(sql));
  if (!counts) return false;
  logCounts(counts);

  const seedDecision = getSeedDecision(counts);
  console.log(seedDecision.reason);
  if (!seedDecision.run) {
    console.log("🔍 Verifying created tables:");
    verifyCompose();
    return true;
  }

  if (!composeExecSql(seedSqlContent)) return false;

  console.log("✅ Schema applied and seed data loaded!");
  console.log("🔍 Verifying created tables:");
  verifyCompose();
  return true;
}

function runSetupWithPsql(label, baseArgs, env, setupSqlFile, seedSqlFile) {
  console.log("🔌 Trying " + label + "...");
  console.log(shouldReset ? "♻️  Applying reset SQL..." : "🧱 Applying schema...");
  if (!psqlExecSql(baseArgs, setupSqlFile, env)) return false;

  if (shouldReset) {
    console.log("✅ Database reset successfully!");
    console.log("🔍 Verifying created tables:");
    verifyPsql(baseArgs, env);
    return true;
  }

  const counts = getTableCounts((sql) => psqlQuery(baseArgs, env, sql));
  if (!counts) return false;
  logCounts(counts);

  const seedDecision = getSeedDecision(counts);
  console.log(seedDecision.reason);
  if (!seedDecision.run) {
    console.log("🔍 Verifying created tables:");
    verifyPsql(baseArgs, env);
    return true;
  }

  if (!psqlExecSql(baseArgs, seedSqlFile, env)) return false;

  console.log("✅ Schema applied and seed data loaded!");
  console.log("🔍 Verifying created tables:");
  verifyPsql(baseArgs, env);
  return true;
}

function help() {
  console.log("\n❌ Unable to connect to database\n");
  console.log("Please check:");
  console.log("1. Is Docker Desktop running?");
  console.log("2. Run this command first: npm run docker:db:start");
  console.log("3. To apply schema manually:");
  console.log("   PGPASSWORD=root psql -h localhost -p 15432 -U root -d craftless_db -f database/sql/001_schema.sql");
  console.log("4. To seed an empty database manually:");
  console.log("   PGPASSWORD=root psql -h localhost -p 15432 -U root -d craftless_db -f database/sql/003_seed.sql");
  console.log("5. To reset everything from scratch:");
  console.log("   npm run db:reset");
  console.log("\n6. Or use Adminer (Web UI): http://localhost:8080");
  console.log("   - System: PostgreSQL");
  console.log("   - Server: pgdatabase");
  console.log("   - Username: root");
  console.log("   - Password: root");
  console.log("   - Database: craftless_db");
  process.exit(1);
}

const requiredFiles = shouldReset ? [resetPath] : [schemaPath, seedPath];
for (const filePath of requiredFiles) {
  if (!fs.existsSync(filePath)) {
    console.error("❌ SQL file not found: " + path.relative(scriptDir, filePath));
    process.exit(1);
  }
}

const setupSqlPath = shouldReset ? resetPath : schemaPath;
const setupSqlContent = fs.readFileSync(setupSqlPath, "utf8");
const seedSqlContent = shouldReset ? "" : fs.readFileSync(seedPath, "utf8");

console.log(shouldReset ? "♻️  Resetting database..." : "🔧 Setting up database...");
console.log("📁 Working directory: " + scriptDir);

let names = [];
try {
  const out = execShell("docker ps --format \"{{.Names}}\"", { cwd: root, encoding: "utf8" });
  names = (out && out.toString ? out.toString() : out).trim().split(/\r?\n/).filter(Boolean);
} catch {}

if (names.includes("craftless-db-dev")) {
  if (runSetupWithDocker("craftless-db-dev", setupSqlContent, seedSqlContent)) process.exit(0);
  console.log("⚠️  Docker exec failed, trying alternative method...");
}

const psOut = runComposeQuiet(["ps", "-q", "pgdatabase"], { stdio: ["pipe", "pipe", "pipe"] });
if (psOut !== null && psOut.trim() !== "") {
  const statusOut = runComposeQuiet(["ps", "pgdatabase"]);
  if (statusOut && statusOut.includes("Up")) {
    if (runSetupWithCompose(setupSqlContent, seedSqlContent)) process.exit(0);
    console.log("⚠️  Docker exec failed, trying alternative method...");
  }
}

const dockerEnv = { ...process.env, PGPASSWORD: "root" };
if (runSetupWithPsql("psql (localhost:15432)", ["-h", "localhost", "-p", "15432", "-U", "root", "-d", "craftless_db"], dockerEnv, setupSqlPath, seedPath)) {
  process.exit(0);
}
console.log("⚠️  Connection via localhost:15432 failed, trying alternative method...");

if (runSetupWithPsql("local PostgreSQL (port 5432)", ["-d", "craftless_db"], process.env, setupSqlPath, seedPath)) {
  process.exit(0);
}

help();
