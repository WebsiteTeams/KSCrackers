import { CheckCircle2, XCircle, ShieldAlert } from 'lucide-react';

export const metadata = {
  title: 'Safety Guidelines — KS Crackers',
};

const DOS = [
  'Buy crackers only from a licensed dealer and check for burst/expiry details on the label.',
  'Light crackers in open outdoor spaces, away from dry grass, buildings, and vehicles.',
  'Keep a bucket of water or sand nearby at all times while bursting crackers.',
  'Light one cracker at a time, at arm\'s length, and step back immediately.',
  'Supervise children closely and let adults handle sparklers and lighting.',
  'Wear cotton clothing and keep hair tied back while handling firecrackers.',
  'Store unused crackers in a cool, dry place, away from flames and direct sunlight.',
  'Follow local timing restrictions on bursting firecrackers.',
];

const DONTS = [
  'Do not burst crackers in crowded areas, narrow lanes, or near hospitals and elderly people.',
  'Never re-light a cracker that has failed to burst — douse it in water instead.',
  'Do not hold lit crackers in your hand (except sparklers designed for handheld use).',
  'Avoid making your own combinations of firecrackers or altering their design.',
  'Do not store crackers near stoves, candles, or electrical appliances.',
  'Never point or throw firecrackers at another person.',
];

export default function SafetyGuidelinesPage() {
  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <span className="text-xs uppercase tracking-wider text-burgundy-600 font-semibold">Safety First</span>
      <h1 className="text-3xl font-bold text-stone-900 mt-1 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
        Safety Guidelines
      </h1>
      <p className="text-stone-600 leading-relaxed mb-10">
        Firecrackers bring joy to celebrations when used responsibly. Please follow these guidelines to keep
        yourself, your family, and those around you safe.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            <CheckCircle2 className="w-5 h-5 text-forest-600" /> Do
          </h2>
          <ul className="space-y-3">
            {DOS.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-stone-600 leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-forest-500 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            <XCircle className="w-5 h-5 text-red-500" /> Don&apos;t
          </h2>
          <ul className="space-y-3">
            {DONTS.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-stone-600 leading-relaxed">
                <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex items-start gap-3 p-5 bg-burgundy-50 border border-burgundy-100 rounded-lg">
        <ShieldAlert className="w-5 h-5 text-burgundy-600 shrink-0 mt-0.5" />
        <p className="text-sm text-stone-700 leading-relaxed">
          In case of a burn or injury, run cool water over the affected area for at least 10 minutes and seek
          medical attention immediately. For fire emergencies, contact your local fire department without delay.
        </p>
      </div>
    </div>
  );
}
