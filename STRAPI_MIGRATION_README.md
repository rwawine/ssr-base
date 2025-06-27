# Миграция товаров в Strapi

Этот документ описывает, как импортировать товары из JSON файла в Strapi CMS.

## Предварительные требования

1. Установленный Strapi проект
2. Доступ к базе данных
3. JSON файл с данными товаров (`src/data/migrations.json`)

## Шаги для настройки

### 1. Создание контент-типов

Создайте следующие контент-типы в вашем Strapi проекте:

#### Category (Категория)
- `code` (string, required, unique)
- `name` (string, required)
- `slug` (uid, targetField: name)
- `description` (text)
- `image` (media, single image)

#### Subcategory (Подкатегория)
- `code` (string, required, unique)
- `name` (string, required)
- `slug` (uid, targetField: name)
- `description` (text)
- `image` (media, single image)
- `category` (relation: manyToOne -> Category)

#### Product (Товар)
- `strapi_id` (string, unique) - оригинальный ID из JSON
- `name` (string, required)
- `slug` (uid, targetField: name, required)
- `description` (richtext)
- `price` (decimal, required)
- `old_price` (decimal)
- `discount` (decimal)
- `availability` (string)
- `manufacturing` (string)
- `popularity` (decimal, default: 0)
- `style` (string)
- `color` (string)
- `max_load` (integer)
- `country` (string)
- `warranty` (string)
- `commercial_offer` (text)
- `features` (json)
- `installment_plans` (json)
- `seo_title` (string)
- `seo_description` (text)
- `seo_keywords` (json)
- `delivery_available` (boolean, default: false)
- `delivery_cost` (string)
- `delivery_time` (string)
- `promotion_type` (string)
- `promotion_text` (text)
- `promotion_valid_until` (datetime)
- `sleeping_width` (integer)
- `sleeping_length` (integer)
- `category` (relation: manyToOne -> Category)
- `subcategory` (relation: manyToOne -> Subcategory)

#### Product Material (Материал товара)
- `name` (string, required)
- `type` (string)
- `color` (string)
- `product` (relation: manyToOne -> Product)

#### Product Dimension (Размеры товара)
- `width` (integer)
- `length` (integer)
- `height` (integer)
- `depth` (integer)
- `price` (decimal)
- `additional_options` (json)
- `product` (relation: manyToOne -> Product)

#### Product Image (Изображение товара)
- `url` (string, required)
- `alt` (string)
- `sort_order` (integer, default: 0)
- `product` (relation: manyToOne -> Product)

### 2. Настройка миграции

1. Скопируйте файл `strapi-migration-example.js` в папку `database/migrations/` вашего Strapi проекта
2. Переименуйте файл в формат: `YYYYMMDDHHMMSS-import-products.js` (например: `20241201120000-import-products.js`)
3. Скопируйте ваш JSON файл в корень Strapi проекта или обновите путь в миграции

### 3. Запуск миграции

```bash
# Перейдите в папку Strapi проекта
cd your-strapi-project

# Запустите миграцию
npm run strapi migration:run
```

### 4. Проверка результатов

После выполнения миграции проверьте:

1. **Категории**: Откройте Content Manager -> Category
2. **Подкатегории**: Откройте Content Manager -> Subcategory  
3. **Товары**: Откройте Content Manager -> Product
4. **Связанные данные**: Проверьте, что связи между таблицами работают корректно

## Структура данных

Миграция обрабатывает следующие данные из JSON:

### Основные поля товара
- Базовая информация (название, описание, цена)
- SEO данные (title, description, keywords)
- Доставка и гарантия
- Промо-акции и рассрочка
- Спальное место (для диванов)

### Связанные данные
- **Материалы**: Массив материалов с названием, типом и цветом
- **Размеры**: Варианты размеров с ценами
- **Изображения**: Массив URL изображений с порядком сортировки

### Категории и подкатегории
- Автоматическое создание уникальных категорий
- Связывание подкатегорий с родительскими категориями
- Генерация slug'ов для SEO

## Обработка ошибок

Миграция включает обработку ошибок:

- Пропуск товаров с отсутствующими категориями
- Логирование ошибок для каждого товара
- Продолжение импорта при ошибках отдельных записей
- Прогресс-индикатор каждые 100 товаров

## Откат миграции

Для отката миграции используйте:

```bash
npm run strapi migration:down
```

Это удалит все импортированные данные.

## Дополнительные настройки

### Изменение путей к изображениям

Если ваши изображения находятся в другом месте, обновите функцию `importImages`:

```javascript
// Пример для загрузки изображений в Strapi Media Library
async function importImages(knex, productId, images) {
  for (let i = 0; i < images.length; i++) {
    const imageUrl = images[i];
    
    // Загрузите изображение в Media Library
    const mediaFile = await strapi.plugins.upload.services.upload.upload({
      data: {},
      files: {
        path: imageUrl,
        name: `product-${productId}-${i + 1}.jpg`,
        type: 'image/jpeg'
      }
    });
    
    await knex('product_images').insert({
      product_id: productId,
      url: mediaFile.url,
      alt: `Product image ${i + 1}`,
      sort_order: i,
      created_at: new Date(),
      updated_at: new Date()
    });
  }
}
```

### Настройка индексов

Для улучшения производительности добавьте индексы:

```sql
-- Индексы для быстрого поиска
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_subcategory ON products(subcategory_id);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_popularity ON products(popularity);

-- Индексы для связанных таблиц
CREATE INDEX idx_product_materials_product ON product_materials(product_id);
CREATE INDEX idx_product_dimensions_product ON product_dimensions(product_id);
CREATE INDEX idx_product_images_product ON product_images(product_id);
```

## Устранение неполадок

### Ошибка "Table doesn't exist"
Убедитесь, что контент-типы созданы перед запуском миграции.

### Ошибка "Duplicate entry"
Проверьте уникальность полей `code` в категориях и подкатегориях.

### Медленная миграция
Для больших объемов данных:
- Используйте batch insert
- Добавьте индексы после миграции
- Рассмотрите возможность разделения на несколько миграций

### Проблемы с изображениями
- Проверьте доступность URL изображений
- Убедитесь, что пути корректны
- Рассмотрите возможность локального хранения изображений 