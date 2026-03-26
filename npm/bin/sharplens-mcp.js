#!/usr/bin/env node

const { execSync, spawn } = require("child_process");

function hasDotnet() {
  try {
    execSync("dotnet --version", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function isToolInstalled() {
  try {
    const output = execSync("dotnet tool list --global", { encoding: "utf8" });
    return output.toLowerCase().includes("sharplensmcp");
  } catch {
    return false;
  }
}

if (!hasDotnet()) {
  process.stderr.write(
    "Error: .NET SDK not found. SharpLensMcp requires .NET 8.0 SDK or later.\n"
  );
  process.exit(1);
}

if (!isToolInstalled()) {
  process.stderr.write("Installing SharpLensMcp .NET tool...\n");
  try {
    execSync("dotnet tool install --global SharpLensMcp", {
      stdio: "inherit",
    });
  } catch {
    process.stderr.write("Error: Failed to install SharpLensMcp.\n");
    process.exit(1);
  }
}

const args = process.argv.slice(2);
const child = spawn("sharplens", args, {
  stdio: "inherit",
  shell: true,
});

child.on("exit", (code) => process.exit(code ?? 0));
child.on("error", (err) => {
  process.stderr.write(`Error: Failed to start sharplens: ${err.message}\n`);
  process.exit(1);
});
