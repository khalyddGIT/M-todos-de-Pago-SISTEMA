const fs = require('fs');
const path = require('path');

const images = [
  { name: 'backpack.jpg', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80' },
  { name: 'mouse.jpg', url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80' },
  { name: 'keyboard.jpg', url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80' },
  { name: 'monitor.jpg', url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80' },
  { name: 'headphones.jpg', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80' },
  { name: 'webcam.jpg', url: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=600&auto=format&fit=crop&q=80' },
  { name: 'harddrive.jpg', url: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&auto=format&fit=crop&q=80' },
  { name: 'charger.jpg', url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80' },
  { name: 'camera.jpg', url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80' }
];

const targetDir = path.join(__dirname, '..', '..', 'frontend', 'public', 'images');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

async function downloadAll() {
  for (const img of images) {
    try {
      const res = await fetch(img.url);
      if (!res.ok) throw new Error('Status ' + res.status);
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const filePath = path.join(targetDir, img.name);
      fs.writeFileSync(filePath, buffer);
      console.log('Downloaded real photo:', img.name, '(' + (buffer.length / 1024).toFixed(1) + ' KB)');
    } catch (e) {
      console.error('Failed to download', img.name, e.message);
    }
  }
}

downloadAll();
