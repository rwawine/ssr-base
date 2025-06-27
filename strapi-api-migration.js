'use strict';

/**
 * Alternative migration using Strapi API instead of direct database access
 * This approach is safer and uses Strapi's built-in validation and hooks
 */

const productsData = require('./src/data/migrations.json');

module.exports = {
  async up() {
    console.log('Starting products import migration using Strapi API...');
    
    try {
      // Import categories and subcategories first
      const categoryMap = await importCategoriesViaAPI();
      const subcategoryMap = await importSubcategoriesViaAPI(categoryMap);
      
      // Import products
      await importProductsViaAPI(categoryMap, subcategoryMap);
      
      console.log('Products import migration completed successfully!');
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  },

  async down() {
    console.log('Rolling back products import migration...');
    
    try {
      // Remove all imported data using API
      await removeAllProducts();
      await removeAllSubcategories();
      await removeAllCategories();
      
      console.log('Rollback completed!');
    } catch (error) {
      console.error('Rollback failed:', error);
      throw error;
    }
  }
};

async function importCategoriesViaAPI() {
  console.log('Importing categories via API...');
  
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
  
  // Import categories using Strapi API
  for (const categoryStr of uniqueCategories) {
    const category = JSON.parse(categoryStr);
    
    try {
      // Check if category already exists
      const existingCategories = await strapi.entityService.findMany('api::category.category', {
        filters: { code: category.code }
      });
      
      if (existingCategories.length === 0) {
        const createdCategory = await strapi.entityService.create('api::category.category', {
          data: {
            code: category.code,
            name: category.name,
            description: `Category for ${category.name}`,
            publishedAt: new Date()
          }
        });
        
        categoryMap.set(category.code, createdCategory.id);
        console.log(`Created category: ${category.name}`);
      } else {
        categoryMap.set(category.code, existingCategories[0].id);
        console.log(`Category already exists: ${category.name}`);
      }
    } catch (error) {
      console.error(`Error creating category ${category.name}:`, error.message);
    }
  }
  
  console.log(`Processed ${categoryMap.size} categories`);
  return categoryMap;
}

async function importSubcategoriesViaAPI(categoryMap) {
  console.log('Importing subcategories via API...');
  
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
  
  // Import subcategories using Strapi API
  for (const subcategoryStr of uniqueSubcategories) {
    const subcategory = JSON.parse(subcategoryStr);
    const categoryCode = subcategory.code.split('-')[0]; // Assuming subcategory code contains category prefix
    const categoryId = categoryMap.get(categoryCode);
    
    if (categoryId) {
      try {
        // Check if subcategory already exists
        const existingSubcategories = await strapi.entityService.findMany('api::subcategory.subcategory', {
          filters: { code: subcategory.code }
        });
        
        if (existingSubcategories.length === 0) {
          const createdSubcategory = await strapi.entityService.create('api::subcategory.subcategory', {
            data: {
              code: subcategory.code,
              name: subcategory.name,
              description: `Subcategory for ${subcategory.name}`,
              category: categoryId,
              publishedAt: new Date()
            }
          });
          
          subcategoryMap.set(subcategory.code, createdSubcategory.id);
          console.log(`Created subcategory: ${subcategory.name}`);
        } else {
          subcategoryMap.set(subcategory.code, existingSubcategories[0].id);
          console.log(`Subcategory already exists: ${subcategory.name}`);
        }
      } catch (error) {
        console.error(`Error creating subcategory ${subcategory.name}:`, error.message);
      }
    } else {
      console.warn(`Category not found for subcategory: ${subcategory.name}`);
    }
  }
  
  console.log(`Processed ${subcategoryMap.size} subcategories`);
  return subcategoryMap;
}

async function importProductsViaAPI(categoryMap, subcategoryMap) {
  console.log('Importing products via API...');
  
  let importedCount = 0;
  let errorCount = 0;
  
  for (const item of productsData) {
    if (item.products) {
      for (const product of item.products) {
        try {
          const categoryId = categoryMap.get(product.category?.code);
          const subcategoryId = product.subcategory ? subcategoryMap.get(product.subcategory.code) : null;
          
          if (!categoryId) {
            console.warn(`Skipping product ${product.id}: category not found`);
            errorCount++;
            continue;
          }
          
          // Check if product already exists
          const existingProducts = await strapi.entityService.findMany('api::product.product', {
            filters: { strapi_id: product.id }
          });
          
          if (existingProducts.length > 0) {
            console.log(`Product already exists: ${product.name}`);
            continue;
          }
          
          // Prepare product data
          const productData = {
            strapi_id: product.id,
            name: product.name,
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
            category: categoryId,
            subcategory: subcategoryId,
            
            // SEO data
            seo_title: product.seo?.title,
            seo_description: product.seo?.metaDescription,
            seo_keywords: product.seo?.keywords || [],
            
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
            features: product.features || [],
            
            // Installment plans
            installment_plans: product.installmentPlans || [],
            
            publishedAt: new Date()
          };
          
          // Create product
          const createdProduct = await strapi.entityService.create('api::product.product', {
            data: productData
          });
          
          // Import related data
          await importProductMaterials(createdProduct.id, product.materials);
          await importProductDimensions(createdProduct.id, product.dimensions);
          await importProductImages(createdProduct.id, product.images);
          
          importedCount++;
          
          if (importedCount % 50 === 0) {
            console.log(`Imported ${importedCount} products...`);
          }
          
        } catch (error) {
          console.error(`Error importing product ${product.id}:`, error.message);
          errorCount++;
        }
      }
    }
  }
  
  console.log(`Successfully imported ${importedCount} products`);
  if (errorCount > 0) {
    console.log(`Failed to import ${errorCount} products`);
  }
}

async function importProductMaterials(productId, materials) {
  if (!materials || materials.length === 0) return;
  
  for (const material of materials) {
    try {
      await strapi.entityService.create('api::product-material.product-material', {
        data: {
          name: material.name,
          type: material.type,
          color: material.color,
          product: productId
        }
      });
    } catch (error) {
      console.error(`Error creating material for product ${productId}:`, error.message);
    }
  }
}

async function importProductDimensions(productId, dimensions) {
  if (!dimensions || dimensions.length === 0) return;
  
  for (const dimension of dimensions) {
    try {
      await strapi.entityService.create('api::product-dimension.product-dimension', {
        data: {
          width: dimension.width,
          length: dimension.length,
          height: dimension.height,
          depth: dimension.depth,
          price: dimension.price,
          additional_options: dimension.additionalOptions || [],
          product: productId
        }
      });
    } catch (error) {
      console.error(`Error creating dimension for product ${productId}:`, error.message);
    }
  }
}

async function importProductImages(productId, images) {
  if (!images || images.length === 0) return;
  
  for (let i = 0; i < images.length; i++) {
    const imageUrl = images[i];
    
    try {
      await strapi.entityService.create('api::product-image.product-image', {
        data: {
          url: imageUrl,
          alt: `Product image ${i + 1}`,
          sort_order: i,
          product: productId
        }
      });
    } catch (error) {
      console.error(`Error creating image for product ${productId}:`, error.message);
    }
  }
}

async function removeAllProducts() {
  console.log('Removing all products...');
  
  const products = await strapi.entityService.findMany('api::product.product', {
    fields: ['id']
  });
  
  for (const product of products) {
    await strapi.entityService.delete('api::product.product', product.id);
  }
  
  console.log(`Removed ${products.length} products`);
}

async function removeAllSubcategories() {
  console.log('Removing all subcategories...');
  
  const subcategories = await strapi.entityService.findMany('api::subcategory.subcategory', {
    fields: ['id']
  });
  
  for (const subcategory of subcategories) {
    await strapi.entityService.delete('api::subcategory.subcategory', subcategory.id);
  }
  
  console.log(`Removed ${subcategories.length} subcategories`);
}

async function removeAllCategories() {
  console.log('Removing all categories...');
  
  const categories = await strapi.entityService.findMany('api::category.category', {
    fields: ['id']
  });
  
  for (const category of categories) {
    await strapi.entityService.delete('api::category.category', category.id);
  }
  
  console.log(`Removed ${categories.length} categories`);
} 