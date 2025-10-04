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

export async function generateWebsiteAudit(
  businessName: string,
  category: string,
  websiteContent: string,
  reviews: Array<{ text: string; reviewer: string; rating: number }>,
  rating: number
): Promise<AuditData> {
  const reviewText = reviews.map(r => `${r.reviewer} (${r.rating} stars): ${r.text}`).join('\n');
  
  const prompt = `You are a website conversion expert analyzing a business for a personalized outreach campaign.

Business Name: ${businessName}
Category: ${category}
Google Rating: ${rating} stars
Website Content: ${websiteContent || 'No website available'}
Customer Reviews:
${reviewText}

Generate a comprehensive analysis with the following fields:

1. business_summary: A 2-3 sentence summary of the business and their current website situation
2. pain_points: Main website issues affecting conversions (be specific)
3. site_issues: Specific technical/UX problems you notice
4. icebreaker: A specific, personal detail about their business (mention their rating, a specific review quote, years in business, certifications, or unique service)
5. owner_pain_point_1: First pain point tied to lost revenue/missed leads
6. owner_pain_point_2: Second pain point tied to lost revenue/missed leads
7. owner_conversion_benefit_1: Benefit if pain point 1 is resolved
8. owner_conversion_benefit_2: Benefit if pain point 2 is resolved
9. owner_conversion_benefit_3: Additional conversion benefit
10. owner_hook_quote: Emotional quote about ROI from better website
11. hero_heading: Sales-driven heading for their business
12. hero_subheading: Value proposition subheading
13. customer_pain_point_1: Problem their target customers face
14. customer_pain_point_2: Another problem their target customers face
15. customer_conversion_benefit_1: How business solves customer problem 1
16. customer_conversion_benefit_2: How business solves customer problem 2
17. customer_conversion_benefit_3: Additional customer benefit
18. customer_benefit_1: Reason to choose this business
19. customer_benefit_2: Another reason to choose this business
20. customer_benefit_3: Third reason to choose this business
21. process_step_1: First step in their business process
22. process_step_2: Second step in their business process
23. process_step_3: Third step in their business process
24. customer_hook_quote: Brand/ethos quote

Return ONLY a valid JSON object with these exact field names (use underscores). Be specific and personalized based on the actual business data provided.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a website conversion expert who creates personalized, specific analysis based on real business data.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const content = completion.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(content);

    return {
      businessSummary: parsed.business_summary || '',
      painPoints: parsed.pain_points || '',
      siteIssues: parsed.site_issues || '',
      icebreaker: parsed.icebreaker || '',
      ownerPainPoint1: parsed.owner_pain_point_1 || '',
      ownerPainPoint2: parsed.owner_pain_point_2 || '',
      ownerConversionBenefit1: parsed.owner_conversion_benefit_1 || '',
      ownerConversionBenefit2: parsed.owner_conversion_benefit_2 || '',
      ownerConversionBenefit3: parsed.owner_conversion_benefit_3 || '',
      ownerHookQuote: parsed.owner_hook_quote || '',
      heroHeading: parsed.hero_heading || '',
      heroSubheading: parsed.hero_subheading || '',
      customerPainPoint1: parsed.customer_pain_point_1 || '',
      customerPainPoint2: parsed.customer_pain_point_2 || '',
      customerConversionBenefit1: parsed.customer_conversion_benefit_1 || '',
      customerConversionBenefit2: parsed.customer_conversion_benefit_2 || '',
      customerConversionBenefit3: parsed.customer_conversion_benefit_3 || '',
      customerBenefit1: parsed.customer_benefit_1 || '',
      customerBenefit2: parsed.customer_benefit_2 || '',
      customerBenefit3: parsed.customer_benefit_3 || '',
      processStep1: parsed.process_step_1 || '',
      processStep2: parsed.process_step_2 || '',
      processStep3: parsed.process_step_3 || '',
      customerHookQuote: parsed.customer_hook_quote || ''
    };
  } catch (error) {
    console.error('Error generating audit with AI:', error);
    throw error;
  }
}

export async function generateEmailCampaign(
  businessName: string,
  businessNameClean: string,
  category: string,
  ownerFirstName: string,
  icebreaker: string,
  painPoints: string,
  slug: string,
  reviews: Array<{ text: string; reviewer: string; rating: number }>
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
  const demoUrl = `https://nextgensites.net/review/${slug}`;
  const firstName = ownerFirstName || 'there';
  const reviewText = reviews.map(r => `${r.reviewer}: ${r.text}`).join('\n');

  const prompt = `Generate a personalized 6-email outreach campaign for a website redesign service.

Business: ${businessName} (${businessNameClean})
Category: ${category}
Owner First Name: ${firstName}
Icebreaker: ${icebreaker}
Pain Points: ${painPoints}
Demo URL: ${demoUrl}
Customer Reviews:
${reviewText}

CRITICAL RULES:
- Email 1: NO LINK. Professional intro, use icebreaker, point out website issue, end with question
- Email 2: NO LINK. Reference their reputation/reviews, show ROI math, ask about lead tracking
- Email 3: Include demo link, highlight 3 specific improvements based on their business
- Email 4: Include demo link, reference unique aspect from reviews/icebreaker, explain visibility benefit
- Email 5: Include demo link, add urgency, highlight high-impact change
- Email 6: Include demo link, short respectful close

Style: Professional, 5-6 sentences each, conversational, use ${firstName}, sign as Riley.

Return ONLY a valid JSON object with these exact fields:
{
  "subject": "...",
  "personalized_email": "...",
  "subject_follow_up1": "...",
  "follow_up1": "...",
  "subject_follow_up2": "...",
  "follow_up2": "...",
  "subject_follow_up3": "...",
  "follow_up3": "...",
  "subject_follow_up4": "...",
  "follow_up4": "...",
  "subject_follow_up5": "...",
  "follow_up5": "..."
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are an expert email copywriter who creates personalized, conversion-focused email campaigns.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 2500
    });

    const content = completion.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(content);

    return {
      subject: parsed.subject || '',
      personalizedEmail: parsed.personalized_email || '',
      subjectFollowUp1: parsed.subject_follow_up1 || '',
      followUp1: parsed.follow_up1 || '',
      subjectFollowUp2: parsed.subject_follow_up2 || '',
      followUp2: parsed.follow_up2 || '',
      subjectFollowUp3: parsed.subject_follow_up3 || '',
      followUp3: parsed.follow_up3 || '',
      subjectFollowUp4: parsed.subject_follow_up4 || '',
      followUp4: parsed.follow_up4 || '',
      subjectFollowUp5: parsed.subject_follow_up5 || '',
      followUp5: parsed.follow_up5 || ''
    };
  } catch (error) {
    console.error('Error generating email campaign with AI:', error);
    throw error;
  }
}
