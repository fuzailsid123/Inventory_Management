const { spawn } = require('child_process');
const path = require('path');

/**
 * Executes a pre-compiled C++ script.
 * @param {string} scriptName - The name of the executable (e.g., 'add_product').
 * @param {string[]} [args=[]] - An array of string arguments to pass to the executable.
 * @returns {Promise<string>} A promise that resolves with the stdout data.
 */
function runCpp(scriptName, args = []) {
  return new Promise((resolve, reject) => {
    // Construct the path to the executable
    const scriptPath = path.join(
      __dirname,
      '..',
      '..',
      'compiled',
      `${scriptName}.exe`
    );

    console.log(`Running: ${scriptPath} with args: [${args.join(', ')}]`);

    const scriptDir = path.dirname(scriptPath);
    const cppProcess = spawn(scriptPath, args, { cwd: scriptDir });

    let stdoutData = '';
    let stderrData = '';

    cppProcess.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });

    cppProcess.stderr.on('data', (data) => {
      stderrData += data.toString();
    });

    cppProcess.on('close', (code) => {
      if (stderrData) {
        console.error(`stderr [${scriptName}]: ${stderrData}`);
        return reject(new Error(stderrData));
      }
      if (code !== 0) {
        console.error(`Process [${scriptName}] exited with code ${code}`);
        return reject(new Error(`Process exited with code ${code}`));
      }
      
      resolve(stdoutData.trim());
    });

    cppProcess.on('error', (err) => {
      console.error(`Failed to start subprocess [${scriptName}].`, err);
      reject(new Error(`Failed to start subprocess: ${err.message}`));
    });
  });
}

module.exports = { runCpp };