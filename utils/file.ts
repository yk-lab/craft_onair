import type { IOptions } from 'canvg';

const loadImage = async (file: File) => {
  const image = new Image();
  const url = URL.createObjectURL(file);
  image.src = url;

  return new Promise<HTMLImageElement>((resolve, reject) => {
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = reject;
  });
};

const loadSvg = async (file: File) => {
  const { Canvg, presets } = await import('canvg');
  const preset = presets.offscreen() as IOptions;

  const canvas = new OffscreenCanvas(1024, 1024);
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas context not found');
  }

  const svg = await file.text();
  const v = Canvg.fromString(ctx, svg, preset);
  await v.render();

  const blob = await canvas.convertToBlob();
  const url = URL.createObjectURL(blob);

  const image = new Image(canvas.width, canvas.height);
  image.src = url;

  return new Promise<HTMLImageElement>((resolve, reject) => {
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = reject;
  });
};

export const convertToJpg = async (file: File) => {
  const image = file.type === 'image/svg+xml' ? await loadSvg(file) : await loadImage(file);

  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas context not found');
  }
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0);

  return canvas.toDataURL('image/jpeg');
};
