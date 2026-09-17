export const metadata = {
  title: 'Terms & Conditions — KS Crackers',
};

const SECTIONS = [
  {
    heading: 'Orders & Availability',
    body: [
      'All products listed are subject to availability. Stock levels are updated in real time, but in rare cases an item may sell out before your order is confirmed — if this happens, we will contact you with alternatives or a refund.',
      'Prices displayed include applicable taxes unless stated otherwise, and are subject to change without prior notice.',
    ],
  },
  {
    heading: 'Age Restriction',
    body: [
      'Firecrackers are age-restricted products. By placing an order, you confirm that you are at least 18 years old and that the products will be used responsibly and in accordance with local regulations.',
    ],
  },
  {
    heading: 'Payment',
    body: [
      'We accept UPI (GPay, PhonePe, Paytm), bank transfer, and cash/card at our pickup store. Orders are confirmed only after payment is received or verified by our team.',
    ],
  },
  {
    heading: 'Delivery & Pickup',
    body: [
      'Delivery timelines vary by location and are communicated at the time of order confirmation. Store pickup is available for customers near Sivakasi — see our Delivery Information page for details.',
    ],
  },
  {
    heading: 'Returns & Refunds',
    body: [
      'Due to the nature of firecracker products and safety regulations, we do not accept returns once an order has been dispatched or picked up. Refunds are considered on a case-by-case basis for damaged or incorrect items — please contact us within 48 hours of delivery with photos of the issue.',
    ],
  },
  {
    heading: 'Safe Use',
    body: [
      'Customers are responsible for using firecrackers safely and in compliance with local rules on permitted timings, locations, and noise/pollution norms. See our Safety Guidelines page for recommended practices.',
    ],
  },
  {
    heading: 'Limitation of Liability',
    body: [
      'KS Crackers is not liable for any injury, loss, or damage arising from improper storage, handling, or use of products purchased from us.',
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <span className="text-xs uppercase tracking-wider text-burgundy-600 font-semibold">Legal</span>
      <h1 className="text-3xl font-bold text-stone-900 mt-1 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
        Terms &amp; Conditions
      </h1>
      <p className="text-sm text-stone-500 mb-10">Last updated: September 2026</p>

      <p className="text-stone-600 leading-relaxed mb-10">
        These terms govern your use of the KS Crackers website and any purchase made through it. By placing an
        order with us, you agree to the terms below.
      </p>

      <div className="space-y-8">
        {SECTIONS.map((section) => (
          <div key={section.heading}>
            <h2 className="text-lg font-bold text-stone-900 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              {section.heading}
            </h2>
            <div className="space-y-2">
              {section.body.map((para, i) => (
                <p key={i} className="text-sm text-stone-600 leading-relaxed">{para}</p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 pt-6 border-t border-stone-200 text-sm text-stone-500">
        Questions about these terms? Contact us at{' '}
        <a href="mailto:support@kscrackers.com" className="text-burgundy-600 hover:underline">support@kscrackers.com</a>.
      </div>
    </div>
  );
}
