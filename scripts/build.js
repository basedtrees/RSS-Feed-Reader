+const fs = require('fs');
+const path = require('path');
+const { spawnSync } = require('child_process');
+
+const configPath = path.resolve(__dirname, '..', 'osmosfeed.yaml');
+const originalConfig = fs.readFileSync(configPath, 'utf8');
+const skipRemote =
+  process.argv.includes('--skip-remote-cache') ||
+  ["1", "true", "TRUE"].includes(process.env.OSMOSFEED_SKIP_REMOTE_CACHE);
+
+let configTemporarilyModified = false;
+
+function removeCacheUrl(contents) {
+  const lines = contents.split(/\r?\n/);
+  let changed = false;
+  const filtered = lines.filter((line) => {
+    if (line.trim().startsWith('#')) {
+      return true;
+    }
+    if (/^\s*cacheUrl\s*:/.test(line)) {
+      changed = true;
+      return false;
+    }
+    return true;
+  });
+  return {
+    contents: filtered.join('\n') + (contents.endsWith('\n') ? '' : '\n'),
+    changed,
+  };
+}
+
+try {
+  if (skipRemote) {
+    const { contents, changed } = removeCacheUrl(originalConfig);
+    if (changed) {
+      fs.writeFileSync(configPath, contents, 'utf8');
+      configTemporarilyModified = true;
+    }
+  }
+
+  const binName = process.platform === 'win32' ? 'osmosfeed.cmd' : 'osmosfeed';
+  const osmosfeedBin = path.resolve(
+    __dirname,
+    '..',
+    'node_modules',
+    '.bin',
+    binName
+  );
+
+  const args = process.argv.filter((arg) => arg.startsWith('--') && arg !== '--skip-remote-cache');
+  const result = spawnSync(osmosfeedBin, args, { stdio: 'inherit' });
+  if (result.error) {
+    throw result.error;
+  }
+  if (result.status !== 0) {
+    process.exit(result.status);
+  }
+} finally {
+  if (skipRemote && configTemporarilyModified) {
+    fs.writeFileSync(configPath, originalConfig, 'utf8');
+  }
+}
 
EOF
)
