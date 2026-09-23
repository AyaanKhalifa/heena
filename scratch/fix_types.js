const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../client/src');

function traverse(currentDir) {
  const files = fs.readdirSync(currentDir);
  for (const file of files) {
    const fullPath = path.join(currentDir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Fix unused imports
      if (fullPath.includes('AdminDashboard.tsx')) {
        content = content.replace("import { motion } from 'framer-motion';\n", "");
      }
      if (fullPath.includes('Contact.tsx')) {
        content = content.replace("FaMapMarkerAlt, FaEnvelope }", "FaMapMarkerAlt }");
      }

      // Fix framer-motion TS errors by explicitly typing them as any
      content = content.replace(/const pageTransition = \{/g, 'const pageTransition: any = {');
      content = content.replace(/const pageVariants = \{/g, 'const pageVariants: any = {');
      content = content.replace(/const itemVariants = \{/g, 'const itemVariants: any = {');
      content = content.replace(/const cardVariants = \{/g, 'const cardVariants: any = {');
      content = content.replace(/const counterVariants = \{/g, 'const counterVariants: any = {');
      content = content.replace(/const draw = \{/g, 'const draw: any = {');

      fs.writeFileSync(fullPath, content);
    }
  }
}

traverse(dir);
console.log('Fixed types!');
