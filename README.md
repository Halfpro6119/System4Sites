# System4Sites - Business Lead Enrichment & Email Campaign Generator

A Next.js application that receives business data via webhook, enriches it with web scraping and AI analysis, and generates personalized email campaigns.

## Features

- **Webhook Endpoint**: POST `/api/webhook` to process business data
- **Web Crawling**: Automatically scrapes business websites for content
- **Lead Enrichment**: Finds owner information, reviews, and ratings
- **Smart Filtering**: Only processes businesses with 4+ star rating and 3+ positive reviews
- **AI-Powered Analysis**: Generates comprehensive website audits using OpenAI
- **Email Campaign Generation**: Creates personalized 6-email sequences with demo links

## Setup

1. Clone the repository:
```bash
git clone https://github.com/Halfpro6119/System4Sites.git
cd System4Sites
```

2. Install dependencies:
```bash
bun install
```

3. Create `.env.local` file:
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

4. Run the development server:
```bash
bun run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## API Usage

### POST /api/webhook

Send business data in this format:

```json
{
  "idx": 0,
  "RowNumber": 1758873406,
  "title": "PINQ Staffing LLC",
  "map_link": "https://www.google.com/maps/...",
  "cover_image": "https://...",
  "rating": "5.0",
  "category": "Employment agency",
  "address": "1019 E 54th St N, Tulsa, OK 74126",
  "webpage": "https://example.com",
  "phone_number": "(918) 764-8757",
  "working_hours": "",
  "Used": false
}
```

### Response

Returns comprehensive JSON with:
- Business audit data
- Owner information
- Website analysis
- 6-part email campaign
- Reviews and ratings

## Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **OpenAI GPT-4** - AI analysis
- **Cheerio** - Web scraping
- **Axios** - HTTP requests

## Deployment

Deploy to Vercel:

```bash
vercel
```

Make sure to add your `OPENAI_API_KEY` to Vercel environment variables.

## License

MIT
