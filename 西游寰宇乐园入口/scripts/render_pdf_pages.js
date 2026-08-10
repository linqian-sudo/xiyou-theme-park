const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const { createCanvas } = require('@napi-rs/canvas');

const inputPdf = path.resolve(process.argv[2]);
const outputDir = path.resolve(process.argv[3]);

async function render() {
  const runtimeModules = process.env.CODEX_NODE_MODULES;
  if (!runtimeModules) throw new Error('CODEX_NODE_MODULES is required to locate pdfjs-dist.');
  const pdfjsPath = path.join(runtimeModules, 'pdfjs-dist', 'legacy', 'build', 'pdf.mjs');
  const pdfjs = await import(pathToFileURL(pdfjsPath).href);
  const source = new Uint8Array(fs.readFileSync(inputPdf));
  const document = await pdfjs.getDocument({
    data: source,
    useWorkerFetch: false,
    isEvalSupported: false,
    useSystemFonts: true,
  }).promise;

  fs.mkdirSync(outputDir, { recursive: true });
  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1.65 });
    const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
    const context = canvas.getContext('2d');
    await page.render({ canvasContext: context, viewport }).promise;
    const filename = `page-${String(pageNumber).padStart(2, '0')}.jpg`;
    fs.writeFileSync(path.join(outputDir, filename), canvas.toBuffer('image/jpeg', { quality: 94 }));
    console.log(`${pageNumber}/${document.numPages} ${filename}`);
  }
}

render().catch((error) => { console.error(error); process.exit(1); });
