import axios from 'axios';
import * as cheerio from 'cheerio';

export interface EnrichedData {
  ownerName: string;
  ownerEmail: string;
  companyEmail: string;
  linkedin: string;
  facebook: string;
  otherSocials: string;
  googleRating: number;
  reviews: Array<{
    text: string;
    reviewer: string;
    rating: number;
  }>;
}

export async function enrichBusinessData(
  businessName: string,
  website: string,
  address: string
): Promise<EnrichedData> {
  const result: EnrichedData = {
    ownerName: '',
    ownerEmail: '',
    companyEmail: '',
    linkedin: '',
    facebook: '',
    otherSocials: '',
    googleRating: 0,
    reviews: []
  };

  try {
    // Search for owner information
    const searchQuery = `${businessName} owner CEO founder ${address}`;
    const ownerInfo = await searchGoogle(searchQuery);
    result.ownerName = extractOwnerName(ownerInfo);

    // Search for contact information
    const contactQuery = `${businessName} contact email ${address}`;
    const contactInfo = await searchGoogle(contactQuery);
    const emails = extractEmails(contactInfo);
    
    if (emails.length > 0) {
      // Try to identify owner email vs company email
      const ownerEmails = emails.filter(email => 
        email.includes(result.ownerName.toLowerCase().replace(' ', '.')) ||
        email.includes(result.ownerName.toLowerCase().replace(' ', ''))
      );
      
      if (ownerEmails.length > 0) {
        result.ownerEmail = ownerEmails[0];
      } else {
        result.companyEmail = emails[0];
      }
    }

    // Search for social media
    const socialQuery = `${businessName} linkedin facebook instagram twitter`;
    const socialInfo = await searchGoogle(socialQuery);
    const socials = extractSocialMedia(socialInfo);
    result.linkedin = socials.linkedin;
    result.facebook = socials.facebook;
    result.otherSocials = socials.others.join(', ');

    // Search for reviews and ratings
    const reviewQuery = `${businessName} reviews rating ${address}`;
    const reviewInfo = await searchGoogle(reviewQuery);
    const reviewData = extractReviewData(reviewInfo);
    result.googleRating = reviewData.rating;
    result.reviews = reviewData.reviews;

  } catch (error) {
    console.error('Error enriching business data:', error);
  }

  return result;
}

async function searchGoogle(query: string): Promise<string> {
  try {
    // Note: In production, you'd want to use Google Custom Search API
    // For now, we'll simulate with a basic search
    const response = await axios.get(`https://www.google.com/search?q=${encodeURIComponent(query)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });

    return response.data;
  } catch (error) {
    console.error('Error searching Google:', error);
    return '';
  }
}

function extractOwnerName(html: string): string {
  const $ = cheerio.load(html);
  const text = $.text();
  
  // Look for common patterns
  const patterns = [
    /(?:owner|founder|ceo|president)[\s:]+([A-Z][a-z]+\s+[A-Z][a-z]+)/gi,
    /([A-Z][a-z]+\s+[A-Z][a-z]+)[\s,]+(?:owner|founder|ceo|president)/gi
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  return '';
}

function extractEmails(html: string): string[] {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const matches = html.match(emailRegex) || [];
  
  // Filter out common non-business emails
  return matches.filter(email => 
    !email.includes('example.com') &&
    !email.includes('test.com') &&
    !email.includes('google.com') &&
    !email.includes('facebook.com')
  );
}

function extractSocialMedia(html: string): { linkedin: string; facebook: string; others: string[] } {
  const $ = cheerio.load(html);
  const result = {
    linkedin: '',
    facebook: '',
    others: [] as string[]
  };

  $('a[href]').each((_, elem) => {
    const href = $(elem).attr('href') || '';
    
    if (href.includes('linkedin.com/') && !result.linkedin) {
      result.linkedin = href;
    } else if (href.includes('facebook.com/') && !result.facebook) {
      result.facebook = href;
    } else if (href.includes('instagram.com/') || href.includes('twitter.com/') || href.includes('x.com/')) {
      result.others.push(href);
    }
  });

  return result;
}

function extractReviewData(html: string): { rating: number; reviews: Array<{ text: string; reviewer: string; rating: number }> } {
  const $ = cheerio.load(html);
  const result = {
    rating: 0,
    reviews: [] as Array<{ text: string; reviewer: string; rating: number }>
  };

  // Try to extract rating
  const ratingText = $.text();
  const ratingMatch = ratingText.match(/(\d+\.?\d*)\s*(?:stars?|out of 5|rating)/i);
  if (ratingMatch) {
    result.rating = parseFloat(ratingMatch[1]);
  }

  // Try to extract reviews (this is simplified)
  $('.review, [class*="review"]').slice(0, 5).each((_, elem) => {
    const text = $(elem).text().trim();
    if (text.length > 20) {
      result.reviews.push({
        text: text.substring(0, 200),
        reviewer: 'Customer',
        rating: 5
      });
    }
  });

  return result;
}
