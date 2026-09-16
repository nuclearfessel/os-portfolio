import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { accessSync, constants } from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const configUrl = new URL("../playwright.config.ts", import.meta.url);
const launcherPath = fileURLToPath(new URL("./playwright-webkit.sh", import.meta.url));

// Import the real config in a fresh process: no module-cache or host-env leakage.
// This never invokes Playwright's runner, web server, or browser launch APIs.
function readConfig(overrides) {
  const env = { ...process.env };
  for (const key of ["REPL_ID", "CI", "PLAYWRIGHT_WEBKIT_COMPAT_LAUNCHER"]) {
    delete env[key];
  }
  Object.assign(env, overrides);
  return JSON.parse(execFileSync(process.execPath, [
    "--input-type=module",
    "--eval",
    `import config from ${JSON.stringify(configUrl.href)};
     console.log(JSON.stringify({ use: config.use, projects: config.projects }));`,
  ], {
    env,
    // Catch paths accidentally resolved relative to the caller's working directory.
    cwd: tmpdir(),
    encoding: "utf8",
    timeout: 10_000,
  }));
}

const cases = [
  ["ordinary host uses installed WebKit", {}, false],
  ["Replit automatically uses compatibility launcher", { REPL_ID: "config-test" }, true],
  ["explicit enable works outside Replit", { PLAYWRIGHT_WEBKIT_COMPAT_LAUNCHER: "1" }, true],
  ["explicit enable works in Replit", { REPL_ID: "config-test", PLAYWRIGHT_WEBKIT_COMPAT_LAUNCHER: "1" }, true],
  ["CI defaults to installed WebKit", { CI: "true" }, false],
  ["CI explicit disable uses installed WebKit", { CI: "true", PLAYWRIGHT_WEBKIT_COMPAT_LAUNCHER: "0" }, false],
  ["explicit disable overrides Replit even in CI", { CI: "true", REPL_ID: "config-test", PLAYWRIGHT_WEBKIT_COMPAT_LAUNCHER: "0" }, false],
  ["explicit enable is honored in CI", { CI: "true", PLAYWRIGHT_WEBKIT_COMPAT_LAUNCHER: "1" }, true],
];

for (const [name, env, enabled] of cases) {
  test(name, () => {
    const config = readConfig(env);
    const webkit = config.projects.find((project) => project.name === "webkit-storage-recovery");
    assert.ok(webkit, "WebKit recovery project must exist");
    assert.equal(webkit.use.defaultBrowserType, "webkit");
    assert.equal(config.use?.launchOptions?.executablePath, undefined,
      "Compatibility launcher must not be set globally");
    if (enabled) {
      assert.equal(webkit.use.launchOptions?.executablePath, launcherPath);
      accessSync(launcherPath, constants.X_OK);
    } else {
      assert.equal(webkit.use.launchOptions?.executablePath, undefined,
        "Leave executablePath unset so Playwright selects its installed browser");
    }
    for (const project of config.projects.filter((project) => project !== webkit)) {
      assert.equal(project.use?.launchOptions?.executablePath, undefined,
        `${project.name} must not inherit the WebKit launcher`);
    }
  });
}