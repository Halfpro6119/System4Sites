// Lindy AI Analyzer Service
// This service uses Lindy's AI capabilities to generate audit and email campaign data

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
  const lindyApiKey = process.env.LINDY_API_KEY;
  const lindyAgentId = process.env.LINDY_AGENT_ID;

  if (!lindyApiKey || !lindyAgentId) {
    console.warn('Lindy API credentials not configured, using fallback data');
    return getFallbackAuditData(businessName, category);
  }

  try {
    const prompt = `Analyze this business and generate a comprehensive website audit:

Business Name: ${businessName}
Category: ${category}
Website Content: ${websiteContent}
Customer Reviews: ${reviews.join('\n')}

Generate:
1. Business Summary (brief description and current website issues)
2. Pain Points (main website issues affecting conversions)
3. Site Issues (specific technical/UX problems)
4. Icebreaker (specific detail about their business - projects, reviews, certifications, years)
5. Owner Pain Points (2 pain points tied to lost revenue/missed leads)
6. Owner Conversion Benefits (3 benefits if pain points resolved)
7. Owner Hook Quote (emotional quote about ROI from better website)
8. Hero Heading (sales-driven heading for their business)
9. Hero Subheading (value proposition)
10. Customer Pain Points (2 problems their target customers face)
11. Customer Conversion Benefits (3 ways business solves customer problems)
12. Customer Benefits (3 reasons to choose this business)
13. Process Steps (3 steps in their business process)
14. Customer Hook Quote (brand/ethos quote)

Focus on how website issues impact sales, conversions, and lead generation.`;

    const response = await fetch('https://api.lindy.ai/v1/agents/run', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lindyApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        agent_id: lindyAgentId,
        message: prompt,
        response_format: 'json'
      })
    });

    if (!response.ok) {
      throw new Error(`Lindy API error: ${response.statusText}`);
    }

    const data = await response.json();
    return parseAuditDataFromLindy(data);
  } catch (error) {
    console.error('Error using Lindy AI:', error);
    return getFallbackAuditData(businessName, category);
  }
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
  const lindyApiKey = process.env.LINDY_API_KEY;
  const lindyAgentId = process.env.LINDY_AGENT_ID;

  if (!lindyApiKey || !lindyAgentId) {
    console.warn('Lindy API credentials not configured, using fallback emails');
    return getFallbackEmailCampaign(businessName, businessNameClean, category, ownerFirstName, icebreaker, painPoints, slug);
  }

  try {
    const prompt = `Generate a personalized 6-part email campaign:

Business: ${businessName} (${businessNameClean})
Category: ${category}
Owner First Name: ${ownerFirstName}
Icebreaker: ${icebreaker}
Pain Points: ${painPoints}
Demo Slug: ${slug}

RULES:
- Email 1: NO LINK. Professional, start with icebreaker, point out website issue, end with question
- Email 2: NO LINK. Reference reputation, show ROI math, ask about lead tracking
- Email 3: Include demo link https://nextgensites.net/review/${slug}, highlight 3 improvements
- Email 4: Include demo link, reference unique aspect, explain visibility
- Email 5: Include demo link, add urgency, highlight high-impact change
- Email 6: Include demo link, short respectful close

Style: Professional, 5-6 sentences each, use ${ownerFirstName}, sign as Riley.`;

    const response = await fetch('https://api.lindy.ai/v1/agents/run', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lindyApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        agent_id: lindyAgentId,
        message: prompt,
        response_format: 'json'
      })
    });

    if (!response.ok) {
      throw new Error(`Lindy API error: ${response.statusText}`);
    }

    const data = await response.json();
    return parseEmailCampaignFromLindy(data);
  } catch (error) {
    console.error('Error using Lindy AI:', error);
    return getFallbackEmailCampaign(businessName, businessNameClean, category, ownerFirstName, icebreaker, painPoints, slug);
  }
}

