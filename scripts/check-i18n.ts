import * as fs from 'fs';
import * as path from 'path';

function getNestedKeys(obj: Record<string, any>, prefix = ''): string[] {
  let keys: string[] = [];
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(getNestedKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function checkI18n() {
  const enPath = path.join(process.cwd(), 'src/messages/en.json');
  const hiPath = path.join(process.cwd(), 'src/messages/hi.json');

  if (!fs.existsSync(enPath) || !fs.existsSync(hiPath)) {
    console.error('❌ Error: Translation files not found in src/messages/');
    process.exit(1);
  }

  const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  const hi = JSON.parse(fs.readFileSync(hiPath, 'utf8'));

  const enKeys = new Set(getNestedKeys(en));
  const hiKeys = new Set(getNestedKeys(hi));

  const missingInHi = [...enKeys].filter((k) => !hiKeys.has(k));
  const missingInEn = [...hiKeys].filter((k) => !enKeys.has(k));

  let hasErrors = false;

  if (missingInHi.length > 0) {
    console.error(`❌ Missing keys in Hindi (hi.json) (${missingInHi.length}):`);
    missingInHi.forEach((k) => console.error(`  - ${k}`));
    hasErrors = true;
  }

  if (missingInEn.length > 0) {
    console.error(`❌ Missing keys in English (en.json) (${missingInEn.length}):`);
    missingInEn.forEach((k) => console.error(`  - ${k}`));
    hasErrors = true;
  }

  if (hasErrors) {
    console.error('\n🚨 i18n Guardrail Failed: Translation keys must match 1:1 between English and Hindi.');
    process.exit(1);
  } else {
    console.log(`✅ i18n Guardrail Passed: All ${enKeys.size} translation keys match between en.json and hi.json.`);
  }
}

checkI18n();
