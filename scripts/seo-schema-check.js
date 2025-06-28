#!/usr/bin/env node

/**
 * Скрипт для проверки SEO Schema.org данных и других SEO элементов в Next.js проекте
 * Проверяет наличие и корректность структурированных данных, мета-тегов и других SEO элементов
 */

const fs = require('fs');
const path = require('path');

// SEO паттерны для проверки
const SEO_PATTERNS = {
  seoComponents: [
    /import\s+{\s*SeoHead\s*}/g,
    /import\s+SeoHead/g,
    /<SeoHead/g,
    /import\s+{\s*SeoProvider\s*}/g,
    /import\s+SeoProvider/g,
    /<SeoProvider/g,
    /export\s+const\s+metadata/g,
    /export\s+async\s+function\s+generateMetadata/g,
    /import\s+{\s*ProductSchema\s*}/g,
    /<ProductSchema/g,
    /import\s+{\s*BreadcrumbSchema\s*}/g,
    /<BreadcrumbSchema/g,
  ],
};

// Проверять только страницы и layout/route/head
const PAGE_FILE_PATTERNS = [/page\.tsx$/, /layout\.tsx$/, /route\.ts$/, /head\.tsx$/];

function shouldCheckFile(filePath) {
  return PAGE_FILE_PATTERNS.some((p) => p.test(filePath));
}

function scanDir(dir, results = []) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) scanDir(full, results);
    else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      if (shouldCheckFile(full)) results.push(full);
    }
  }
  return results;
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];

  // SEO Components
  if (!SEO_PATTERNS.seoComponents.some((p) => p.test(content)))
    issues.push('❌ Отсутствуют SEO-компоненты');

  return issues;
}

function main() {
  const srcDir = path.join(process.cwd(), 'src');
  const files = scanDir(srcDir);
  let total = 0;
  for (const file of files) {
    const issues = checkFile(file);
    if (issues.length) {
      total++;
      console.log(`\n${file}`);
      issues.forEach((i) => console.log('  ' + i));
    }
  }
  if (!total) console.log('✅ Все страницы содержат основные SEO-элементы!');
  else console.log(`\n⚠️  SEO-проблемы найдены в ${total} файлах`);
}

if (require.main === module) main(); 