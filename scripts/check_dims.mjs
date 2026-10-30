import fs from 'node:fs';

function getJpegDimensions(buffer) {
  let i = 2;
  while (i < buffer.length) {
    if (buffer[i] === 0xFF) {
      const marker = buffer[i + 1];
      if (marker === 0xC0 || marker === 0xC2) {
        return {
          height: buffer.readUInt16BE(i + 5),
          width: buffer.readUInt16BE(i + 7)
        };
      }
      const len = buffer.readUInt16BE(i + 2);
      i += 2 + len;
    } else {
      i++;
    }
  }
  return null;
}

const dir = 'frontend/public/images/products';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg'));
files.forEach(f => {
  const buf = fs.readFileSync(`${dir}/${f}`);
  const dims = getJpegDimensions(buf);
  console.log(`${f}: ${dims?.width}x${dims?.height} (${Math.round(buf.length/1024)}KB)`);
});
