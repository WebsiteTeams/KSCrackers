import fs from 'fs';
import path from 'path';

export const metadata = {
  title: 'Photo Credits — KS Crackers',
};

interface Credit {
  file: string;
  title: string;
  descriptionUrl?: string;
  license: string;
  artist: string;
}

function getCredits(): Credit[] {
  try {
    const filePath = path.join(process.cwd(), 'public', 'images', 'IMAGE-CREDITS.json');
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return [];
  }
}

export default function PhotoCreditsPage() {
  const credits = getCredits();

  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold text-stone-900 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
        Photo Credits
      </h1>
      <p className="text-sm text-stone-600 mb-8">
        Product and category photography on this site is sourced from Wikimedia Commons under
        Creative Commons licenses. We&apos;re grateful to the photographers below.
      </p>
      <div className="space-y-3">
        {credits.map((c) => (
          <div key={c.file} className="border border-stone-200 rounded-lg p-4 text-sm">
            <p className="text-stone-900 font-medium">{c.title.replace(/^File:/, '')}</p>
            <p className="text-stone-500 mt-1">
              By {c.artist || 'Unknown'} — {c.license}
              {c.descriptionUrl && (
                <>
                  {' '}
                  ·{' '}
                  <a href={c.descriptionUrl} target="_blank" rel="noopener noreferrer" className="text-burgundy-600 hover:underline">
                    Source
                  </a>
                </>
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
