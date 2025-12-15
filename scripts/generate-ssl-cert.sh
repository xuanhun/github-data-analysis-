#!/bin/bash

# 生成自签名 SSL 证书的脚本
# 用于开发环境的 HTTPS 支持

CERT_DIR="certs"
CERT_FILE="$CERT_DIR/server.crt"
KEY_FILE="$CERT_DIR/server.key"

# 创建 certs 目录（如果不存在）
mkdir -p "$CERT_DIR"

# 检查是否已存在证书
if [ -f "$CERT_FILE" ] && [ -f "$KEY_FILE" ]; then
  echo "证书文件已存在: $CERT_FILE 和 $KEY_FILE"
  read -p "是否要重新生成? (y/N): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "已取消"
    exit 0
  fi
fi

# 生成自签名证书
# 有效期 365 天
openssl req -x509 -newkey rsa:4096 -nodes \
  -keyout "$KEY_FILE" \
  -out "$CERT_FILE" \
  -days 365 \
  -subj "/C=CN/ST=State/L=City/O=Organization/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,DNS:*.localhost,IP:127.0.0.1,IP:::1"

if [ $? -eq 0 ]; then
  echo "✅ SSL 证书生成成功!"
  echo "证书文件: $CERT_FILE"
  echo "私钥文件: $KEY_FILE"
  echo ""
  echo "注意: 这是自签名证书，浏览器会显示安全警告。"
  echo "在开发环境中，你需要手动接受证书或添加到受信任的根证书颁发机构。"
else
  echo "❌ 证书生成失败"
  exit 1
fi
