const fs = require('fs');
const path = require('path');

// Конфигурация ключевых слов по категориям
const categoryKeywords = {
  'sofa': [
    'диван', 'мягкая мебель', 'диван для гостиной', 'угловой диван', 'прямой диван',
    'диван-кровать', 'раскладной диван', 'еврокнижка', 'аккордеон', 'клик-кляк',
    'мебель для гостиной', 'комфортная мебель', 'стильный диван'
  ],
  'bed': [
    'кровать', 'кровать для спальни', 'ортопедическая кровать', 'подъемная кровать',
    'кровать с ящиками', 'кровать-трансформер', 'мебель для спальни', 'спальный гарнитур',
    'кровать односпальная', 'кровать двуспальная', 'кровать полутороспальная'
  ],
  'armchair': [
    'кресло', 'кресло для гостиной', 'кресло-кровать', 'кресло качалка', 'кресло мешок',
    'комфортное кресло', 'стильное кресло', 'мягкое кресло', 'кресло для отдыха'
  ],
  'table': [
    'стол', 'обеденный стол', 'журнальный стол', 'стол для гостиной', 'стол трансформер',
    'стол-книжка', 'стол для кухни', 'стол для столовой', 'деревянный стол'
  ]
};

// Конфигурация ключевых слов по стилям
const styleKeywords = {
  'Современный': ['современная мебель', 'современный дизайн', 'модерн', 'минимализм'],
  'Классический': ['классическая мебель', 'классический стиль', 'традиционная мебель'],
  'Лофт': ['лофт мебель', 'индустриальный стиль', 'стиль лофт'],
  'Скандинавский': ['скандинавская мебель', 'скандинавский стиль', 'минимализм']
};

// Конфигурация ключевых слов по материалам
const materialKeywords = {
  'Ткань': ['тканевая обивка', 'обивка тканью', 'ткань для мебели'],
  'Кожа': ['кожаная мебель', 'натуральная кожа', 'кожаная обивка'],
  'Экокожа': ['экокожа', 'искусственная кожа', 'экологичная кожа'],
  'Велюр': ['велюр', 'велюровая обивка', 'мягкий велюр'],
  'Микрофибра': ['микрофибра', 'микрофибровая обивка', 'износостойкая ткань']
};

// Локальные ключевые слова
const localKeywords = [
  'Минск', 'Беларусь', 'РБ', 'Белоруссия', 'мебель Минск', 'купить мебель Минск',
  'доставка по Беларуси', 'мебельный магазин Минск', 'производство мебели Беларусь'
];

// Функция для генерации уникального заголовка
function generateProductTitle(product) {
  const { name, category, subcategory, style, price } = product;
  
  // Базовый заголовок
  let title = name;
  
  // Добавляем категорию если её нет в названии
  if (category && !name.toLowerCase().includes(category.name.toLowerCase())) {
    title = `${category.name} ${name}`;
  }
  
  // Добавляем стиль если есть
  if (style && style !== 'Современный') {
    title = `${title} в стиле ${style}`;
  }
  
  // Добавляем ценовую категорию
  if (price.current < 2000) {
    title = `${title} - недорого`;
  } else if (price.current > 5000) {
    title = `${title} - премиум`;
  }
  
  // Добавляем бренд и локацию
  title = `${title} | Dilavia - мебель в Минске`;
  
  return title;
}

// Функция для генерации описания
function generateProductDescription(product) {
  const { name, description, category, price, materials, features, delivery } = product;
  
  let desc = `Купить ${name.toLowerCase()} в интернет-магазине Dilavia. `;
  
  // Добавляем ключевые характеристики
  if (materials && materials.length > 0) {
    const mainMaterial = materials.find(m => m.name === 'Ткань' || m.name === 'Обивка');
    if (mainMaterial) {
      desc += `Качественная обивка: ${mainMaterial.type}. `;
    }
  }
  
  // Добавляем особенности
  if (features && features.length > 0) {
    const mainFeature = features[0];
    desc += `${mainFeature}. `;
  }
  
  // Добавляем цену
  desc += `Цена от ${price.current} BYN. `;
  
  // Добавляем доставку
  if (delivery?.available) {
    desc += `Бесплатная доставка по Беларуси. `;
  }
  
  // Добавляем призыв к действию
  desc += `Заказывайте онлайн с гарантией качества!`;
  
  return desc;
}

// Функция для генерации ключевых слов
function generateProductKeywords(product) {
  const { name, category, subcategory, style, materials, features } = product;
  const keywords = new Set();
  
  // Добавляем название товара
  keywords.add(name.toLowerCase());
  
  // Добавляем категорийные ключевые слова
  if (category?.code && categoryKeywords[category.code]) {
    categoryKeywords[category.code].forEach(keyword => keywords.add(keyword));
  }
  
  // Добавляем подкатегорийные ключевые слова
  if (subcategory?.name) {
    keywords.add(subcategory.name.toLowerCase());
    keywords.add(`купить ${subcategory.name.toLowerCase()}`);
  }
  
  // Добавляем стилевые ключевые слова
  if (style && styleKeywords[style]) {
    styleKeywords[style].forEach(keyword => keywords.add(keyword));
  }
  
  // Добавляем ключевые слова по материалам
  if (materials) {
    materials.forEach(material => {
      if (materialKeywords[material.name]) {
        materialKeywords[material.name].forEach(keyword => keywords.add(keyword));
      }
    });
  }
  
  // Добавляем ключевые слова по особенностям
  if (features) {
    features.forEach(feature => {
      const featureKeywords = feature.toLowerCase().split(' ');
      featureKeywords.forEach(keyword => {
        if (keyword.length > 3) keywords.add(keyword);
      });
    });
  }
  
  // Добавляем локальные ключевые слова
  localKeywords.forEach(keyword => keywords.add(keyword));
  
  // Добавляем общие ключевые слова
  keywords.add('купить мебель');
  keywords.add('интернет-магазин мебели');
  keywords.add('мебель с доставкой');
  keywords.add('качественная мебель');
  
  return Array.from(keywords).slice(0, 20); // Ограничиваем количество ключевых слов
}

// Функция для оптимизации SEO данных товара
function optimizeProductSEO(product) {
  const optimizedProduct = { ...product };
  
  // Генерируем новые SEO данные
  optimizedProduct.seo = {
    title: generateProductTitle(product),
    metaDescription: generateProductDescription(product),
    keywords: generateProductKeywords(product)
  };
  
  return optimizedProduct;
}

// Основная функция для обработки файла
function optimizeSEOData(filePath) {
  console.log(`Обрабатываю файл: ${filePath}`);
  
  try {
    // Читаем файл
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Обрабатываем каждый товар
    if (data[0] && data[0].products) {
      data[0].products = data[0].products.map(product => optimizeProductSEO(product));
      console.log(`Обработано товаров: ${data[0].products.length}`);
    }
    
    // Создаем резервную копию
    const backupPath = filePath.replace('.json', '.backup.json');
    if (!fs.existsSync(backupPath)) {
      fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));
      console.log(`Создана резервная копия: ${backupPath}`);
    }
    
    // Записываем обновленные данные
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Файл обновлен: ${filePath}`);
    
  } catch (error) {
    console.error(`Ошибка при обработке файла ${filePath}:`, error.message);
  }
}

// Обрабатываем файлы данных
const dataFiles = [
  path.join(__dirname, '../src/data/data.json'),
  path.join(__dirname, '../src/data/migrations.json')
];

dataFiles.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    optimizeSEOData(filePath);
  } else {
    console.log(`Файл не найден: ${filePath}`);
  }
});

console.log('Оптимизация SEO данных завершена!'); 