import axios from 'axios';
import * as cheerio from 'cheerio';

export interface ScrapedData {
  title: string;
  description: string;
  content: string[];
  links: string[];
  images: string[];
}

export async function scrapeWebsite(url: string): Promise<ScrapedData> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);

    // Remove script and style elements
    $('script, style, noscript').remove();

    const title = $('title').text() || $('h1').first().text() || '';
    const description = $('meta[name="description"]').attr('content') || 
                       $('meta[property="og:description"]').attr('content') || '';

    // Extract main content
    const content: string[] = [];
    $('p, h1, h2, h3, h4, h5, h6, li').each((_, elem) => {
      const text = $(elem).text().trim();
      if (text && text.length > 20) {
        content.push(text);
      }
    });

    // Extract internal links
    const links: string[] = [];
    $('a[href]').each((_, elem) => {
      const href = $(elem).attr('href');
      if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
        try {
          const fullUrl = new URL(href, url).href;
          if (fullUrl.startsWith(url)) {
            links.push(fullUrl);
          }
        } catch (e) {
          // Invalid URL, skip
        }
      }
    });

    // Extract images
    const images: string[] = [];
    $('img[src]').each((_, elem) => {
      const src = $(elem).attr('src');
      if (src) {
        try {
          const fullUrl = new URL(src, url).href;
          images.push(fullUrl);
        } catch (e) {
          // Invalid URL, skip
        }
      }
    });

    return {
      title,
      description,
      content: content.slice(0, 50), // Limit content
      links: [...new Set(links)].slice(0, 20), // Unique links, limited
      images: [...new Set(images)].slice(0, 10) // Unique images, limited
    };
  } catch (error) {
    console.error('Error scraping website:', error);
    return {
      title: '',
      description: '',
      content: [],
      links: [],
      images: []
    };
  }
}

export async function crawlWebsite(baseUrl: string, maxPages: number = 5): Promise<ScrapedData[]> {
  const visited = new Set<string>();
  const results: ScrapedData[] = [];
  const toVisit = [baseUrl];

  while (toVisit.length > 0 && visited.size < maxPages) {
    const url = toVisit.shift()!;
    if (visited.has(url)) continue;

    visited.add(url);
    const data = await scrapeWebsite(url);
    results.push(data);

    // Add new links to visit
    for (const link of data.links) {
      if (!visited.has(link) && toVisit.length + visited.size < maxPages) {
        toVisit.push(link);
      }
    }

    // Small delay to be respectful
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  return results;
}
