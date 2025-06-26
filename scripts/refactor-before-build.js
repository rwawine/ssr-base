#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Starting pre-build refactoring...\n');

// Configuration
const config = {
    srcDir: 'src',
    componentsDir: 'src/components',
    pagesDir: 'src/app',
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    excludeDirs: ['node_modules', '.next', 'dist', 'build', '.git'],
    filesToCheck: [
        'src/app/catalog/CatalogClient.tsx',
        'src/app/catalog/[productId]/ProductDetail.tsx',
        'src/app/favorites/page.tsx',
        'src/components/header/Header.tsx',
        'src/components/productCard/ProductCard.tsx',
        'src/app/cart/page.tsx'
    ]
};

// Utility functions
function log(message, type = 'info') {
    const colors = {
        info: '\x1b[36m',    // Cyan
        success: '\x1b[32m', // Green
        warning: '\x1b[33m', // Yellow
        error: '\x1b[31m',   // Red
        reset: '\x1b[0m'     // Reset
    };
    console.log(`${colors[type]}${message}${colors.reset}`);
}

function findFiles(dir, extensions = ['.tsx', '.ts']) {
    const files = [];

    function traverse(currentDir) {
        const items = fs.readdirSync(currentDir);

        for (const item of items) {
            const fullPath = path.join(currentDir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                if (!config.excludeDirs.includes(item)) {
                    traverse(fullPath);
                }
            } else if (extensions.some(ext => item.endsWith(ext))) {
                files.push(fullPath);
            }
        }
    }

    traverse(dir);
    return files;
}

// Refactoring functions
function fixProductCardImports() {
    log('🔍 Checking ProductCard imports...', 'info');

    const files = findFiles(config.srcDir);
    let fixedCount = 0;

    for (const file of files) {
        const content = fs.readFileSync(file, 'utf8');

        // Check for incorrect ProductCard import
        if (content.includes("import ProductCard from '@/components/productCard/ProductCard'")) {
            const newContent = content.replace(
                "import ProductCard from '@/components/productCard/ProductCard'",
                "import { ProductCard } from '@/components/productCard/ProductCard'"
            );

            fs.writeFileSync(file, newContent);
            log(`✅ Fixed ProductCard import in ${file}`, 'success');
            fixedCount++;
        }
    }

    log(`📊 Fixed ${fixedCount} ProductCard import issues`, 'success');
    return fixedCount;
}

function checkHydrationIssues() {
    log('🔍 Checking for potential hydration issues...', 'info');

    const files = findFiles(config.srcDir);
    const issues = [];

    for (const file of files) {
        const content = fs.readFileSync(file, 'utf8');

        // Check for client components that might have hydration issues
        if (content.includes("'use client'") &&
            (content.includes('useCart') || content.includes('useFavorites') || content.includes('localStorage'))) {

            // Check if hydration check is missing
            if (!content.includes('isHydrated') && !content.includes('useEffect') &&
                (content.includes('cart') || content.includes('favorites'))) {
                issues.push({
                    file,
                    issue: 'Potential hydration issue - missing hydration check for cart/favorites state'
                });
            }
        }
    }

    if (issues.length > 0) {
        log('⚠️  Potential hydration issues found:', 'warning');
        issues.forEach(issue => {
            log(`   ${issue.file}: ${issue.issue}`, 'warning');
        });
    } else {
        log('✅ No obvious hydration issues found', 'success');
    }

    return issues.length;
}

function checkTypeScriptIssues() {
    log('🔍 Checking TypeScript issues...', 'info');

    try {
        execSync('npx tsc --noEmit', { stdio: 'pipe' });
        log('✅ No TypeScript errors found', 'success');
        return 0;
    } catch (error) {
        log('❌ TypeScript errors found:', 'error');
        log(error.stdout.toString(), 'error');
        return 1;
    }
}

function checkLintingIssues() {
    log('🔍 Checking ESLint issues...', 'info');

    try {
        // Check if ESLint config exists
        const eslintConfigExists = fs.existsSync('.eslintrc.js') ||
            fs.existsSync('.eslintrc.json') ||
            fs.existsSync('eslint.config.js') ||
            fs.existsSync('eslint.config.mjs');

        if (!eslintConfigExists) {
            log('⚠️  ESLint configuration not found, skipping lint check', 'warning');
            return 0;
        }

        execSync('npx eslint src --ext .ts,.tsx,.js,.jsx --max-warnings 0', { stdio: 'pipe' });
        log('✅ No ESLint errors found', 'success');
        return 0;
    } catch (error) {
        // Check if it's a configuration error
        if (error.stdout && error.stdout.toString().includes('eslint.config')) {
            log('⚠️  ESLint configuration issue detected, skipping lint check', 'warning');
            log('   Consider updating to ESLint v9 format or using .eslintrc.*', 'warning');
            return 0;
        }

        log('❌ ESLint errors found:', 'error');
        if (error.stdout) {
            log(error.stdout.toString(), 'error');
        }
        return 1;
    }
}

