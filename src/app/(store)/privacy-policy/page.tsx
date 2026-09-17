export const metadata = {
  title: 'Privacy Policy — KS Crackers',
};

const SECTIONS = [
  {
    heading: 'Information We Collect',
    body: [
      'When you place an order or contact us, we collect details you provide directly — such as your name, mobile number, email address, delivery address, and pincode — to process your order and communicate with you.',
      'We also collect basic usage information (like pages visited and items added to cart) to improve our website experience. We do not collect payment card details; payments are handled through your chosen UPI or bank transfer method.',
    ],
  },
  {
    heading: 'How We Use Your Information',
    body: [
      'Your details are used to confirm and fulfil orders, arrange delivery or pickup, respond to enquiries, and share order-related updates such as dispatch confirmations.',
      'We may occasionally send festive offers or restock notifications if you have shared your contact details with us, and you can opt out of these at any time by contacting us.',
    ],
  },
  {
    heading: 'How We Protect Your Information',
    body: [
      'We take reasonable technical and organizational measures to protect your personal information from unauthorized access, alteration, or disclosure. Access to customer and order data is restricted to authorized store administrators only.',
    ],
  },
  {
    heading: 'Sharing of Information',
    body: [
      'We do not sell or rent your personal information to third parties. Information is shared only with delivery/logistics partners as necessary to fulfil your order, or when required by law.',
    ],
  },
  {
    heading: 'Your Choices',
    body: [
      'You may request access to, correction of, or deletion of your personal information held by us at any time by writing to support@kscrackers.com.',
    ],
  },
  {
    heading: 'Changes to This Policy',
    body: [
      'We may update this policy from time to time to reflect changes in our practices. The updated version will always be posted on this page.',
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <span className="text-xs uppercase tracking-wider text-burgundy-600 font-semibold">Legal</span>
      <h1 className="text-3xl font-bold text-stone-900 mt-1 mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
        Privacy Policy
      </h1>
      <p className="text-sm text-stone-500 mb-10">Last updated: September 2026</p>

      <p className="text-stone-600 leading-relaxed mb-10">
        KS Crackers (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) respects your privacy. This policy explains what
        information we collect when you use our website or place an order, and how we use and protect it.
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
        Questions about this policy? Contact us at{' '}
        <a href="mailto:support@kscrackers.com" className="text-burgundy-600 hover:underline">support@kscrackers.com</a>.
      </div>
    </div>
  );
}
