const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function updateWslIp() {
  if (process.platform !== 'win32') {
    console.log('[WSL IP Sync] Not on Windows, skipping IP sync.');
    return;
  }

  console.log('[WSL IP Sync] Detecting WSL IP address...');
  let wslIp;
  try {
    wslIp = execSync('wsl hostname -I', { encoding: 'utf8' }).trim().split(' ')[0];
  } catch (err) {
    console.warn('[WSL IP Sync] Failed to get WSL IP address (is WSL running?):', err.message);
    return;
  }

  if (!wslIp) {
    console.warn('[WSL IP Sync] WSL IP address is empty.');
    return;
  }

  console.log(`[WSL IP Sync] Current WSL IP: ${wslIp}`);

  const envFiles = [
    path.join(__dirname, '../.env'),
    path.join(__dirname, '../apps/server/.env'),
    path.join(__dirname, '../apps/web/.env')
  ];

  envFiles.forEach((file) => {
    if (!fs.existsSync(file)) {
      return;
    }

    try {
      let content = fs.readFileSync(file, 'utf8');
      let modified = false;

      // Regular expression to find DATABASE_URL and REDIS_URL and replace their host IP
      // Matches host part after '@' for postgres, and after '//' for redis
      const dbUrlRegex = /(DATABASE_URL\s*=\s*["']?postgresql:\/\/[^:]+:[^@]+@)([^:]+)(:\d+\/[^"']*)["']?/;
      const redisUrlRegex = /(REDIS_URL\s*=\s*["']?redis:\/\/)([^:]+)(:\d+[^"']*)["']?/;

      const dbMatch = content.match(dbUrlRegex);
      if (dbMatch && dbMatch[2] !== wslIp) {
        content = content.replace(dbUrlRegex, `$1${wslIp}$3`);
        modified = true;
        console.log(`[WSL IP Sync] Updating database host in ${path.basename(file)}: ${dbMatch[2]} -> ${wslIp}`);
      }

      const redisMatch = content.match(redisUrlRegex);
      if (redisMatch && redisMatch[2] !== wslIp) {
        content = content.replace(redisUrlRegex, `$1${wslIp}$3`);
        modified = true;
        console.log(`[WSL IP Sync] Updating redis host in ${path.basename(file)}: ${redisMatch[2]} -> ${wslIp}`);
      }

      if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`[WSL IP Sync] Successfully updated ${path.basename(file)}`);
      } else {
        console.log(`[WSL IP Sync] ${path.basename(file)} is already up to date.`);
      }
    } catch (err) {
      console.error(`[WSL IP Sync] Failed to update ${file}:`, err.message);
    }
  });
}

updateWslIp();
