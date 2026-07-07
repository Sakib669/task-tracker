const fs = require('fs');
const p = './dist/generated/prisma/client.js';
if (fs.existsSync(p)) {
  const content = fs.readFileSync(p, 'utf8');
  const patched = content.replace(/import\.meta\.url/g, "('file://' + __filename.replace(/\\\\/g, '/'))");
  fs.writeFileSync(p, patched);
  console.log('Patched prisma client successfully');
}
