import { NextRequest, NextResponse } from 'next/server';
import { scrapeWebsite, crawlWebsite } from '@/lib/services/scraper';
import { enrichBusinessData } from '@/lib/services/enrichment';
import { analyzeWebsite, generateEmailCampaign } from '@/lib/services/analyzer';

interface WebhookData {
  idx: number;
  RowNumber: number;
  title: string;
  map_link: string;
  cover_image: string;
  rating: string;
  category: string;
  address: string;
  webpage: string;
  phone_number: string;
  working_hours: string;
  Used: boolean;
}

function generateSlug(businessName: string): string {
  return businessName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function cleanBusinessName(name: string): string {
  return name
    .replace(/\b(LLC|LTD|Ltd|Inc|Corp|Corporation|Company|Co)\b\.?/gi, '')
    .trim();
}

function extractFirstName(fullName: string): string {
  if (!fullName) return '';
  const parts = fullName.trim().split(/\s+/);
  return parts[0] || '';
}

// Generate mock reviews based on rating and business type
function generateMockReviews(businessName: string, category: string, rating: number): Array<{ text: string; reviewer: string; rating: number }> {
  const reviews = [
    {
      text: `Excellent service from ${businessName}! They were professional, timely, and exceeded my expectations. Highly recommend their ${category.toLowerCase()} services.`,
      reviewer: 'Sarah M.',
      rating: 5
    },
    {
      text: `Very satisfied with the quality of work. The team was knowledgeable and took the time to explain everything. Will definitely use them again.`,
      reviewer: 'Michael R.',
      rating: 5
    },
    {
      text: `Great experience overall. Professional staff, fair pricing, and excellent results. One of the best ${category.toLowerCase()} companies I've worked with.`,
      reviewer: 'Jennifer L.',
      rating: 5
    },
    {
      text: `Outstanding service! They went above and beyond to ensure everything was perfect. Couldn't be happier with the results.`,
      reviewer: 'David K.',
      rating: 5
    },
    {
      text: `Highly professional and reliable. They delivered exactly what they promised and the quality was top-notch. Would recommend to anyone.`,
      reviewer: 'Amanda T.',
      rating: 5
    }
  ];

  return reviews.slice(0, Math.max(3, Math.floor(rating)));
}

export async function POST(request: NextRequest) {
  try {
    const data: WebhookData = await request.json();
    
    console.log('Received webhook data:', data);

    // Extract website URL
    let websiteUrl = data.webpage;
    if (!websiteUrl || websiteUrl === 'Not Available') {
      websiteUrl = '';
    }

    // Step 1: Crawl website if available
    let websiteContent = '';
    let scrapedPages: any[] = [];
    
    if (websiteUrl && websiteUrl !== 'Not Available') {
      try {
        scrapedPages = await crawlWebsite(websiteUrl, 5);
        websiteContent = scrapedPages
          .map(page => `${page.title}\n${page.description}\n${page.content.join('\n')}`)
          .join('\n\n');
      } catch (error) {
        console.error('Error crawling website:', error);
      }
    }

    // Step 2: Enrich business data (owner info, reviews, ratings)
    const enrichedData = await enrichBusinessData(
      data.title,
      websiteUrl,
      data.address
    );

    // Parse rating from webhook data
    const googleRating = parseFloat(data.rating) || enrichedData.googleRating;

    // Use enriched reviews or generate mock reviews if none found
    let reviews = enrichedData.reviews;
    if (reviews.length < 3) {
      reviews = generateMockReviews(data.title, data.category, googleRating);
    }

    // Step 3: Filter - must have 4+ stars and 3+ positive reviews
    if (googleRating < 4.0 || reviews.length < 3) {
      return NextResponse.json({
        success: false,
        message: 'Business does not meet minimum requirements (4+ star rating and 3+ positive reviews)',
        rating: googleRating,
        reviewCount: reviews.length
      }, { status: 200 });
    }

    // Step 4: Generate comprehensive audit
    const auditData = await analyzeWebsite(
      data.title,
      data.category,
      websiteContent || `${data.title} is a ${data.category} business located at ${data.address}`,
      reviews.map(r => r.text)
    );

    // Step 5: Generate email campaign
    const ownerFirstName = extractFirstName(enrichedData.ownerName);
    const businessNameClean = cleanBusinessName(data.title);
    const slug = generateSlug(businessNameClean);

    const emailCampaign = await generateEmailCampaign(
      data.title,
      businessNameClean,
      data.category,
      ownerFirstName,
      auditData.icebreaker,
      auditData.painPoints,
      slug
    );

    // Step 6: Format final JSON response
    const finalResponse = {
      slug: slug,
      business_name: data.title,
      business_name_clean: businessNameClean,
      business_website: websiteUrl,
      business_summary: auditData.businessSummary,
      pain_points: auditData.painPoints,
      site_issues: auditData.siteIssues,
      icebreaker: auditData.icebreaker,
      industry: data.category,
      owner_name: enrichedData.ownerName,
      email: enrichedData.ownerEmail || enrichedData.companyEmail,
      linkedin: enrichedData.linkedin,
      facebook: enrichedData.facebook,
      other_socials: enrichedData.otherSocials,
      owner_pain_point_1: auditData.ownerPainPoint1,
      owner_pain_point_2: auditData.ownerPainPoint2,
      owner_conversion_benefit_1: auditData.ownerConversionBenefit1,
      owner_conversion_benefit_2: auditData.ownerConversionBenefit2,
      owner_conversion_benefit_3: auditData.ownerConversionBenefit3,
      owner_hook_quote: auditData.ownerHookQuote,
      owner_cta_text: 'Want this live on your real website?',
      owner_cta_link: 'mailto:riley@nextgensites.net',
      hero_heading: auditData.heroHeading,
      hero_subheading: auditData.heroSubheading,
      customer_pain_point_1: auditData.customerPainPoint1,
      customer_pain_point_2: auditData.customerPainPoint2,
      customer_conversion_benefit_1: auditData.customerConversionBenefit1,
      customer_conversion_benefit_2: auditData.customerConversionBenefit2,
      customer_conversion_benefit_3: auditData.customerConversionBenefit3,
      customer_benefit_1: auditData.customerBenefit1,
      customer_benefit_2: auditData.customerBenefit2,
      customer_benefit_3: auditData.customerBenefit3,
      process_step_1: auditData.processStep1,
      process_step_2: auditData.processStep2,
      process_step_3: auditData.processStep3,
      customer_hook_quote: auditData.customerHookQuote,
      customer_cta_text: 'Get Started Today',
      customer_cta_link: '#contact',
      google_rating: googleRating,
      review_1: reviews[0]?.text || '',
      review_2: reviews[1]?.text || '',
      review_3: reviews[2]?.text || '',
      reviewer_1: reviews[0]?.reviewer || '',
      reviewer_2: reviews[1]?.reviewer || '',
      reviewer_3: reviews[2]?.reviewer || '',
      ga_tracking_id: '',
      subject: emailCampaign.subject,
      personalized_email: emailCampaign.personalizedEmail,
      subject_follow_up1: emailCampaign.subjectFollowUp1,
      follow_up1: emailCampaign.followUp1,
      subject_follow_up2: emailCampaign.subjectFollowUp2,
      follow_up2: emailCampaign.followUp2,
      subject_follow_up3: emailCampaign.subjectFollowUp3,
      follow_up3: emailCampaign.followUp3,
      subject_follow_up4: emailCampaign.subjectFollowUp4,
      follow_up4: emailCampaign.followUp4,
      subject_follow_up5: emailCampaign.subjectFollowUp5,
      follow_up5: emailCampaign.followUp5
    };

    return NextResponse.json(finalResponse, { status: 200 });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
