#!/bin/bash

# Install sharp-cli if not present
if ! command -v sharp &> /dev/null; then
    echo "Installing sharp-cli..."
    npm install -g sharp-cli
fi

# Generate PNG icons from SVG
echo "Generating PWA icons..."

# Create different sized icons
npx sharp -i public/vault-icon.svg -o public/icon-192.png resize 192 192
npx sharp -i public/vault-icon.svg -o public/icon-512.png resize 512 512
npx sharp -i public/vault-icon.svg -o public/icon-1024.png resize 1024 1024

# Create favicon
npx sharp -i public/vault-icon.svg -o public/favicon.ico resize 32 32

echo "Icons generated successfully!"