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
      `${scriptName}.exe` // Assumes Windows executable, adjust for Linux/macOS if needed
    );

    console.log(`Running: ${scriptPath} with args: [${args.join(', ')}]`);

    // Spawn the child process
    const cppProcess = spawn(scriptPath, args);

    let stdoutData = '';
    let stderrData = '';

    // Listen for data from stdout
    cppProcess.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });

    // Listen for data from stderr
    cppProcess.stderr.on('data', (data) => {
      stderrData += data.toString();
    });

    // Handle process exit
    cppProcess.on('close', (code) => {
      if (stderrData) {
        console.error(`stderr [${scriptName}]: ${stderrData}`);
        // Often, C++ apps might print errors to stderr but still exit 0
        // We reject if there's any stderr data, as it usually indicates a problem.
        return reject(new Error(stderrData));
      }
      if (code !== 0) {
        console.error(`Process [${scriptName}] exited with code ${code}`);
        return reject(new Error(`Process exited with code ${code}`));
      }
      
      // Resolve with the complete stdout data
      resolve(stdoutData.trim());
    });

    // Handle errors in spawning the process
    cppProcess.on('error', (err) => {
      console.error(`Failed to start subprocess [${scriptName}].`, err);
      reject(new Error(`Failed to start subprocess: ${err.message}`));
    });
  });
}

module.exports = { runCpp };