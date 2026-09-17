import { Truck, MapPin, PackageCheck, Clock } from 'lucide-react';

export const metadata = {
  title: 'Delivery Information — KS Crackers',
};

const INFO_CARDS = [
  {
    icon: Truck,
    title: 'Delivery Coverage',
    body: 'We deliver across selected states via specialized cargo partners experienced in handling firecracker shipments safely and legally.',
  },
  {
    icon: PackageCheck,
    title: 'Secure Packaging',
    body: 'Every order is packed in compliant, tamper-proof packaging designed to keep products safe and intact during transport.',
  },
  {
    icon: Clock,
    title: 'Delivery Timelines',
    body: 'Dispatch typically happens within 1–3 business days of order confirmation. Transit time depends on your location and can range from 3–10 days, especially during the festive season.',
  },
  {
    icon: MapPin,
    title: 'Store Pickup',
    body: 'Customers near Sivakasi can choose "Store Pickup" at checkout. We\'ll notify you by phone once your order is ready, along with pickup location and timings.',
  },
];

export default function DeliveryInformationPage() {
  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <span className="text-xs uppercase tracking-wider text-burgundy-600 font-semibold">Shipping</span>
      <h1 className="text-3xl font-bold text-stone-900 mt-1 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
        Delivery Information
      </h1>
      <p className="text-stone-600 leading-relaxed mb-10">
        Here&apos;s everything you need to know about how your order reaches you — whether by delivery or store pickup.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
        {INFO_CARDS.map((card) => (
          <div key={card.title} className="flex items-start gap-3.5 p-5 bg-white rounded-lg border border-stone-200">
            <card.icon className="w-5 h-5 text-burgundy-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-sm text-stone-900 mb-1">{card.title}</h3>
              <p className="text-xs text-stone-500 leading-relaxed">{card.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-stone-900 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            Shipping Charges
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            Shipping charges depend on your pincode and order weight, and are calculated at checkout before you
            confirm payment. There are no hidden fees.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-bold text-stone-900 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            Tracking Your Order
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            Once dispatched, we&apos;ll share tracking details via your registered contact number or email so you
            can follow your order&apos;s progress.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-bold text-stone-900 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            Restricted Areas
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            Due to local regulations, we are occasionally unable to deliver firecrackers to certain regions. If
            your pincode is restricted, our team will contact you to arrange an alternative such as store pickup.
          </p>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-stone-200 text-sm text-stone-500">
        Have a question about your delivery? Contact us at{' '}
        <a href="mailto:support@kscrackers.com" className="text-burgundy-600 hover:underline">support@kscrackers.com</a>.
      </div>
    </div>
  );
}
