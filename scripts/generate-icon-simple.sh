#!/bin/bash
# 使用 ImageMagick 或其他工具将 SVG 转换为 PNG 的脚本
# 需要安装 ImageMagick: brew install imagemagick (macOS) 或 apt-get install imagemagick (Linux)

echo "🔄 正在转换 SVG 到 PNG..."

cd "$(dirname "$0")/.."

if command -v convert &> /dev/null; then
    # 使用 ImageMagick
    convert -background none -resize 512x512 public/icon.svg public/icon.png
    echo "✅ 已生成 public/icon.png (512x512)"
    
    # 生成不同尺寸
    for size in 16 32 64 128 256; do
        convert -background none -resize ${size}x${size} public/icon.svg public/icon-${size}.png
        echo "✅ 已生成 public/icon-${size}.png (${size}x${size})"
    done
    
    echo "✨ 所有图标已生成完成！"
elif command -v rsvg-convert &> /dev/null; then
    # 使用 librsvg
    rsvg-convert -w 512 -h 512 public/icon.svg > public/icon.png
    echo "✅ 已生成 public/icon.png (512x512)"
else
    echo "❌ 未找到 ImageMagick 或 librsvg"
    echo "请安装其中一个工具："
    echo "  macOS: brew install imagemagick 或 brew install librsvg"
    echo "  Linux: apt-get install imagemagick 或 apt-get install librsvg2-bin"
    echo ""
    echo "或者使用在线工具："
    echo "  https://cloudconvert.com/svg-to-png"
    echo "  https://convertio.co/svg-png/"
fi
