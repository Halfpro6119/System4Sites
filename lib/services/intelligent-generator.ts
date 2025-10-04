// Intelligent content generator that creates unique, personalized content
// based on business data without requiring external API calls

export interface AuditData {
  businessSummary: string;
  painPoints: string;
  siteIssues: string;
  icebreaker: string;
  ownerPainPoint1: string;
  ownerPainPoint2: string;
  ownerConversionBenefit1: string;
  ownerConversionBenefit2: string;
  ownerConversionBenefit3: string;
  ownerHookQuote: string;
  heroHeading: string;
  heroSubheading: string;
  customerPainPoint1: string;
  customerPainPoint2: string;
  customerConversionBenefit1: string;
  customerConversionBenefit2: string;
  customerConversionBenefit3: string;
  customerBenefit1: string;
  customerBenefit2: string;
  customerBenefit3: string;
  processStep1: string;
  processStep2: string;
  processStep3: string;
  customerHookQuote: string;
}

interface Review {
  text: string;
  reviewer: string;
  rating: number;
}

export function generateWebsiteAudit(
  businessName: string,
  category: string,
  websiteContent: string,
  reviews: Review[],
  rating: number
): AuditData {
  const hasWebsite = websiteContent.length > 100;
  const reviewCount = reviews.length;
  
  // Extract specific details from reviews for personalization
  const reviewHighlights = reviews.map(r => {
    if (r.text.includes('professional')) return 'professionalism';
    if (r.text.includes('timely') || r.text.includes('fast')) return 'quick response';
    if (r.text.includes('quality')) return 'quality work';
    if (r.text.includes('exceeded')) return 'exceeding expectations';
    return 'excellent service';
  });

  // Generate unique business summary
  const businessSummary = hasWebsite
    ? `${businessName} is a ${category} business with an impressive ${rating}-star rating and ${reviewCount} positive customer reviews. While they have a web presence, their current site isn't optimized for conversion - reviews aren't prominently displayed, calls-to-action are unclear, and the mobile experience could be significantly improved to capture more leads.`
    : `${businessName} is a highly-rated ${category} business (${rating} stars, ${reviewCount} reviews) that's missing a critical opportunity. Without a professional website, they're losing potential customers who search online before making decisions. In today's digital-first world, this gap is costing them significant revenue.`;

  // Generate specific pain points
  const painPoints = hasWebsite
    ? `Current website buries customer reviews (${reviewCount} five-star reviews should be front and center), lacks clear contact CTAs, has poor mobile responsiveness, and doesn't showcase the ${rating}-star rating that builds immediate trust. Visitors leave without converting because the value proposition isn't immediately clear.`
    : `No professional online presence means missing 70%+ of potential customers who research online first. Competitors with websites are capturing leads that should belong to ${businessName}. Their ${rating}-star rating and ${reviewCount} glowing reviews are invisible to people searching for ${category.toLowerCase()} services.`;

  // Generate site issues
  const siteIssues = hasWebsite
    ? `Mobile responsiveness problems (60% of traffic is mobile), slow page load times, reviews hidden below the fold, contact information requires scrolling, weak or missing calls-to-action, no trust signals visible immediately, poor navigation structure making it hard to find key information.`
    : `Complete absence of professional web presence - no way for customers to find information, read reviews, or contact the business online. This is a critical gap in today's market where 93% of buying decisions start with online research.`;

  // Generate personalized icebreaker using actual review data
  const icebreaker = reviewCount >= 4
    ? `I noticed ${businessName} has earned ${reviewCount} five-star reviews, with customers specifically praising your ${reviewHighlights[0]} and ${reviewHighlights[1] || 'dedication'}`
    : `I came across ${businessName} and was impressed by your ${rating}-star rating in the ${category} industry`;

  // Owner pain points (revenue-focused)
  const ownerPainPoint1 = hasWebsite
    ? `Your website isn't converting visitors into leads - most people visit, don't see your ${reviewCount} five-star reviews immediately, and leave without contacting you`
    : `You're invisible to 70% of potential customers who search online before choosing a ${category.toLowerCase()} provider`;

  const ownerPainPoint2 = hasWebsite
    ? `Mobile users (60%+ of your traffic) are having a poor experience, leading to lost opportunities every single day`
    : `Competitors with professional websites are capturing the leads and customers that should be yours, simply because they show up online`;

  // Owner conversion benefits
  const ownerConversionBenefit1 = `Increase lead generation by 40-60% by prominently displaying your ${rating}-star rating and ${reviewCount} customer reviews`;
  const ownerConversionBenefit2 = `Capture mobile traffic effectively with a responsive design that works flawlessly on all devices`;
  const ownerConversionBenefit3 = `Build immediate trust with prominent social proof - your ${reviewCount} five-star reviews become your best salespeople`;

  // Owner hook quote
  const ownerHookQuote = `Your ${rating}-star rating and ${reviewCount} glowing reviews prove you deliver exceptional service. Your website should convert visitors into customers at the same high level. Every day without optimization is revenue left on the table.`;

  // Hero section
  const heroHeading = `${category} Services You Can Trust`;
  const heroSubheading = `${rating}-star rated ${category.toLowerCase()} services with ${reviewCount}+ satisfied customers`;

  // Customer pain points
  const customerPainPoint1 = `Finding a reliable, trustworthy ${category.toLowerCase()} provider they can count on`;
  const customerPainPoint2 = `Uncertainty about pricing, process, timeline, and quality of service before committing`;

  // Customer conversion benefits
  const customerConversionBenefit1 = `Transparent pricing and clear process - you'll know exactly what to expect from start to finish`;
  const customerConversionBenefit2 = `Proven track record with ${reviewCount} five-star reviews from real, satisfied customers`;
  const customerConversionBenefit3 = `Fast, professional service from an experienced team with a ${rating}-star rating`;

  // Customer benefits
  const customerBenefit1 = `${rating}-star rated service with proven expertise in ${category.toLowerCase()}`;
  const customerBenefit2 = `Quality guaranteed - your complete satisfaction is our top priority`;
  const customerBenefit3 = `Responsive, reliable service - we're here when you need us`;

  // Process steps
  const processStep1 = `Contact us for a free consultation and personalized quote`;
  const processStep2 = `Receive a detailed plan with transparent pricing and timeline`;
  const processStep3 = `Get the job done right, on time, with quality guaranteed`;

  // Customer hook quote
  const customerHookQuote = `${rating}-star rated service, every time. Your satisfaction is our commitment.`;

  return {
    businessSummary,
    painPoints,
    siteIssues,
    icebreaker,
    ownerPainPoint1,
    ownerPainPoint2,
    ownerConversionBenefit1,
    ownerConversionBenefit2,
    ownerConversionBenefit3,
    ownerHookQuote,
    heroHeading,
    heroSubheading,
    customerPainPoint1,
    customerPainPoint2,
    customerConversionBenefit1,
    customerConversionBenefit2,
    customerConversionBenefit3,
    customerBenefit1,
    customerBenefit2,
    customerBenefit3,
    processStep1,
    processStep2,
    processStep3,
    customerHookQuote
  };
}

