'use strict';

/**
 * This is a Strapi migration file that imports products from your JSON data
 * Place this file in your Strapi project's `database/migrations/` folder
 * Run with: npm run strapi migration:run
 */

const productsData = require('./src/data/migrations.json');

module.exports = {
  async up(knex) {
    console.log('Starting products import migration...');
    
    // First, ensure we have the necessary content types
    await ensureContentTypes(knex);
    
    // Import categories and subcategories first
    const categoryMap = await importCategories(knex);
    const subcategoryMap = await importSubcategories(knex, categoryMap);
    
    // Import products
    await importProducts(knex, categoryMap, subcategoryMap);
    
    console.log('Products import migration completed successfully!');
  },

  async down(knex) {
    console.log('Rolling back products import migration...');
    
    // Remove all imported data
    await knex('products').del();
    await knex('subcategories').del();
    await knex('categories').del();
    
    console.log('Rollback completed!');
  }
};

async function ensureContentTypes(knex) {
  // This function ensures that the necessary content types exist
  // In a real Strapi setup, you would define these in the content-types folder
  console.log('Ensuring content types exist...');
}

async function importCategories(knex) {
  console.log('Importing categories...');
  
  const categoryMap = new Map();
  const uniqueCategories = new Set();
  
  // Extract unique categories from products data
  productsData.forEach(item => {
    if (item.products) {
      item.products.forEach(product => {
        if (product.category) {
          uniqueCategories.add(JSON.stringify(product.category));
        }
      });
    }
  });
  
  // Insert categories
  for (const categoryStr of uniqueCategories) {
    const category = JSON.parse(categoryStr);
    
    const [categoryId] = await knex('categories').insert({
      code: category.code,
      name: category.name,
      slug: category.code,
      created_at: new Date(),
      updated_at: new Date(),
      published_at: new Date()
    }).returning('id');
    
    categoryMap.set(category.code, categoryId);
  }
  
  console.log(`Imported ${categoryMap.size} categories`);
  return categoryMap;
}

async function importSubcategories(knex, categoryMap) {
  console.log('Importing subcategories...');
  
  const subcategoryMap = new Map();
  const uniqueSubcategories = new Set();
  
  // Extract unique subcategories from products data
  productsData.forEach(item => {
    if (item.products) {
      item.products.forEach(product => {
        if (product.subcategory) {
          uniqueSubcategories.add(JSON.stringify(product.subcategory));
        }
      });
    }
  });
  
  // Insert subcategories
  for (const subcategoryStr of uniqueSubcategories) {
    const subcategory = JSON.parse(subcategoryStr);
    const categoryId = categoryMap.get(subcategory.code.split('-')[0]); // Assuming subcategory code contains category prefix
    
    if (categoryId) {
      const [subcategoryId] = await knex('subcategories').insert({
        code: subcategory.code,
        name: subcategory.name,
        slug: subcategory.code,
        category_id: categoryId,
        created_at: new Date(),
        updated_at: new Date(),
        published_at: new Date()
      }).returning('id');
      
      subcategoryMap.set(subcategory.code, subcategoryId);
    }
  }
  
  console.log(`Imported ${subcategoryMap.size} subcategories`);
  return subcategoryMap;
}

async function importProducts(knex, categoryMap, subcategoryMap) {
  console.log('Importing products...');
  
  let importedCount = 0;
  
  for (const item of productsData) {
    if (item.products) {
      for (const product of item.products) {
        try {
          const categoryId = categoryMap.get(product.category?.code);
          const subcategoryId = product.subcategory ? subcategoryMap.get(product.subcategory.code) : null;
          
          if (!categoryId) {
            console.warn(`Skipping product ${product.id}: category not found`);
            continue;
          }
          
          // Prepare product data for insertion
          const productData = {
            strapi_id: product.id,
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: product.price?.current || 0,
            old_price: product.price?.old || null,
            discount: product.price?.discount || null,
            availability: product.availability,
            manufacturing: product.manufacturing,
            popularity: product.popularity || 0,
            style: product.style,
            color: product.color,
            max_load: product.maxLoad,
            country: product.country,
            warranty: product.warranty,
            commercial_offer: product.commercialOffer,
            category_id: categoryId,
            subcategory_id: subcategoryId,
            
            // SEO data
            seo_title: product.seo?.title,
            seo_description: product.seo?.metaDescription,
            seo_keywords: product.seo?.keywords ? JSON.stringify(product.seo.keywords) : null,
            
            // Delivery data
            delivery_available: product.delivery?.available || false,
            delivery_cost: product.delivery?.cost,
            delivery_time: product.delivery?.time,
            
            // Promotion data
            promotion_type: product.promotion?.type,
            promotion_text: product.promotion?.text,
            promotion_valid_until: product.promotion?.validUntil,
            
            // Sleeping place data
            sleeping_width: product.sleepingPlace?.width,
            sleeping_length: product.sleepingPlace?.length,
            
            // Features
            features: product.features ? JSON.stringify(product.features) : null,
            
            // Installment plans
            installment_plans: product.installmentPlans ? JSON.stringify(product.installmentPlans) : null,
            
            created_at: new Date(),
            updated_at: new Date(),
            published_at: new Date()
          };
          
          // Insert product
          const [productId] = await knex('products').insert(productData).returning('id');
          
          // Import materials
          if (product.materials && product.materials.length > 0) {
            await importMaterials(knex, productId, product.materials);
          }
          
          // Import dimensions
          if (product.dimensions && product.dimensions.length > 0) {
            await importDimensions(knex, productId, product.dimensions);
          }
          
          // Import images
          if (product.images && product.images.length > 0) {
            await importImages(knex, productId, product.images);
          }
          
          importedCount++;
          
          if (importedCount % 100 === 0) {
            console.log(`Imported ${importedCount} products...`);
          }
          
        } catch (error) {
          console.error(`Error importing product ${product.id}:`, error.message);
        }
      }
    }
  }
  
  console.log(`Successfully imported ${importedCount} products`);
}

async function importMaterials(knex, productId, materials) {
  for (const material of materials) {
    await knex('product_materials').insert({
      product_id: productId,
      name: material.name,
      type: material.type,
      color: material.color,
      created_at: new Date(),
      updated_at: new Date()
    });
  }
}

async function importDimensions(knex, productId, dimensions) {
  for (const dimension of dimensions) {
    await knex('product_dimensions').insert({
      product_id: productId,
      width: dimension.width,
      length: dimension.length,
      height: dimension.height,
      depth: dimension.depth,
      price: dimension.price,
      additional_options: dimension.additionalOptions ? JSON.stringify(dimension.additionalOptions) : null,
      created_at: new Date(),
      updated_at: new Date()
    });
  }
}

async function importImages(knex, productId, images) {
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    await knex('product_images').insert({
      product_id: productId,
      url: image,
      alt: `Product image ${i + 1}`,
      sort_order: i,
      created_at: new Date(),
      updated_at: new Date()
    });
  }
} 