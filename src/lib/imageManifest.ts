import fs from 'fs';
import path from 'path';

const IMAGE_EXTENSIONS = new Set(['.webp', '.avif', '.jpg', '.jpeg', '.png', '.svg']);

function collectImagePaths(dir: string, out: Set<string>): void {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectImagePaths(fullPath, out);
    } else if (IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      const relative = path.relative(path.join(process.cwd(), 'public'), fullPath);
      out.add('/' + relative.split(path.sep).join('/'));
    }
  }
}

declare global {
  var __ksImageManifest: { paths: Set<string>; scannedAt: number } | undefined;
}

const CACHE_TTL_MS = 30_000;

export function getExistingImagePaths(): Set<string> {
  const cached = globalThis.__ksImageManifest;
  if (cached && Date.now() - cached.scannedAt < CACHE_TTL_MS) {
    return cached.paths;
  }

  const paths = new Set<string>();
  collectImagePaths(path.join(process.cwd(), 'public', 'images'), paths);
  globalThis.__ksImageManifest = { paths, scannedAt: Date.now() };
  return paths;
}

export function createLocalFileFilter(): (url: string) => boolean {
  const existing = getExistingImagePaths();
  return (url: string) => existing.has(url);
}
