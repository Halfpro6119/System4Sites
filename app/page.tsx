'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const [jsonData, setJsonData] = useState('');
  const [response, setResponse] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const exampleData = {
    idx: 0,
    RowNumber: 1758873406,
    title: "PINQ Staffing LLC",
    map_link: "https://www.google.com/maps/place/PINQ+Staffing+LLC/data=!4m7!3m6!1s0x87b6ef223261c581:0xba8b259f3d431b70!8m2!3d36.233111!4d-95.977765!16s%2Fg%2F11rj4xr20c!19sChIJgcVhMiLvtocRcBtDPZ8li7o?authuser=0&hl=en&rclk=1",
    cover_image: "https://lh3.googleusercontent.com/p/AF1QipOff2NPqTOs2wnZQMN4wZkgEIrCYX0z4CfaRbme=w426-h240-k-no",
    rating: "5.0",
    category: "Employment agency",
    address: "1019 E 54th St N, Tulsa, OK 74126",
    webpage: "Not Available",
    phone_number: "(918) 764-8757",
    working_hours: "",
    Used: false
  };

  const loadExample = () => {
    setJsonData(JSON.stringify(exampleData, null, 2));
    setError('');
    setResponse(null);
  };

  const sendToWebhook = async () => {
    try {
      setLoading(true);
      setError('');
      setResponse(null);

      const parsed = JSON.parse(jsonData);
      
      const res = await fetch('/api/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsed),
      });

      const data = await res.json();
      setResponse(data);
      
      if (data.success === false) {
        setError(data.message || 'Request failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">System4Sites</h1>
          <p className="text-muted-foreground">Business Lead Enrichment & Email Campaign Generator</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Webhook Endpoint</CardTitle>
            <CardDescription>POST your business data to <code>/api/webhook</code></CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Business Data (JSON)</label>
              <Textarea
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
                placeholder="Paste your JSON data here..."
                className="font-mono text-sm min-h-[300px]"
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={sendToWebhook} disabled={loading || !jsonData}>
                {loading ? 'Processing...' : 'Send to Webhook'}
              </Button>
              <Button onClick={loadExample} variant="outline">
                Load Example
              </Button>
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}

            {response && !error && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-200">
                  <strong>Success!</strong> Generated audit and email campaign for {response.business_name as string}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {response && (
          <Card>
            <CardHeader>
              <CardTitle>Response Data</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-auto text-xs">
                {JSON.stringify(response, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Data Collection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Receives business data, crawls website, enriches with owner info and reviews
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Filtering</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Only processes businesses with 4+ star rating and 3+ positive reviews
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                AI generates comprehensive website audit with pain points and opportunities
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Email Campaign</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Creates personalized 6-email sequence with demo link
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
