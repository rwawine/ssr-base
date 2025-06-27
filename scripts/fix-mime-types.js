#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Проверка MIME-типов статических файлов...');

// Проверяем наличие папки .next
const nextDir = path.join(process.cwd(), '.next');
if (!fs.existsSync(nextDir)) {
  console.error('❌ Папка .next не найдена. Сначала выполните npm run build');
  process.exit(1);
}

// Проверяем статические файлы
const staticDir = path.join(nextDir, 'static');
if (!fs.existsSync(staticDir)) {
  console.error('❌ Папка .next/static не найдена');
  process.exit(1);
}

console.log('✅ Папка .next/static найдена');

// Проверяем структуру статических файлов
const checkStaticFiles = (dir) => {
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      checkStaticFiles(fullPath);
    } else {
      const ext = path.extname(item);
      const relativePath = path.relative(process.cwd(), fullPath);
      
      // Проверяем правильность расширений
      if (ext === '.js' || ext === '.css' || ext === '.map') {
        console.log(`✅ ${relativePath}`);
      } else {
        console.log(`⚠️  Неожиданный файл: ${relativePath}`);
      }
    }
  });
};

checkStaticFiles(staticDir);

console.log('\n📋 Рекомендации для исправления проблем с MIME-типами:');
console.log('\n1. Убедитесь, что веб-сервер правильно настроен:');
console.log('   - Для nginx используйте конфигурацию из nginx.conf');
console.log('   - Для Apache добавьте правильные MIME-типы в .htaccess');
console.log('\n2. Проверьте, что Next.js приложение запущено на правильном порту');
console.log('\n3. Убедитесь, что статические файлы доступны по правильным путям');
console.log('\n4. Пересоберите проект: npm run build');

// Проверяем package.json скрипты
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
console.log('\n📦 Доступные скрипты сборки:');
Object.keys(packageJson.scripts).forEach(script => {
  console.log(`   npm run ${script}`);
});

console.log('\n🚀 Для пересборки выполните:');
console.log('   npm run build');
console.log('   npm start'); 