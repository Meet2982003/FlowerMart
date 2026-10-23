const fs = require('fs');

// Read the original css and html
const css = fs.readFileSync('/home/rdp/.gemini/antigravity-ide/brain/78c9c24e-2fec-4084-8eb3-77bc5278838b/blossoming_styles.css', 'utf8');
const html = fs.readFileSync('/home/rdp/.gemini/antigravity-ide/brain/78c9c24e-2fec-4084-8eb3-77bc5278838b/blossoming_index.html', 'utf8');

// Replace vmin with var(--u, 3.2px)
let themedCss = css.replace(/([0-9.]+)vmin/g, 'calc($1 * var(--u, 3.2px))');

// Scope everything under .blossom-garden
// Replace body selector
themedCss = themedCss.replace(/body\s*\{[^}]*\}/g, '');
themedCss = themedCss.replace(/\.night\s*\{[^}]*\}/g, '');

// Adapt colors to JNR Luxury Floral Theme:
// Flower 1: Vibrant Coral Orange (#F05A22, #ff7a45, #ffb38a)
themedCss = themedCss.replace(/#a7ffee/g, '#ffb899');
themedCss = themedCss.replace(/#54b8aa/g, '#F05A22');
themedCss = themedCss.replace(/#39c6d6/g, '#EAA612');
themedCss = themedCss.replace(/#6bf0ff/g, 'rgba(240, 90, 34, 0.6)');
themedCss = themedCss.replace(/#00fffa/g, '#F05A22');

// Green Stems & Leaves
themedCss = themedCss.replace(/#14757a/g, '#2d5a37');
themedCss = themedCss.replace(/#06383b/g, '#1a3821');

fs.writeFileSync('/home/rdp/.gemini/antigravity-ide/brain/78c9c24e-2fec-4084-8eb3-77bc5278838b/test_blossom_themed.css', themedCss);
console.log('Created themed CSS test');
