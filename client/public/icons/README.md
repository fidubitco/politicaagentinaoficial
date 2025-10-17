# PWA Icons

This directory should contain the following PWA icon files:

## Required Icons

- `icon-72x72.png` - 72x72px
- `icon-96x96.png` - 96x96px
- `icon-128x128.png` - 128x128px
- `icon-144x144.png` - 144x144px
- `icon-152x152.png` - 152x152px
- `icon-192x192.png` - 192x192px (Android home screen)
- `icon-384x384.png` - 384x384px
- `icon-512x512.png` - 512x512px (Android splash screen)

## Design Guidelines

- Use the Argentine colors (celeste and white) with your logo
- Icons should work on both light and dark backgrounds
- Include a maskable version with safe area padding (80% logo, 20% padding)
- Export as PNG with transparency
- Optimize images for web (use tools like ImageOptim or Squoosh)

## Generation

You can use tools like:
- [PWA Asset Generator](https://github.com/elegantapp/pwa-asset-generator)
- [Real Favicon Generator](https://realfavicongenerator.net/)
- [PWA Builder](https://www.pwabuilder.com/imageGenerator)

Example using PWA Asset Generator:
```bash
npx pwa-asset-generator logo.svg icons --icon-only --background "#1e3a8a" --padding "10%"
```