export function generateEmailCampaign(
  businessName: string,
  businessNameClean: string,
  category: string,
  ownerFirstName: string,
  icebreaker: string,
  painPoints: string,
  slug: string,
  reviews: Review[]
): {
  subject: string;
  personalizedEmail: string;
  subjectFollowUp1: string;
  followUp1: string;
  subjectFollowUp2: string;
  followUp2: string;
  subjectFollowUp3: string;
  followUp3: string;
  subjectFollowUp4: string;
  followUp4: string;
  subjectFollowUp5: string;
  followUp5: string;
} {
  const firstName = ownerFirstName || 'there';
  const demoUrl = `https://nextgensites.net/review/${slug}`;
  const reviewCount = reviews.length;

  // Extract a specific detail from first review
  const reviewDetail = reviews[0]?.text.includes('professional') 
    ? 'professionalism' 
    : reviews[0]?.text.includes('quality')
    ? 'quality of work'
    : 'excellent service';

  // Email 1: NO LINK - Professional introduction
  const subject = `Quick thought about ${businessNameClean}, ${firstName}`;
  const personalizedEmail = `Hi ${firstName},

${icebreaker}, which really caught my attention.

However, I noticed your website might not be showcasing these strengths as effectively as it could. ${painPoints.split('.')[0]}. This could be costing you valuable leads every single day.

How do you feel your current site is performing in terms of generating new business?

Best,
Riley`;

  // Email 2: NO LINK - ROI and conversion math
  const subjectFollowUp1 = `The numbers on ${businessNameClean}'s website, ${firstName}`;
  const followUp1 = `Hi ${firstName},

Your reputation in the ${category.toLowerCase()} space is clearly strong - ${reviewCount} five-star reviews speak volumes. But here's the reality: most business websites only convert 2-3% of visitors into leads.

With strategic improvements, you could be closer to 6-8%. If you're getting even 500 monthly visitors, that's the difference between 10 leads and 40 leads per month. That's real revenue.

Do you currently track how many leads your website generates each month?

Best,
Riley`;

  // Email 3: Include demo link
  const subjectFollowUp2 = `I built something for ${businessNameClean}, ${firstName}`;
  const followUp2 = `Hi ${firstName},

I went ahead and created a demo version of your site to show you what's possible:
👉 ${demoUrl}

It focuses on three key improvements:
• Your ${reviewCount} five-star reviews displayed prominently to build immediate trust
• Clear, compelling calls-to-action that drive inquiries
• A fast, mobile-optimized layout that works perfectly on all devices

Take a quick look — it's built specifically with ${businessNameClean} in mind.

Best,
Riley`;

  // Email 4: Include demo link with specific detail
  const subjectFollowUp3 = `Did you see the demo, ${firstName}?`;
  const followUp3 = `Hi ${firstName},

Just checking back in — your demo site is still live here:
👉 ${demoUrl}

${icebreaker}. The demo brings this front and center where potential customers can see it immediately, building trust from the first second they land on your site.

Customers specifically mention your ${reviewDetail} - that should be the first thing visitors see.

Did you get a chance to check it out?

Best,
Riley`;

  // Email 5: Include demo link with urgency
  const subjectFollowUp4 = `Your demo won't stay up forever, ${firstName}`;
  const followUp4 = `Hi ${firstName},

Quick note — your custom demo site is still online, but I can't promise it will stay live indefinitely.

Here's the link again:
👉 ${demoUrl}

One of the most impactful changes is moving your ${reviewCount} five-star reviews and contact information above the fold. This means customers instantly see your credibility and can reach out without scrolling — a game-changer for conversion rates.

Best,
Riley`;

  // Email 6: Include demo link - final respectful close
  const subjectFollowUp5 = `Last note about your site, ${firstName}`;
  const followUp5 = `Hi ${firstName},

I'll keep this brief — ${businessNameClean} clearly has the experience and reputation to win more business. Your ${reviewCount} five-star reviews prove that. The only gap is that your current website doesn't showcase it as effectively as it could.

If you're curious, here's the demo one last time:
👉 ${demoUrl}

If now's not the right time, no problem at all. Just wanted to make sure you had the opportunity to see what's possible.

Best,
Riley`;

  return {
    subject,
    personalizedEmail,
    subjectFollowUp1,
    followUp1,
    subjectFollowUp2,
    followUp2,
    subjectFollowUp3,
    followUp3,
    subjectFollowUp4,
    followUp4,
    subjectFollowUp5,
    followUp5
  };
}
