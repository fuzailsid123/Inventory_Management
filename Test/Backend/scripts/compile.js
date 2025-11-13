const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const cppDir = path.join(__dirname, '..', 'cpp');
const compiledDir = path.join(__dirname, '..', 'compiled');

// Ensure the compiled directory exists
if (!fs.existsSync(compiledDir)) {
  fs.mkdirSync(compiledDir, { recursive: true });
}

// List of C++ files to compile
const filesToCompile = [
  'register_user.cpp',
  'login_user.cpp',
  'add_product.cpp',
  'get_all_products.cpp',
  'update_product.cpp',
  'delete_product.cpp',
  'add_order.cpp',
  'get_all_orders.cpp',
  'get_low_stock_report.cpp',
  'get_products_sorted.cpp',
  'storage.cpp' // Compile storage.cpp as it contains function definitions
];

filesToCompile.forEach(file => {
  if (file.endsWith('.cpp')) {
    const baseName = file.replace('.cpp', '');
    const sourcePath = path.join(cppDir, file);
    // We need to include storage.cpp in the compilation command for files that use it.
    // A simpler approach for this project is to compile each main file with storage.cpp
    
    // All files except storage.cpp itself need to be linked with storage.obj
    // Simpler approach: compile each main file and link it with storage.cpp
    // This is less efficient than creating .obj files, but simpler for this script.
    
    // We only compile files that have a 'main' function into executables
    if (file === 'storage.cpp') {
      // We don't compile storage.cpp into an executable
      return;
    }

    const outputPath = path.join(compiledDir, `${baseName}.exe`);
    
    // Command: g++ <source.cpp> <storage.cpp> -o <output.exe> -std=c++17
    const compileCommand = `g++ "${sourcePath}" "${path.join(cppDir, 'storage.cpp')}" -o "${outputPath}" -std=c++17 -Wall`;

    console.log(`Compiling ${file}...`);
    exec(compileCommand, (err, stdout, stderr) => {
      if (err) {
        console.error(`Error compiling ${file}:`, err);
        console.error(stderr);
        return;
      }
      if (stderr) {
        console.warn(`Warnings compiling ${file}:`, stderr);
      }
      console.log(`Successfully compiled ${file} to ${outputPath}`);
    });
  }
});