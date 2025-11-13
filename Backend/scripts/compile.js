const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const cppDir = path.join(__dirname, '..', 'cpp');
const compiledDir = path.join(__dirname, '..', 'compiled');

if (!fs.existsSync(compiledDir)) {
  fs.mkdirSync(compiledDir, { recursive: true });
}

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
  'storage.cpp'
];

filesToCompile.forEach(file => {
  if (file.endsWith('.cpp')) {
    const baseName = file.replace('.cpp', '');
    const sourcePath = path.join(cppDir, file);
    if (file === 'storage.cpp') {
      return;
    }

    const outputPath = path.join(compiledDir, `${baseName}.exe`);
    
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