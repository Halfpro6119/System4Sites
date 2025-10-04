'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

export default function Home() {
  const [jsonInput, setJsonInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setResponse(null);

    try {
      const data = JSON.parse(jsonInput);
      
      const res = await fetch('/api/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON or request failed');
    } finally {
      setLoading(false);
    }
  };

  const exampleJson = {
    "idx": 0,
    "RowNumber": 1758873406,
    "title": "PINQ Staffing LLC",
    "map_link": "https://www.google.com/maps/place/PINQ+Staffing+LLC/data=!4m7!3m6!1s0x87b6ef223261c581:0xba8b259f3d431b70!8m2!3d36.233111!4d-95.977765!16s%2Fg%2F11rj4xr20c!19sChIJgcVhMiLvtocRcBtDPZ8li7o?authuser=0&hl=en&rclk=1",
    "cover_image": "https://lh3.googleusercontent.com/p/AF1QipOff2NPqTOs2wnZQMN4wZkgEIrCYX0z4CfaRbme=w426-h240-k-no",
    "rating": "5.0",
    "category": "Employment agency",
    "address": "1019 E 54th St N, Tulsa, OK 74126",
    "webpage": "Not Available",
    "phone_number": "(918) 764-8757",
    "working_hours": "",
    "Used": false
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">System4Sites</h1>
          <p className="text-xl text-slate-600">
            Business Lead Enrichment & Email Campaign Generator
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Webhook Endpoint</CardTitle>
            <CardDescription>
              POST your business data to <code className="bg-slate-100 px-2 py-1 rounded">/api/webhook</code>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Business Data (JSON)
              </label>
              <Textarea
                placeholder={JSON.stringify(exampleJson, null, 2)}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="font-mono text-sm min-h-[300px]"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSubmit} disabled={loading || !jsonInput}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Send to Webhook'
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setJsonInput(JSON.stringify(exampleJson, null, 2))}
              >
                Load Example
              </Button>
            </div>

            {error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {response && (
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  {response.success === false ? (
                    <div>
                      <strong>Filtered Out:</strong> {response.message}
                    </div>
                  ) : (
                    <div>
                      <strong>Success!</strong> Generated audit and email campaign for {response.business_name}
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {response && response.slug && (
              <Card className="bg-slate-50">
                <CardHeader>
                  <CardTitle className="text-lg">Response Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs overflow-auto max-h-[500px] bg-white p-4 rounded border">
                    {JSON.stringify(response, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold">1. Data Collection</h3>
                <p className="text-sm text-slate-600">
                  Receives business data, crawls website, enriches with owner info and reviews
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">2. Filtering</h3>
                <p className="text-sm text-slate-600">
                  Only processes businesses with 4+ star rating and 3+ positive reviews
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">3. Analysis</h3>
                <p className="text-sm text-slate-600">
                  AI generates comprehensive website audit with pain points and opportunities
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">4. Email Campaign</h3>
                <p className="text-sm text-slate-600">
                  Creates personalized 6-email sequence with demo link
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
