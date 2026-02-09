/**
 * Icon Generator Script
 * =====================
 * Generates all required icon formats from a source PNG.
 *
 * USAGE:
 *   1. Place your source icon as: icon-source.png (1024x1024 recommended)
 *   2. Run: npm run icons
 *
 * REQUIREMENTS:
 *   - Source image should be at least 1024x1024 pixels
 *   - PNG format with transparency recommended
 *   - Square aspect ratio required
 *
 * DEPENDENCIES (optional):
 *   - npm install sharp --save-dev (for PNG generation)
 *   - npm install icon-gen --save-dev (for ICO/ICNS generation)
 */

const fs = require('fs');
const path = require('path');

// Configuration
const SOURCE_IMAGE = path.join(__dirname, '../icon-source.png');
const OUTPUT_DIR = path.join(__dirname, '../build/icons');

// Required icon sizes for each platform
const ICON_SIZES = {
    png: [16, 24, 32, 48, 64, 96, 128, 256, 512, 1024],
    ico: [16, 24, 32, 48, 64, 128, 256],
    icns: [16, 32, 64, 128, 256, 512, 1024]
};

async function generateIcons() {
    console.log('🎨 Icon Generator');
    console.log('==================\n');

    // Check if source image exists
    if (!fs.existsSync(SOURCE_IMAGE)) {
        console.log('❌ Source image not found!');
        console.log(`   Expected: ${SOURCE_IMAGE}`);
        console.log('\n📝 Instructions:');
        console.log('   1. Create a 1024x1024 PNG image for your app icon');
        console.log('   2. Save it as "icon-source.png" in the project root');
        console.log('   3. Run this script again: npm run icons');
        console.log('\n💡 Tips:');
        console.log('   - Use a simple, recognizable design');
        console.log('   - Works well at small sizes (16x16)');
        console.log('   - Use transparency for better appearance');
        showManualInstructions();
        process.exit(1);
    }

    // Create output directories
    const pngDir = path.join(OUTPUT_DIR, 'png');
    if (!fs.existsSync(pngDir)) {
        fs.mkdirSync(pngDir, { recursive: true });
    }

    console.log(`📂 Source: ${SOURCE_IMAGE}`);
    console.log(`📂 Output: ${OUTPUT_DIR}\n`);

    // Try different generation methods
    let success = false;

    // Method 1: Try sharp (best quality)
    if (!success) {
        success = await trySharp();
    }

    // Method 2: Try icon-gen
    if (!success) {
        success = await tryIconGen();
    }

    // If all methods failed, show manual instructions
    if (!success) {
        console.log('\n⚠️  Automatic icon generation requires additional dependencies.');
        showManualInstructions();
        process.exit(1);
    }
}

/**
 * Try generating icons with sharp
 */
async function trySharp() {
    try {
        const sharp = require('sharp');
        const pngDir = path.join(OUTPUT_DIR, 'png');

        console.log('📱 Generating PNG icons with sharp...');

        for (const size of ICON_SIZES.png) {
            const outputPath = path.join(pngDir, `${size}x${size}.png`);
            await sharp(SOURCE_IMAGE)
                .resize(size, size, {
                    fit: 'contain',
                    background: { r: 0, g: 0, b: 0, alpha: 0 }
                })
                .png()
                .toFile(outputPath);
            console.log(`   ✓ ${size}x${size}.png`);
        }

        console.log('\n✅ PNG icons generated successfully!');
        console.log('\n📝 Note: For ICO and ICNS files, use:');
        console.log('   npx electron-icon-builder --input=icon-source.png --output=build/icons');
        
        return true;
    } catch (error) {
        if (error.code === 'MODULE_NOT_FOUND') {
            console.log('⚠️  sharp not installed');
            return false;
        }
        console.error('❌ Error with sharp:', error.message);
        return false;
    }
}

/**
 * Try generating icons with icon-gen
 */
async function tryIconGen() {
    try {
        const icongen = require('icon-gen');

        console.log('🔧 Generating icons with icon-gen...');

        await icongen(SOURCE_IMAGE, OUTPUT_DIR, {
            report: true,
            ico: {
                name: 'icon',
                sizes: ICON_SIZES.ico
            },
            icns: {
                name: 'icon',
                sizes: ICON_SIZES.icns
            }
        });

        // Also generate PNGs
        for (const size of ICON_SIZES.png) {
            console.log(`   ✓ ${size}x${size}.png`);
        }

        console.log('\n✅ Icon generation complete!');
        console.log('\n📦 Generated files:');
        console.log('   - build/icons/icon.ico (Windows)');
        console.log('   - build/icons/icon.icns (macOS)');
        console.log('   - build/icons/png/ (Linux)');

        return true;
    } catch (error) {
        if (error.code === 'MODULE_NOT_FOUND') {
            console.log('⚠️  icon-gen not installed');
            return false;
        }
        console.error('❌ Error with icon-gen:', error.message);
        return false;
    }
}

/**
 * Show manual instructions fallback
 */
function showManualInstructions() {
    console.log('\n📝 Manual Icon Generation Instructions');
    console.log('======================================\n');

    console.log('Option 1: Use electron-icon-builder (Recommended)');
    console.log('--------------------------------------------------');
    console.log('npx electron-icon-builder --input=icon-source.png --output=build/icons\n');

    console.log('Option 2: Install dependencies and run again');
    console.log('---------------------------------------------');
    console.log('npm install sharp --save-dev');
    console.log('npm run icons\n');

    console.log('Option 3: Use online converters');
    console.log('--------------------------------');
    console.log('1. Windows (.ico): https://icoconvert.com/');
    console.log('2. macOS (.icns): https://cloudconvert.com/png-to-icns');
    console.log('3. Linux: Resize PNG to required sizes (16-512px)\n');

    console.log('Required Files:');
    console.log('---------------');
    console.log('build/icons/icon.ico     - Windows (256x256 min)');
    console.log('build/icons/icon.icns    - macOS (512x512 min)');
    console.log('build/icons/png/         - Linux PNG folder');
    console.log('  ├── 16x16.png');
    console.log('  ├── 32x32.png');
    console.log('  ├── 64x64.png');
    console.log('  ├── 128x128.png');
    console.log('  ├── 256x256.png');
    console.log('  └── 512x512.png');
}

// Run the generator
generateIcons().catch(error => {
    console.error('❌ Unexpected error:', error);
    showManualInstructions();
    process.exit(1);
});
