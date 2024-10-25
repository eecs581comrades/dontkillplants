// platform-setup.js
const { exec } = require("child_process");
const os = require("os");

const isMac = os.platform() === "darwin";
const isWindows = os.platform() === "win32";

if (isMac) {
  exec("npm run setup:mac", (error, stdout, stderr) => {
    if (error) {
      console.error(`Mac setup error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Mac setup stderr: ${stderr}`);
      return;
    }
    console.log(`Mac setup stdout: ${stdout}`);
  });
} else if (isWindows) {
  exec("npm run setup:win", (error, stdout, stderr) => {
    if (error) {
      console.error(`Windows setup error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Windows setup stderr: ${stderr}`);
      return;
    }
    console.log(`Windows setup stdout: ${stdout}`);
  });
} else {
  console.log("Unsupported platform. Please run the setup manually.");
}
