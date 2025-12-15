/**
 * 将 SVG 图标转换为 PNG 格式的工具脚本
 * 
 * 使用方法：
 * 1. 安装依赖：npm install sharp
 * 2. 运行脚本：node scripts/generate-icon.js
 */

const fs = require('fs');
const path = require('path');

async function generateIcon() {
  try {
    // 检查是否安装了 sharp
    const sharp = require('sharp');
    
    const svgPath = path.join(__dirname, '../public/icon.svg');
    const pngPath = path.join(__dirname, '../public/icon.png');
    
    if (!fs.existsSync(svgPath)) {
      console.error('❌ icon.svg 文件不存在');
      return;
    }
    
    console.log('🔄 正在转换 SVG 到 PNG...');
    
    // 读取 SVG 文件
    const svgBuffer = fs.readFileSync(svgPath);
    
    // 转换为不同尺寸的 PNG
    const sizes = [
      { size: 16, output: 'icon-16.png' },
      { size: 32, output: 'icon-32.png' },
      { size: 64, output: 'icon-64.png' },
      { size: 128, output: 'icon-128.png' },
      { size: 256, output: 'icon-256.png' },
      { size: 512, output: 'icon-512.png' },
    ];
    
    // 生成主图标（512x512）
    await sharp(svgBuffer)
      .resize(512, 512)
      .png()
      .toFile(pngPath);
    
    console.log('✅ 已生成 public/icon.png (512x512)');
    
    // 生成其他尺寸
    for (const { size, output } of sizes) {
      const outputPath = path.join(__dirname, '../public', output);
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      console.log(`✅ 已生成 public/${output} (${size}x${size})`);
    }
    
    console.log('\n✨ 所有图标已生成完成！');
    
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND' && error.message.includes('sharp')) {
      console.error('❌ 未安装 sharp 模块');
      console.log('\n请先安装依赖：');
      console.log('  npm install sharp');
      console.log('或');
      console.log('  pnpm add sharp');
    } else {
      console.error('❌ 生成图标时出错：', error.message);
    }
  }
}

generateIcon();