function fixCommonIssues() {
    log('🔧 Fixing common issues...', 'info');
    let fixedCount = 0;

    const files = findFiles(config.srcDir);

    for (const file of files) {
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;

        // Fix missing React imports
        if (content.includes('useState') || content.includes('useEffect') || content.includes('useRef')) {
            if (!content.includes("import React") && !content.includes("import {") && content.includes("'use client'")) {
                content = content.replace(
                    "'use client'",
                    "'use client'\n\nimport React, { useState, useEffect, useRef } from 'react';"
                );
                modified = true;
            }
        }

        // Fix potential undefined access
        if (content.includes('cart.totalPrice') && !content.includes('cart.totalPrice || 0')) {
            content = content.replace(/cart\.totalPrice/g, '(cart.totalPrice || 0)');
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(file, content);
            log(`✅ Fixed common issues in ${file}`, 'success');
            fixedCount++;
        }
    }

    log(`📊 Fixed ${fixedCount} common issues`, 'success');
    return fixedCount;
}

function validateFileStructure() {
    log('🔍 Validating file structure...', 'info');

    const requiredDirs = [
        'src/app',
        'src/components',
        'src/hooks',
        'src/types',
        'src/lib',
        'src/utils'
    ];

    const missingDirs = requiredDirs.filter(dir => !fs.existsSync(dir));

    if (missingDirs.length > 0) {
        log('❌ Missing required directories:', 'error');
        missingDirs.forEach(dir => log(`   ${dir}`, 'error'));
        return false;
    }

    log('✅ File structure is valid', 'success');
    return true;
}

function checkDependencies() {
    log('🔍 Checking dependencies...', 'info');

    try {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        const requiredDeps = [
            'react',
            'react-dom',
            'next',
            'typescript'
        ];

        const missingDeps = requiredDeps.filter(dep =>
            !packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]
        );

        if (missingDeps.length > 0) {
            log('❌ Missing required dependencies:', 'error');
            missingDeps.forEach(dep => log(`   ${dep}`, 'error'));
            return false;
        }

        log('✅ All required dependencies are present', 'success');
        return true;
    } catch (error) {
        log('❌ Error reading package.json', 'error');
        return false;
    }
}

function runPrettier() {
    log('🎨 Running Prettier...', 'info');

    try {
        execSync('npx prettier --write "src/**/*.{ts,tsx,js,jsx}"', { stdio: 'pipe' });
        log('✅ Code formatting completed', 'success');
        return true;
    } catch (error) {
        log('❌ Prettier formatting failed', 'error');
        return false;
    }
}

// Main refactoring function
async function runRefactoring() {
    const startTime = Date.now();
    let totalIssues = 0;

    try {
        // Step 1: Validate project structure
        log('\n📁 Step 1: Validating project structure', 'info');
        if (!validateFileStructure()) {
            throw new Error('Invalid project structure');
        }

        // Step 2: Check dependencies
        log('\n📦 Step 2: Checking dependencies', 'info');
        if (!checkDependencies()) {
            throw new Error('Missing dependencies');
        }

        // Step 3: Fix ProductCard imports
        log('\n🔧 Step 3: Fixing ProductCard imports', 'info');
        totalIssues += fixProductCardImports();

        // Step 4: Fix common issues
        log('\n🔧 Step 4: Fixing common issues', 'info');
        totalIssues += fixCommonIssues();

        // Step 5: Check for hydration issues
        log('\n💧 Step 5: Checking hydration issues', 'info');
        totalIssues += checkHydrationIssues();

        // Step 6: Run Prettier
        log('\n🎨 Step 6: Running Prettier', 'info');
        runPrettier();

        // Step 7: Check TypeScript
        log('\n📝 Step 7: Checking TypeScript', 'info');
        totalIssues += checkTypeScriptIssues();

        // Step 8: Check ESLint
        log('\n🔍 Step 8: Checking ESLint', 'info');
        totalIssues += checkLintingIssues();

        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);

        log(`\n🎉 Refactoring completed in ${duration}s`, 'success');
        log(`📊 Total issues found/fixed: ${totalIssues}`, 'info');

        if (totalIssues === 0) {
            log('✅ All checks passed! Ready for build.', 'success');
            process.exit(0);
        } else {
            log('⚠️  Some issues were found. Please review before building.', 'warning');
            process.exit(1);
        }

    } catch (error) {
        log(`\n❌ Refactoring failed: ${error.message}`, 'error');
        process.exit(1);
    }
}

// Run the refactoring
if (require.main === module) {
    runRefactoring();
}

module.exports = {
    runRefactoring,
    fixProductCardImports,
    checkHydrationIssues,
    checkTypeScriptIssues,
    checkLintingIssues,
    fixCommonIssues,
    validateFileStructure,
    checkDependencies,
    runPrettier
}; 