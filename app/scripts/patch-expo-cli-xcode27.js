#!/usr/bin/env node
/**
 * Xcode 27 replaced Simulator.app with DeviceHub.app. Expo CLI already knows
 * about DeviceHub, but isSimulatorAppRunningAsync only inspects error.message
 * for "Application isn't running". @expo/spawn-async puts that text in stderr,
 * so activateWindowAsync throws after a successful build/install.
 *
 * Remove this script once upstream Expo CLI checks stderr (or drops the System
 * Events process probe).
 */
const fs = require('fs');
const path = require('path');

const root = path.join(
  __dirname,
  '..',
  'node_modules',
  'expo',
  'node_modules',
  '@expo',
  'cli',
  'build',
  'src',
  'start',
  'platforms',
  'ios'
);

const ensurePath = path.join(root, 'ensureSimulatorAppRunning.js');
const managerPath = path.join(root, 'AppleDeviceManager.js');

function patchEnsure(filePath) {
  if (!fs.existsSync(filePath)) return false;
  let src = fs.readFileSync(filePath, 'utf8');
  if (src.includes('spawnAsync puts the AppleScript text in stderr')) return false;

  const from = `    } catch (error) {
        if (error.message.includes('Application isn’t running')) {
            return false;
        }
        throw error;
    }`;

  const to = `    } catch (error) {
        // spawnAsync puts the AppleScript text in stderr, not message. Also treat
        // System Events itself being stopped (-600) as "not running".
        const details = \`\${error?.message ?? ''}\\n\${error?.stderr ?? ''}\`;
        if (/Application isn[’']t running/i.test(details)) {
            return false;
        }
        throw error;
    }`;

  if (!src.includes(from)) {
    console.warn('[patch-expo-cli-xcode27] ensureSimulatorAppRunning.js pattern not found; skip');
    return false;
  }
  fs.writeFileSync(filePath, src.replace(from, to));
  return true;
}

function patchManager(filePath) {
  if (!fs.existsSync(filePath)) return false;
  let src = fs.readFileSync(filePath, 'utf8');
  if (src.includes('should not block launching the app')) return false;

  const from = `    async activateWindowAsync() {
        await (0, _ensureSimulatorAppRunning.ensureSimulatorAppRunningAsync)(this.device);
        // If we're in interactive mode, we can attempt to focus the Simulator app.
        // In non-interactive mode, we should assume this is an agent and not attempt to focus the Simulator app since it doesn't need focus.
        if ((0, _interactive.isInteractive)()) {
            // TODO: Focus the individual window
            await (0, _osascript().spawnAsync)([
                \`if application "Simulator" is running then\`,
                \`tell application "Simulator" to activate\`,
                \`else if application "DeviceHub" is running then\`,
                \`tell application "DeviceHub" to activate\`,
                \`end if\`
            ]);
        }
    }`;

  const to = `    async activateWindowAsync() {
        try {
            await (0, _ensureSimulatorAppRunning.ensureSimulatorAppRunningAsync)(this.device);
            // If we're in interactive mode, we can attempt to focus the Simulator app.
            // In non-interactive mode, we should assume this is an agent and not attempt to focus the Simulator app since it doesn't need focus.
            if ((0, _interactive.isInteractive)()) {
                // TODO: Focus the individual window
                await (0, _osascript().spawnAsync)([
                    \`if application "Simulator" is running then\`,
                    \`tell application "Simulator" to activate\`,
                    \`else if application "DeviceHub" is running then\`,
                    \`tell application "DeviceHub" to activate\`,
                    \`end if\`
                ]);
            }
        } catch  {
            // Xcode 27 / DeviceHub + System Events flakiness should not block launching the app.
        }
    }`;

  if (!src.includes(from)) {
    console.warn('[patch-expo-cli-xcode27] AppleDeviceManager.js pattern not found; skip');
    return false;
  }
  fs.writeFileSync(filePath, src.replace(from, to));
  return true;
}

const a = patchEnsure(ensurePath);
const b = patchManager(managerPath);
if (a || b) {
  console.log('[patch-expo-cli-xcode27] Applied Xcode 27 DeviceHub launch fix');
}
