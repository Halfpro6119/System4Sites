import axios from 'axios';
import * as cheerio from 'cheerio';

export interface Review {
  text: string;
  reviewer: string;
  rating: number;
}

export async function scrapeGoogleMapsReviews(mapLink: string): Promise<Review[]> {
  try {
    console.log('Scraping Google Maps reviews from:', mapLink);
    
    // Extract place ID from the map link
    const placeIdMatch = mapLink.match(/!1s([^!]+)/);
    if (!placeIdMatch) {
      console.log('Could not extract place ID from map link');
      return [];
    }

    const placeId = placeIdMatch[1];
    console.log('Place ID:', placeId);

    // Fetch the Google Maps page
    const response = await axios.get(mapLink, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      timeout: 15000
    });

    const $ = cheerio.load(response.data);
    const reviews: Review[] = [];

    // Try to extract reviews from the page
    // Google Maps uses dynamic content, so we'll look for review data in the HTML
    const scriptTags = $('script').toArray();
    
    for (const script of scriptTags) {
      const content = $(script).html() || '';
      
      // Look for review data in JSON format
      if (content.includes('review') || content.includes('rating')) {
        // Try to extract review text and reviewer names
        const reviewMatches = content.match(/"text":"([^"]+)"/g);
        const nameMatches = content.match(/"displayName":"([^"]+)"/g);
        const ratingMatches = content.match(/"rating":(\d+)/g);

        if (reviewMatches && nameMatches) {
          const maxReviews = Math.min(3, reviewMatches.length);
          
          for (let i = 0; i < maxReviews; i++) {
            const text = reviewMatches[i]?.match(/"text":"([^"]+)"/)?.[1] || '';
            const name = nameMatches[i]?.match(/"displayName":"([^"]+)"/)?.[1] || '';
            const rating = ratingMatches?.[i]?.match(/"rating":(\d+)/)?.[1] || '5';

            if (text && name && text.length > 20) {
              reviews.push({
                text: text.replace(/\\n/g, ' ').replace(/\\/g, ''),
                reviewer: name,
                rating: parseInt(rating)
              });
            }
          }
        }
      }
    }

    console.log(`Found ${reviews.length} reviews from Google Maps`);
    return reviews.slice(0, 3); // Return max 3 reviews

  } catch (error) {
    console.error('Error scraping Google Maps reviews:', error);
    return [];
  }
}

// Alternative method using Puppeteer for dynamic content
export async function scrapeGoogleMapsReviewsWithPuppeteer(mapLink: string): Promise<Review[]> {
  try {
    const puppeteer = require('puppeteer');
    
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    await page.goto(mapLink, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Wait for reviews to load
    await page.waitForTimeout(3000);

    // Extract reviews
    const reviews = await page.evaluate(() => {
      const reviewElements = document.querySelectorAll('[data-review-id]');
      const extractedReviews: any[] = [];

      reviewElements.forEach((element, index) => {
        if (index < 3) { // Only get first 3 reviews
          const textElement = element.querySelector('.wiI7pd');
          const nameElement = element.querySelector('.d4r55');
          const ratingElement = element.querySelector('[aria-label*="star"]');

          const text = textElement?.textContent || '';
          const name = nameElement?.textContent || '';
          const ratingMatch = ratingElement?.getAttribute('aria-label')?.match(/(\d+)/);
          const rating = ratingMatch ? parseInt(ratingMatch[1]) : 5;

          if (text && name && text.length > 20) {
            extractedReviews.push({ text, reviewer: name, rating });
          }
        }
      });

      return extractedReviews;
    });

    await browser.close();
    
    console.log(`Found ${reviews.length} reviews using Puppeteer`);
    return reviews;

  } catch (error) {
    console.error('Error scraping with Puppeteer:', error);
    return [];
  }
}
