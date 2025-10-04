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
    console.log(`Enriching data for: ${businessName}`);
    
    // Strategy 1: Scrape the business website if available
    if (website && website !== 'Not Available') {
      console.log(`Scraping website: ${website}`);
      const websiteData = await scrapeWebsite(website);
      
      if (websiteData.ownerName) {
        result.ownerName = cleanName(websiteData.ownerName);
        console.log(`Found owner name from website: ${result.ownerName}`);
      }
      if (websiteData.emails.length > 0) {
        result.companyEmail = websiteData.emails[0];
        console.log(`Found company email: ${result.companyEmail}`);
        // Try to find owner email
        const ownerEmail = findOwnerEmail(websiteData.emails, result.ownerName);
        if (ownerEmail) {
          result.ownerEmail = ownerEmail;
          console.log(`Found owner email: ${result.ownerEmail}`);
        }
      }
      if (websiteData.linkedin) {
        result.linkedin = websiteData.linkedin;
        console.log(`Found LinkedIn: ${result.linkedin}`);
      }
      if (websiteData.facebook) {
        result.facebook = websiteData.facebook;
        console.log(`Found Facebook: ${result.facebook}`);
      }
      if (websiteData.otherSocials.length > 0) {
        result.otherSocials = websiteData.otherSocials.join(', ');
      }
    }

    // Strategy 2: Search LinkedIn for company page and owner
    if (!result.ownerName || !result.linkedin) {
      console.log('Searching LinkedIn...');
      const linkedinData = await searchLinkedIn(businessName, address);
      if (linkedinData.ownerName && !result.ownerName) {
        result.ownerName = cleanName(linkedinData.ownerName);
        console.log(`Found owner name from LinkedIn: ${result.ownerName}`);
      }
      if (linkedinData.linkedin && !result.linkedin) {
        result.linkedin = linkedinData.linkedin;
        console.log(`Found LinkedIn from search: ${result.linkedin}`);
      }
    }

    // Strategy 3: Search for business on social media directories
    if (!result.facebook) {
      console.log('Searching for Facebook page...');
      const facebookUrl = await searchFacebook(businessName, address);
      if (facebookUrl) {
        result.facebook = facebookUrl;
        console.log(`Found Facebook from search: ${result.facebook}`);
      }
    }

    // Strategy 4: Use Hunter.io-style email pattern guessing
    if (!result.ownerEmail && result.ownerName && website) {
      console.log('Generating potential owner email...');
      result.ownerEmail = generateOwnerEmail(result.ownerName, website);
      console.log(`Generated owner email: ${result.ownerEmail}`);
    }

    // Strategy 5: Extract from business registration databases (if available)
    if (!result.ownerName) {
      console.log('Searching business registries...');
      const registryData = await searchBusinessRegistry(businessName, address);
      if (registryData.ownerName) {
        result.ownerName = cleanName(registryData.ownerName);
        console.log(`Found owner name from registry: ${result.ownerName}`);
      }
    }

    console.log(`Enrichment complete. Owner: ${result.ownerName}, Email: ${result.ownerEmail || result.companyEmail}`);

  } catch (error) {
    console.error('Error enriching business data:', error);
  }

  return result;
}

function cleanName(name: string): string {
  if (!name) return '';
  
  // Remove HTML tags
  name = name.replace(/<[^>]*>/g, '');
  
  // Remove extra whitespace and newlines
  name = name.replace(/\s+/g, ' ').trim();
  
  // Remove common non-name words
  name = name.replace(/\b(profile|about|meet|contact|the|llc|inc|ltd|corp|company)\b/gi, '').trim();
  
  // Extract just the name part (first and last name)
  const nameMatch = name.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})\b/);
  if (nameMatch) {
    return nameMatch[1];
  }
  
  // If no match, return cleaned version
  return name.split(/[,\n]/).filter(part => {
    const cleaned = part.trim();
    return cleaned.length > 3 && /^[A-Z][a-z]+(\s+[A-Z][a-z]+)*$/.test(cleaned);
  })[0] || '';
}

async function scrapeWebsite(url: string): Promise<{
  ownerName: string;
  emails: string[];
  linkedin: string;
  facebook: string;
  otherSocials: string[];
}> {
  const result = {
    ownerName: '',
    emails: [] as string[],
    linkedin: '',
    facebook: '',
    otherSocials: [] as string[]
  };

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000,
      maxRedirects: 5
    });

    const $ = cheerio.load(response.data);
    const text = $.text();
    const html = response.data;

    // Extract owner name from common patterns
    const ownerPatterns = [
      /(?:founded by|owner|ceo|president|founder)[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/gi,
      /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)[,\s]+(?:owner|ceo|president|founder)/gi,
      /<h[1-6][^>]*>(?:meet|about)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/gi,
      /(?:contact|reach)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/gi
    ];

    for (const pattern of ownerPatterns) {
      const matches = [...text.matchAll(pattern)];
      if (matches.length > 0 && matches[0][1]) {
        result.ownerName = matches[0][1].trim();
        break;
      }
    }

    // Extract emails
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emailMatches = html.match(emailRegex) || [];
    result.emails = [...new Set(emailMatches)].filter(email => 
      !email.includes('example.com') &&
      !email.includes('test.com') &&
      !email.includes('wix.com') &&
      !email.includes('wordpress.com') &&
      !email.includes('sentry.io') &&
      !email.includes('google.com')
    );

    // Extract social media links
    $('a[href]').each((_, elem) => {
      const href = $(elem).attr('href') || '';
      
      if (href.includes('linkedin.com/') && !result.linkedin) {
        result.linkedin = href.split('?')[0]; // Remove query params
      } else if (href.includes('facebook.com/') && !result.facebook) {
        result.facebook = href.split('?')[0];
      } else if (href.includes('instagram.com/') || href.includes('twitter.com/') || href.includes('x.com/')) {
        result.otherSocials.push(href.split('?')[0]);
      }
    });

    // Try to scrape About page for more info
    const aboutLinks = $('a[href*="about"], a[href*="team"], a[href*="contact"]').slice(0, 3);
    for (let i = 0; i < aboutLinks.length; i++) {
      const aboutHref = $(aboutLinks[i]).attr('href');
      if (aboutHref && !result.ownerName) {
        try {
          const aboutUrl = new URL(aboutHref, url).href;
          const aboutResponse = await axios.get(aboutUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 5000
          });
          
          const $about = cheerio.load(aboutResponse.data);
          const aboutText = $about.text();
          
          for (const pattern of ownerPatterns) {
            const matches = [...aboutText.matchAll(pattern)];
            if (matches.length > 0 && matches[0][1]) {
              result.ownerName = matches[0][1].trim();
              break;
            }
          }
        } catch (err) {
          // Continue if about page fails
        }
      }
    }

  } catch (error) {
    console.error('Error scraping website:', error);
  }

  return result;
}

