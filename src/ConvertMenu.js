import fs from 'fs';

const inputFile = './data/menuData.js';      // your current file
const outputFile = './data/menu.compact.js';

let code = fs.readFileSync(inputFile, 'utf8');

// 1️⃣ Convert image imports → img("file-name")
code = code.replace(
  /import\s+(\w+)\s+from\s+['"]..\/assets\/itemImages\/(.+?)\.webp['"];?/g,
  (_, varName, file) => `const ${varName} = img("${file}");`
);

// 2️⃣ Remove remaining import lines
code = code.replace(/^import .*?;\n/gm, '');

// 3️⃣ Collapse objects inside arrays to single line
code = code.replace(
  /\{\s*([^{}]+?)\s*\}/gs,
  (match, content) => {
    const clean = content
      .replace(/\s*\n\s*/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim();
    return `{ ${clean} }`;
  }
);

// 4️⃣ Clean trailing spaces
code = code.replace(/[ \t]+$/gm, '');

fs.writeFileSync(outputFile, code);

console.log('✅ Menu auto-converted to compact format');
