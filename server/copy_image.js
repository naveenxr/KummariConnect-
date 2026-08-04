import fs from 'fs';
import path from 'path';

const src = "C:\\Users\\n8467\\.gemini\\antigravity-ide\\brain\\0ee156df-21da-4399-ab35-226ace8df64f\\media__1785691621576.png";
const destDir = "e:\\KummariConnect\\public";
const dest = path.join(destDir, "thiruvalluvar_statue.png");

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.copyFileSync(src, dest);
console.log("✅ Copied image to " + dest);
