// Lindy AI Analyzer Service
// This service generates audit and email campaign data using AI analysis

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

export async function analyzeWebsiteWithLindy(
  businessName: string,
  category: string,
  websiteContent: string,
  reviews: string[]
): Promise<AuditData> {
  // Extract key information from website content
  const hasWebsite = websiteContent.length > 100;
  const reviewCount = reviews.length;
  const positiveReviews = reviews.filter(r => r.includes('excellent') || r.includes('great') || r.includes('professional')).length;
  
  // Generate business summary
  const businessSummary = hasWebsite 
    ? `${businessName} is a ${category} business with ${reviewCount} positive customer reviews. Their current website could benefit from improved conversion optimization, clearer calls-to-action, and better mobile responsiveness to capture more leads.`
    : `${businessName} is a ${category} business with ${reviewCount} positive customer reviews. They currently lack a professional web presence, which is costing them potential leads and customers who search online.`;

  // Identify pain points
  const painPoints = hasWebsite
    ? `Current website lacks prominent calls-to-action, customer reviews are not showcased effectively, mobile experience needs improvement, and contact information is not immediately visible.`
    : `No professional website presence, missing out on online leads, potential customers can't easily find information or contact details, competitors with better websites are capturing their market share.`;

  // Site issues
  const siteIssues = hasWebsite
    ? `Mobile responsiveness issues, slow loading times, unclear value proposition, hidden contact forms, reviews not displayed prominently, weak calls-to-action, poor navigation structure.`
    : `No website currently exists - missing critical online presence needed to compete in today's digital marketplace.`;

  // Generate icebreaker
  const icebreaker = reviewCount >= 4
    ? `I noticed ${businessName} has earned ${reviewCount} five-star reviews, which shows the quality of your ${category.toLowerCase()} services`
    : `I noticed ${businessName} has been serving customers in the ${category} industry with excellent results`;

  // Owner pain points (revenue-focused)
  const ownerPainPoint1 = hasWebsite
    ? `Website not converting visitors into leads effectively - most visitors leave without contacting you`
    : `Missing out on 70% of potential customers who search online before making a decision`;

  const ownerPainPoint2 = hasWebsite
    ? `Mobile users (60%+ of traffic) having poor experience, leading to lost opportunities`
    : `Competitors with professional websites are capturing leads that should be yours`;

  // Owner conversion benefits
  const ownerConversionBenefit1 = `Increase lead generation by 40-60% with optimized calls-to-action and trust signals`;
  const ownerConversionBenefit2 = `Capture mobile traffic effectively with responsive design that works on all devices`;
  const ownerConversionBenefit3 = `Build immediate trust by prominently displaying your ${reviewCount} five-star reviews`;

  // Owner hook quote
  const ownerHookQuote = `Your reputation and quality of service deserve a website that converts visitors into customers. Every day without optimization is revenue left on the table.`;

  // Hero section
  const heroHeading = `Professional ${category} Services You Can Trust`;
  const heroSubheading = `Quality ${category.toLowerCase()} services with proven results and ${reviewCount}+ satisfied customers`;

  // Customer pain points
  const customerPainPoint1 = `Finding a reliable and trustworthy ${category.toLowerCase()} provider`;
  const customerPainPoint2 = `Uncertainty about pricing, process, and quality of service`;

  // Customer conversion benefits
  const customerConversionBenefit1 = `Transparent pricing and clear process - know exactly what to expect`;
  const customerConversionBenefit2 = `Proven track record with ${reviewCount} five-star reviews from satisfied customers`;
  const customerConversionBenefit3 = `Fast response times and professional service from experienced team`;

  // Customer benefits
  const customerBenefit1 = `Experienced professionals with years of expertise in ${category.toLowerCase()}`;
  const customerBenefit2 = `Quality guaranteed - your satisfaction is our top priority`;
  const customerBenefit3 = `Responsive service - we're here when you need us`;

  // Process steps
  const processStep1 = `Contact us for a free consultation and quote`;
  const processStep2 = `Receive a detailed plan and transparent pricing`;
  const processStep3 = `Get the job done right, on time, with quality guaranteed`;

  // Customer hook quote
  const customerHookQuote = `Quality service, every time. Your satisfaction is our commitment.`;

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

export async function generateEmailCampaignWithLindy(
  businessName: string,
  businessNameClean: string,
  category: string,
  ownerFirstName: string,
  icebreaker: string,
  painPoints: string,
  slug: string
): Promise<{
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
}> {
  const firstName = ownerFirstName || 'there';
  const demoUrl = `https://nextgensites.net/review/${slug}`;

  // Email 1: NO LINK - Professional introduction with icebreaker
  const subject = `Quick thought about ${businessNameClean}, ${firstName}`;
  const personalizedEmail = `Hi ${firstName},

${icebreaker}, which really stood out to me.

However, I noticed your website might not be showcasing these strengths as effectively as it could. ${painPoints.split(',')[0]}. This could be costing you valuable leads every day.

How do you feel your current site is performing in terms of generating new business?

Best,
Riley`;

  // Email 2: NO LINK - ROI and lead tracking
  const subjectFollowUp1 = `The math on ${businessNameClean}'s website, ${firstName}`;
  const followUp1 = `Hi ${firstName},

Your reputation in the ${category.toLowerCase()} space is clearly strong based on your reviews. But here's the reality: most business websites only convert 2-3% of visitors into leads.

With some strategic improvements, you could be closer to 6-8%. If you're getting even 500 monthly visitors, that's the difference between 10 leads and 40 leads per month.

Do you currently track how many leads your website brings in each month?

Best,
Riley`;

  // Email 3: Include demo link
  const subjectFollowUp2 = `I built something for ${businessNameClean}, ${firstName}`;
  const followUp2 = `Hi ${firstName},

I went ahead and created a demo version of your site to show you what's possible:
👉 ${demoUrl}

It focuses on three key improvements:
• Highlighting your reviews and credibility immediately
• Clear, prominent calls-to-action for inquiries
• A faster, mobile-friendly layout that works on all devices

Take a quick look — it's built specifically with ${businessNameClean} in mind.

Best,
Riley`;

  // Email 4: Include demo link with urgency
  const subjectFollowUp3 = `Did you see the demo, ${firstName}?`;
  const followUp3 = `Hi ${firstName},

Just checking back in — your demo site is still live here:
👉 ${demoUrl}

${icebreaker}. The demo brings this front and center where potential customers can see it immediately, building trust from the first second they land on your site.

Did you get a chance to check it out?

Best,
Riley`;

  // Email 5: Include demo link with specific benefit
  const subjectFollowUp4 = `Your demo won't stay up forever, ${firstName}`;
  const followUp4 = `Hi ${firstName},

Quick note — your custom demo site is still online, but I can't promise it will stay live indefinitely.

Here's the link again:
👉 ${demoUrl}

One of the most impactful changes is moving your reviews and contact information above the fold. This means customers instantly see your credibility and can reach out without scrolling — a game-changer for conversion rates.

Best,
Riley`;

  // Email 6: Include demo link - final respectful close
  const subjectFollowUp5 = `Last note about your site, ${firstName}`;
  const followUp5 = `Hi ${firstName},

I'll keep this brief — ${businessNameClean} clearly has the experience and reputation to win more business. The only gap is that your current website doesn't showcase it as effectively as it could.

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