function parseAuditDataFromLindy(data: any): AuditData {
  // Parse Lindy AI response and extract audit data
  const content = data.response || data.message || data;
  
  if (typeof content === 'object') {
    return {
      businessSummary: content.businessSummary || content.business_summary || '',
      painPoints: content.painPoints || content.pain_points || '',
      siteIssues: content.siteIssues || content.site_issues || '',
      icebreaker: content.icebreaker || '',
      ownerPainPoint1: content.ownerPainPoint1 || content.owner_pain_point_1 || '',
      ownerPainPoint2: content.ownerPainPoint2 || content.owner_pain_point_2 || '',
      ownerConversionBenefit1: content.ownerConversionBenefit1 || content.owner_conversion_benefit_1 || '',
      ownerConversionBenefit2: content.ownerConversionBenefit2 || content.owner_conversion_benefit_2 || '',
      ownerConversionBenefit3: content.ownerConversionBenefit3 || content.owner_conversion_benefit_3 || '',
      ownerHookQuote: content.ownerHookQuote || content.owner_hook_quote || '',
      heroHeading: content.heroHeading || content.hero_heading || '',
      heroSubheading: content.heroSubheading || content.hero_subheading || '',
      customerPainPoint1: content.customerPainPoint1 || content.customer_pain_point_1 || '',
      customerPainPoint2: content.customerPainPoint2 || content.customer_pain_point_2 || '',
      customerConversionBenefit1: content.customerConversionBenefit1 || content.customer_conversion_benefit_1 || '',
      customerConversionBenefit2: content.customerConversionBenefit2 || content.customer_conversion_benefit_2 || '',
      customerConversionBenefit3: content.customerConversionBenefit3 || content.customer_conversion_benefit_3 || '',
      customerBenefit1: content.customerBenefit1 || content.customer_benefit_1 || '',
      customerBenefit2: content.customerBenefit2 || content.customer_benefit_2 || '',
      customerBenefit3: content.customerBenefit3 || content.customer_benefit_3 || '',
      processStep1: content.processStep1 || content.process_step_1 || '',
      processStep2: content.processStep2 || content.process_step_2 || '',
      processStep3: content.processStep3 || content.process_step_3 || '',
      customerHookQuote: content.customerHookQuote || content.customer_hook_quote || ''
    };
  }
  
  return getFallbackAuditData('', '');
}

function parseEmailCampaignFromLindy(data: any): any {
  const content = data.response || data.message || data;
  
  if (typeof content === 'object') {
    return {
      subject: content.subject || '',
      personalizedEmail: content.personalized_email || content.personalizedEmail || '',
      subjectFollowUp1: content.subject_follow_up1 || content.subjectFollowUp1 || '',
      followUp1: content.follow_up1 || content.followUp1 || '',
      subjectFollowUp2: content.subject_follow_up2 || content.subjectFollowUp2 || '',
      followUp2: content.follow_up2 || content.followUp2 || '',
      subjectFollowUp3: content.subject_follow_up3 || content.subjectFollowUp3 || '',
      followUp3: content.follow_up3 || content.followUp3 || '',
      subjectFollowUp4: content.subject_follow_up4 || content.subjectFollowUp4 || '',
      followUp4: content.follow_up4 || content.followUp4 || '',
      subjectFollowUp5: content.subject_follow_up5 || content.subjectFollowUp5 || '',
      followUp5: content.follow_up5 || content.followUp5 || ''
    };
  }
  
  return getFallbackEmailCampaign('', '', '', '', '', '', '');
}

