# Pre-Build Refactoring Script

Этот скрипт автоматически проверяет и исправляет распространенные проблемы в коде перед сборкой проекта.

## 🚀 Использование

### Автоматический запуск перед build
```bash
npm run build
```
Скрипт автоматически запустится перед сборкой и проверит все файлы.

### Ручной запуск
```bash
# Полный рефакторинг с исправлениями
npm run refactor

# Только проверка без исправлений
npm run refactor:check

# Build без рефакторинга
npm run build:no-refactor
```

## 🔧 Что делает скрипт

### 1. Валидация структуры проекта
- Проверяет наличие обязательных директорий (`src/app`, `src/components`, `src/hooks`, `src/types`, `src/lib`, `src/utils`)
- Валидирует структуру файлов

### 2. Проверка зависимостей
- Проверяет наличие обязательных зависимостей в `package.json`
- Валидирует версии React, Next.js, TypeScript

### 3. Исправление импортов ProductCard
- Автоматически исправляет неправильные импорты `ProductCard`
- Меняет `import ProductCard from '@/components/productCard/ProductCard'` на `import { ProductCard } from '@/components/productCard/ProductCard'`

### 4. Исправление общих проблем
- Добавляет недостающие импорты React
- Исправляет потенциальные ошибки доступа к `undefined` свойствам
- Добавляет fallback значения для `cart.totalPrice`

### 5. Проверка проблем гидратации
- Ищет компоненты с потенциальными проблемами гидратации
- Проверяет наличие проверок `isHydrated` для cart/favorites состояния
- Предупреждает о возможных несоответствиях SSR/CSR

### 6. Форматирование кода
- Запускает Prettier для форматирования всех файлов
- Обеспечивает единообразный стиль кода

### 7. Проверка TypeScript
- Запускает `tsc --noEmit` для проверки типов
- Показывает все ошибки TypeScript

### 8. Проверка ESLint
- Запускает ESLint для всех файлов
- Проверяет соответствие правилам линтера

## 📊 Результаты

Скрипт выводит подробный отчет о:
- ✅ Успешно исправленных проблемах
- ⚠️ Найденных предупреждениях
- ❌ Критических ошибках
- 📊 Общем количестве проблем

## 🎯 Примеры исправлений

### Импорты ProductCard
```typescript
// ❌ До
import ProductCard from '@/components/productCard/ProductCard';

// ✅ После
import { ProductCard } from '@/components/productCard/ProductCard';
```

### Проверки гидратации
```typescript
// ❌ Потенциальная проблема
const cartQuantity = getItemQuantity(product.id);

// ✅ Безопасная проверка
const cartQuantity = isHydrated ? getItemQuantity(product.id) : 0;
```

### Fallback значения
```typescript
// ❌ Потенциальная ошибка
const total = cart.totalPrice * discount;

// ✅ Безопасный доступ
const total = (cart.totalPrice || 0) * discount;
```

## 🔍 Настройка

Скрипт можно настроить, изменив конфигурацию в начале файла:

```javascript
const config = {
  srcDir: 'src',
  componentsDir: 'src/components',
  pagesDir: 'src/app',
  extensions: ['.tsx', '.ts', '.jsx', '.js'],
  excludeDirs: ['node_modules', '.next', 'dist', 'build', '.git'],
  // ...
};
```

## 🚨 Коды выхода

- `0` - Все проверки пройдены успешно
- `1` - Найдены проблемы, требующие внимания

## 💡 Рекомендации

1. **Запускайте перед каждым build** - это предотвратит проблемы в продакшене
2. **Используйте в CI/CD** - добавьте в pipeline для автоматической проверки
3. **Регулярно обновляйте** - добавляйте новые проверки по мере развития проекта
4. **Настройте IDE** - используйте ESLint и Prettier в редакторе для раннего обнаружения проблем

## 🛠️ Расширение функциональности

Для добавления новых проверок:

1. Создайте новую функцию проверки
2. Добавьте её вызов в `runRefactoring()`
3. Обновите документацию

Пример:
```javascript
function checkNewIssue() {
  // Ваша логика проверки
  return issuesFound;
}

// В runRefactoring()
totalIssues += checkNewIssue();
``` 