import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { PageLoader } from '../layout/PageLoader';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

const pricingTiers = [
  {
    name: 'Free',
    price: 'Free',
    description: 'Get started with basic translation',
    features: [
      '3600 credits included',
      '3 pages at 1200 credits/page',
      'Basic email support',
      'Standard processing speed',
    ],
    cta: 'Current Plan',
    highlighted: false,
    credits: 0,
    tier: 'Free Tier',
  },
  {
    name: 'Basic',
    price: '$15',
    period: '/month',
    description: 'Perfect for occasional translators',
    features: [
      '840,000 credits per month',
      '700 pages per month',
      'Additional pages: $0.50/page',
      'Email support included',
      'Priority processing',
      'Translation history',
    ],
    cta: 'Upgrade to Basic',
    highlighted: false,
    credits: 840000,
    tier: 'Basic',
  },
  {
    name: 'Pro / Author',
    price: '$50',
    period: '/month',
    description: 'For professional authors and translators',
    features: [
      '2,400,000 credits per month',
      '2000 pages per month',
      'Finishing assist: +$5/month',
      'Personalization: +$15/month',
      'Email support included',
      'Fastest processing',
      'Advanced AI suggestions',
      'Custom glossaries',
    ],
    cta: 'Upgrade to Pro',
    highlighted: true,
    credits: 2400000,
    tier: 'Pro',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For teams and organizations',
    features: [
      'Custom pricing per user',
      'Add multiple users',
      'Usage-based billing',
      'Dedicated support',
      'Custom integrations',
      'SLA guarantees',
      'Team collaboration tools',
    ],
    cta: 'Contact Sales',
    highlighted: false,
    credits: 0,
    tier: 'Enterprise',
  },
];

export function BillingPage() {
  const { user, upgradePlan } = useAuth();

  const handleUpgrade = (tier: typeof pricingTiers[0]) => {
    if (tier.name === 'Free') {
      toast.info('You are already on the free plan');
      return;
    }

    if (tier.name === 'Enterprise') {
      toast.info('Please contact sales for enterprise pricing');
      return;
    }

    // Simulate upgrade
    upgradePlan(tier.tier, tier.credits);
    toast.success(`Successfully upgraded to ${tier.name} plan!`, {
      description: `${tier.credits.toLocaleString()} credits added to your account`,
    });
  };

  return (
    <PageLoader loadingDuration={2500}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 md:mb-12 text-center"
        >
          <h1 className="text-2xl md:text-4xl mb-2 md:mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
            Billing & Pricing
          </h1>
          <p className="text-sm md:text-base text-[#6B6B6B] max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-sans)' }}>
            Choose the perfect plan for your translation needs
          </p>
          {user && (
            <p className="text-sm text-[#3A3A3A] mt-2" style={{ fontFamily: 'var(--font-sans)' }}>
              Current plan: <span className="font-medium">{user.tier}</span>
            </p>
          )}
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className={`bg-white border rounded-lg p-8 transition-all duration-300 ${
                tier.highlighted
                  ? 'border-black shadow-lg'
                  : 'border-[rgba(0,0,0,0.08)] hover:border-[rgba(0,0,0,0.2)] hover:shadow-md'
              }`}
            >
              {tier.highlighted && (
                <div className="inline-block px-3 py-1 bg-black text-white text-xs rounded-full mb-4" style={{ fontFamily: 'var(--font-sans)' }}>
                  Most Popular
                </div>
              )}
              
              <h3 className="text-2xl mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
                {tier.name}
              </h3>
              
              <div className="mb-4">
                <span className="text-3xl" style={{ fontFamily: 'var(--font-serif)' }}>
                  {tier.price}
                </span>
                {tier.period && (
                  <span className="text-[#6B6B6B] text-sm" style={{ fontFamily: 'var(--font-sans)' }}>
                    {tier.period}
                  </span>
                )}
              </div>

              <p className="text-sm text-[#6B6B6B] mb-6" style={{ fontFamily: 'var(--font-sans)' }}>
                {tier.description}
              </p>

              <button
                onClick={() => handleUpgrade(tier)}
                className={`w-full py-3 rounded-md mb-6 transition-all duration-300 ${
                  tier.highlighted
                    ? 'bg-black text-white hover:bg-[#3A3A3A] hover:-translate-y-0.5 shadow-sm hover:shadow-md'
                    : 'border border-[rgba(0,0,0,0.15)] hover:bg-[#ecfeff]'
                }`}
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {tier.cta}
              </button>

              <ul className="space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span className="text-sm" style={{ fontFamily: 'var(--font-sans)' }}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Additional info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-[#6B6B6B] text-sm" style={{ fontFamily: 'var(--font-sans)' }}>
            All plans include secure file storage and industry-leading translation quality.
            <br />
            Cancel or upgrade anytime with no hidden fees.
          </p>
        </motion.div>
      </div>
    </PageLoader>
  );
}