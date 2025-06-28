#!/usr/bin/env node

/**
 * Скрипт для проверки потенциальных проблем гидратации в Next.js проекте
 * Проверяет компоненты на наличие проблемных паттернов
 */

const fs = require('fs');
const path = require('path');

// Паттерны, которые могут вызывать проблемы гидратации
const HYDRATION_PATTERNS = {
  // Динамические значения
  dynamicValues: [
    /Date\.now\(\)/g,
    /Math\.random\(\)/g,
    /new Date\(\)/g,
    /performance\.now\(\)/g,
  ],
  
  // Условный рендеринг без suppressHydrationWarning
  conditionalRendering: [
    /\{.*\?.*:.*\}/g,
    /\{.*&&.*\}/g,
  ],
  
  // Использование window/localStorage без проверки
  browserAPIs: [
    /window\./g,
    /localStorage\./g,
    /sessionStorage\./g,
    /document\./g,
  ],
  
  // Динамические стили
  dynamicStyles: [
    /style=\{\{.*\}\}/g,
    /className=\{.*\+.*\}/g,
  ],
  
  // Next.js Image проблемы
  nextImageIssues: [
    /loading=\{.*\?.*:.*\}/g,
    /sizes=\{.*\?.*:.*\}/g,
  ]
};

// Файлы для исключения
const EXCLUDE_PATTERNS = [
  /node_modules/,
  /\.git/,
  /\.next/,
  /dist/,
  /build/,
  /\.d\.ts$/,
  /\.test\./,
  /\.spec\./,
];

// Компоненты, которые уже исправлены
const FIXED_COMPONENTS = [
  'OptimizedImage.tsx',
  'ProductCard.tsx',
  'Header.tsx',
  'PopularProductSliderSSR.tsx',
  'SliderSlide.tsx',
];

function shouldExcludeFile(filePath) {
  return EXCLUDE_PATTERNS.some(pattern => pattern.test(filePath));
}

function isFixedComponent(fileName) {
  return FIXED_COMPONENTS.includes(fileName);
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  
  Object.entries(HYDRATION_PATTERNS).forEach(([category, patterns]) => {
    patterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        issues.push({
          category,
          pattern: pattern.source,
          matches: matches.length,
          lines: matches.map(match => {
            const lines = content.split('\n');
            return lines.findIndex(line => line.includes(match)) + 1;
          }).filter(line => line > 0)
        });
      }
    });
  });
  
  return issues;
}

function scanDirectory(dir, results = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (!shouldExcludeFile(fullPath)) {
        scanDirectory(fullPath, results);
      }
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      if (!shouldExcludeFile(fullPath) && !isFixedComponent(item)) {
        const issues = checkFile(fullPath);
        if (issues.length > 0) {
          results.push({
            file: fullPath,
            issues
          });
        }
      }
    }
  }
  
  return results;
}

function generateReport(results) {
  console.log('🔍 Проверка проблем гидратации в Next.js проекте\n');
  
  if (results.length === 0) {
    console.log('✅ Проблем гидратации не найдено!');
    return;
  }
  
  console.log(`⚠️  Найдено ${results.length} файлов с потенциальными проблемами:\n`);
  
  results.forEach(({ file, issues }) => {
    console.log(`📁 ${file}`);
    
    issues.forEach(issue => {
      console.log(`  ${getCategoryIcon(issue.category)} ${issue.category}: ${issue.matches} совпадений`);
      if (issue.lines.length > 0) {
        console.log(`    Строки: ${issue.lines.join(', ')}`);
      }
    });
    
    console.log('');
  });
  
  console.log('💡 Рекомендации:');
  console.log('1. Добавьте suppressHydrationWarning для условного рендеринга');
  console.log('2. Используйте isHydrated для проверки перед доступом к window/localStorage');
  console.log('3. Избегайте динамических значений в рендере');
  console.log('4. Стабилизируйте атрибуты Next.js Image компонентов');
}

function getCategoryIcon(category) {
  const icons = {
    dynamicValues: '⏰',
    conditionalRendering: '🔄',
    browserAPIs: '🌐',
    dynamicStyles: '🎨',
    nextImageIssues: '🖼️'
  };
  return icons[category] || '❓';
}

// Основная функция
function main() {
  const srcDir = path.join(process.cwd(), 'src');
  
  if (!fs.existsSync(srcDir)) {
    console.error('❌ Директория src не найдена');
    process.exit(1);
  }
  
  console.log('🔍 Сканирование файлов...\n');
  
  const results = scanDirectory(srcDir);
  generateReport(results);
  
  if (results.length > 0) {
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { checkFile, scanDirectory, generateReport }; 