async function searchLinkedIn(businessName: string, address: string): Promise<{
  ownerName: string;
  linkedin: string;
}> {
  const result = { ownerName: '', linkedin: '' };
  
  try {
    // Search for LinkedIn company page
    const searchUrl = `https://www.google.com/search?q=site:linkedin.com+${encodeURIComponent(businessName)}+${encodeURIComponent(address.split(',')[0])}`;
    
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);
    
    // Extract LinkedIn URLs from search results
    $('a[href*="linkedin.com"]').each((_, elem) => {
      const href = $(elem).attr('href') || '';
      if (href.includes('/company/') && !result.linkedin) {
        result.linkedin = href.split('&')[0].split('?')[0];
      }
    });

    // Try to extract owner name from snippets
    $('.g').each((_, elem) => {
      const text = $(elem).text();
      const ownerMatch = text.match(/([A-Z][a-z]+\s+[A-Z][a-z]+)\s*[-–]\s*(?:Owner|CEO|Founder|President)/i);
      if (ownerMatch && !result.ownerName) {
        result.ownerName = ownerMatch[1];
      }
    });

  } catch (error) {
    console.error('Error searching LinkedIn:', error);
  }

  return result;
}

async function searchFacebook(businessName: string, address: string): Promise<string> {
  try {
    const searchUrl = `https://www.google.com/search?q=site:facebook.com+${encodeURIComponent(businessName)}+${encodeURIComponent(address.split(',')[0])}`;
    
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);
    
    let facebookUrl = '';
    $('a[href*="facebook.com"]').each((_, elem) => {
      const href = $(elem).attr('href') || '';
      if (href.includes('facebook.com/') && !facebookUrl) {
        facebookUrl = href.split('&')[0].split('?')[0];
        return false; // Break loop
      }
    });

    return facebookUrl;
  } catch (error) {
    console.error('Error searching Facebook:', error);
    return '';
  }
}

async function searchBusinessRegistry(businessName: string, address: string): Promise<{
  ownerName: string;
}> {
  const result = { ownerName: '' };
  
  try {
    // Extract state from address
    const stateMatch = address.match(/,\s*([A-Z]{2})\s+\d{5}/);
    if (!stateMatch) return result;
    
    const state = stateMatch[1];
    
    // Search for business registration info
    const searchUrl = `https://www.google.com/search?q="${encodeURIComponent(businessName)}"+${state}+business+registration+owner+agent`;
    
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);
    const text = $.text();
    
    // Look for registered agent or owner patterns
    const patterns = [
      /(?:registered agent|owner|principal)[:\s]+([A-Z][a-z]+\s+[A-Z][a-z]+)/gi,
      /([A-Z][a-z]+\s+[A-Z][a-z]+)[,\s]+(?:registered agent|owner|principal)/gi
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        result.ownerName = match[1].trim();
        break;
      }
    }

  } catch (error) {
    console.error('Error searching business registry:', error);
  }

  return result;
}

function findOwnerEmail(emails: string[], ownerName: string): string {
  if (!ownerName || emails.length === 0) return '';
  
  const nameParts = ownerName.toLowerCase().split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts[nameParts.length - 1];
  
  // Look for emails that match owner name patterns
  for (const email of emails) {
    const localPart = email.split('@')[0].toLowerCase();
    
    // Check various name patterns
    if (
      localPart === `${firstName}.${lastName}` ||
      localPart === `${firstName}${lastName}` ||
      localPart === `${firstName[0]}${lastName}` ||
      localPart === `${firstName}.${lastName[0]}` ||
      localPart === firstName ||
      localPart.includes(firstName) && localPart.includes(lastName)
    ) {
      return email;
    }
  }
  
  return '';
}

function generateOwnerEmail(ownerName: string, website: string): string {
  if (!ownerName || !website) return '';
  
  try {
    const domain = new URL(website).hostname.replace('www.', '');
    const nameParts = ownerName.toLowerCase().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts[nameParts.length - 1];
    
    // Generate most common email pattern
    return `${firstName}.${lastName}@${domain}`;
  } catch (error) {
    return '';
  }
}
