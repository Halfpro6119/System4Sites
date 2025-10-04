import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
});

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

export async function analyzeWebsite(
  businessName: string,
  category: string,
  websiteContent: string,
  reviews: string[]
): Promise<AuditData> {
  const prompt = `You are a website conversion expert analyzing a business website.

Business Name: ${businessName}
Category: ${category}

Website Content Summary:
${websiteContent}

Customer Reviews:
${reviews.join('\n')}

Generate a comprehensive website audit with the following:

1. Business Summary: Brief description of what they do and current website issues
2. Pain Points: Summary of main website issues affecting conversions
3. Site Issues: Specific technical/UX problems identified
4. Icebreaker: A specific personal detail about their business (projects, reviews, certifications, years in service)
5. Owner Pain Points: Two pain points tied to lost revenue/missed leads
6. Owner Conversion Benefits: Three benefits if pain points are resolved
7. Owner Hook Quote: Emotional quote connecting to ROI from better website
8. Hero Heading: Sales-driven heading relevant to their business
9. Hero Subheading: Supporting subheading with value proposition
10. Customer Pain Points: Two problems their target customers face
11. Customer Conversion Benefits: Three ways the business solves customer problems
12. Customer Benefits: Three reasons why customers should choose this business
13. Process Steps: Three steps in their business process
14. Customer Hook Quote: Quote expressing brand/ethos

Focus on how website issues impact sales, conversions, and lead generation. Be specific about mobile usability, CTA clarity, and trust signals.

Return ONLY a JSON object with these exact keys:
{
  "businessSummary": "",
  "painPoints": "",
  "siteIssues": "",
  "icebreaker": "",
  "ownerPainPoint1": "",
  "ownerPainPoint2": "",
  "ownerConversionBenefit1": "",
  "ownerConversionBenefit2": "",
  "ownerConversionBenefit3": "",
  "ownerHookQuote": "",
  "heroHeading": "",
  "heroSubheading": "",
  "customerPainPoint1": "",
  "customerPainPoint2": "",
  "customerConversionBenefit1": "",
  "customerConversionBenefit2": "",
  "customerConversionBenefit3": "",
  "customerBenefit1": "",
  "customerBenefit2": "",
  "customerBenefit3": "",
  "processStep1": "",
  "processStep2": "",
  "processStep3": "",
  "customerHookQuote": ""
}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a website conversion expert. Return only valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0].message.content || '{}';
    return JSON.parse(content);
  } catch (error) {
    console.error('Error analyzing website:', error);
    // Return default values
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
}

export async function generateEmailCampaign(
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
  const prompt = `Generate a personalized 6-part email campaign for a ${category} business.

Business Name: ${businessName}
Clean Business Name: ${businessNameClean}
Owner First Name: ${ownerFirstName}
Icebreaker Detail: ${icebreaker}
Website Issues: ${painPoints}
Demo Slug: ${slug}

Follow these EXACT rules:

Email 1 (Icebreaker): NO LINK. Professional but approachable. Start with the specific icebreaker detail. Gently point out a website issue affecting leads. End with open-ended question about how their site performs.

Email 2 (Value & ROI): NO LINK. Reference their reputation. Share simple math showing how many more leads/revenue they could gain with improved conversions. End with a question about how they currently track online leads.

Email 3 (Demo Reveal): Include personalized demo link https://nextgensites.net/review/${slug}. Highlight 3 key improvements made in demo (mobile layout, reviews, clear calls-to-action). Keep tone professional and concise.

Email 4 (Reinforcement #1): Include link again. Reference something unique about their reviews, history, or team. Explain how demo makes this more visible to customers.

Email 5 (Reinforcement #2): Include link again. Add respectful urgency ("demo may not stay live forever"). Highlight one high-impact change from demo.

Email 6 (Final Check-In): Include link again. Short, respectful close. If not interested, wish them well and compliment their work.

Style: Straightforward, professional, approachable. 5–6 sentences each. Use ${ownerFirstName}, sign as Riley.

Return ONLY a JSON object with these exact keys:
{
  "subject": "Email 1 subject with ${ownerFirstName}",
  "personalized_email": "Email 1 body, NO LINK",
  "subject_follow_up1": "Email 2 subject with ${ownerFirstName}",
  "follow_up1": "Email 2 body, NO LINK",
  "subject_follow_up2": "Email 3 subject with ${ownerFirstName}",
  "follow_up2": "Email 3 body with demo link",
  "subject_follow_up3": "Email 4 subject with ${ownerFirstName}",
  "follow_up3": "Email 4 body with demo link",
  "subject_follow_up4": "Email 5 subject with ${ownerFirstName}",
  "follow_up4": "Email 5 body with demo link",
  "subject_follow_up5": "Email 6 subject with ${ownerFirstName}",
  "follow_up5": "Email 6 body with demo link"
}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an email marketing expert. Return only valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0].message.content || '{}';
    const result = JSON.parse(content);
    
    return {
      subject: result.subject || '',
      personalizedEmail: result.personalized_email || '',
      subjectFollowUp1: result.subject_follow_up1 || '',
      followUp1: result.follow_up1 || '',
      subjectFollowUp2: result.subject_follow_up2 || '',
      followUp2: result.follow_up2 || '',
      subjectFollowUp3: result.subject_follow_up3 || '',
      followUp3: result.follow_up3 || '',
      subjectFollowUp4: result.subject_follow_up4 || '',
      followUp4: result.follow_up4 || '',
      subjectFollowUp5: result.subject_follow_up5 || '',
      followUp5: result.follow_up5 || ''
    };
  } catch (error) {
    console.error('Error generating email campaign:', error);
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
}