function getFallbackAuditData(businessName: string, category: string): AuditData {
  return {
    businessSummary: `${businessName} is a ${category} business.`,
    painPoints: 'Website needs improvement in conversion optimization.',
    siteIssues: 'Mobile responsiveness and CTA clarity need attention.',
    icebreaker: `I noticed ${businessName} has been serving customers in the ${category} industry.`,
    ownerPainPoint1: 'Website not converting visitors into leads effectively',
    ownerPainPoint2: 'Missing clear calls-to-action and trust signals',
    ownerConversionBenefit1: 'Increase lead generation by 40-60%',
    ownerConversionBenefit2: 'Improve mobile user experience',
    ownerConversionBenefit3: 'Build trust with prominent reviews',
    ownerHookQuote: 'Your reputation deserves a website that converts.',
    heroHeading: `Professional ${category} Services You Can Trust`,
    heroSubheading: 'Quality service with proven results',
    customerPainPoint1: 'Finding a reliable service provider',
    customerPainPoint2: 'Uncertainty about quality and pricing',
    customerConversionBenefit1: 'Transparent pricing and process',
    customerConversionBenefit2: 'Proven track record with reviews',
    customerConversionBenefit3: 'Fast response and professional service',
    customerBenefit1: 'Experienced professionals',
    customerBenefit2: 'Quality guaranteed',
    customerBenefit3: 'Customer satisfaction focused',
    processStep1: 'Contact us for a consultation',
    processStep2: 'Receive a detailed quote',
    processStep3: 'Get the job done right',
    customerHookQuote: 'Quality service, every time.'
  };
}

function getFallbackEmailCampaign(
  businessName: string,
  businessNameClean: string,
  category: string,
  ownerFirstName: string,
  icebreaker: string,
  painPoints: string,
  slug: string
): any {
  return {
    subject: `Your ${category} business caught my attention, ${ownerFirstName}`,
    personalizedEmail: `Hi ${ownerFirstName},\n\nI came across ${businessNameClean} and was impressed by your work in the ${category} industry. ${icebreaker}\n\nHowever, I noticed your website might not be showcasing your strengths as effectively as it could. This could be costing you valuable leads.\n\nHow do you feel your current site is performing in terms of generating new business?\n\nBest,\nRiley`,
    subjectFollowUp1: `Quick thought on ${businessNameClean}, ${ownerFirstName}`,
    followUp1: `Hi ${ownerFirstName},\n\nYour reputation in the ${category} space is strong. But most business websites only convert 2-3% of visitors into leads.\n\nWith some strategic improvements, you could be closer to 6-8%. If you're getting even 500 monthly visitors, that could mean 25-30 extra leads.\n\nDo you currently track how many leads your site brings in?\n\nBest,\nRiley`,
    subjectFollowUp2: `I built a demo site for ${businessNameClean}, ${ownerFirstName}`,
    followUp2: `Hi ${ownerFirstName},\n\nI went ahead and created a demo version of your site:\n👉 https://nextgensites.net/review/${slug}\n\nIt focuses on:\n- Highlighting your reviews and credibility up front\n- Clear calls-to-action for inquiries\n- A faster, mobile-friendly layout\n\nTake a quick look — it's built with your business in mind.\n\nBest,\nRiley`,
    subjectFollowUp3: `Did you get a chance to see your demo, ${ownerFirstName}?`,
    followUp3: `Hi ${ownerFirstName},\n\nJust checking back in — your demo site is still live here:\n👉 https://nextgensites.net/review/${slug}\n\n${icebreaker} The demo brings this to the forefront where customers can see it immediately.\n\nDid you get a chance to check it out?\n\nBest,\nRiley`,
    subjectFollowUp4: `Your demo is still up, ${ownerFirstName}`,
    followUp4: `Hi ${ownerFirstName},\n\nQuick note — your custom site is still online, but I can't promise it will stay live forever.\n\nHere's the link again:\n👉 https://nextgensites.net/review/${slug}\n\nOne of the most impactful changes is moving reviews and contact info above the fold, so customers instantly see your credibility.\n\nBest,\nRiley`,
    subjectFollowUp5: `Final check-in about your site, ${ownerFirstName}`,
    followUp5: `Hi ${ownerFirstName},\n\nI'll keep this brief — ${businessNameClean} clearly has the experience to win more business. The only gap is that your current site doesn't showcase it as well as it could.\n\nIf you're curious, here's the demo again:\n👉 https://nextgensites.net/review/${slug}\n\nIf now's not the right time, no problem. Just wanted to make sure you had the option.\n\nBest,\nRiley`
  };
}
