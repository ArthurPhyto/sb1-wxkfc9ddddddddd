import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { CrawlerInput } from './components/CrawlerInput';
import { ResultsDisplay } from './components/ResultsDisplay';
import { DomainStatus, CrawlerJob } from './types/crawler';
import { checkDomain, extractLinks } from './utils/crawler';

function App() {
  const [crawledUrls, setCrawledUrls] = useState<string[]>([]);
  const [externalDomains, setExternalDomains] = useState<Map<string, DomainStatus>>(new Map());
  const [expiredDomains, setExpiredDomains] = useState<DomainStatus[]>([]);
  const [activeJobs, setActiveJobs] = useState<CrawlerJob[]>([]);

  const startCrawling = async (urls: string[]) => {
    const newJobs: CrawlerJob[] = urls.map(url => ({
      id: Math.random().toString(36).substr(2, 9),
      url,
      status: 'running',
      progress: 0
    }));
    
    setActiveJobs(prev => [...prev, ...newJobs]);

    urls.forEach(async (baseUrl) => {
      try {
        const response = await fetch(baseUrl);
        const html = await response.text();
        const links = extractLinks(html, baseUrl);
        
        setCrawledUrls(prev => [...prev, baseUrl]);
        
        for (const link of links) {
          if (!externalDomains.has(link)) {
            const status = await checkDomain(link);
            setExternalDomains(prev => new Map(prev.set(link, status)));
            
            if (status.status === 'expired') {
              setExpiredDomains(prev => [...prev, status]);
            }
          }
        }
      } catch (error) {
        console.error(`Error crawling ${baseUrl}:`, error);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center">
            <Globe className="w-8 h-8 text-orange-500" />
            <h1 className="ml-3 text-2xl font-bold text-gray-900">Domain Expiration Crawler</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <CrawlerInput onSubmit={startCrawling} />
          
          {activeJobs.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Active Jobs</h2>
              {activeJobs.map(job => (
                <div key={job.id} className="flex items-center space-x-4">
                  <span className="text-gray-600">{job.url}</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-orange-500 rounded-full"
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <ResultsDisplay
            crawledUrls={crawledUrls}
            externalDomains={externalDomains}
            expiredDomains={expiredDomains}
          />
        </div>
      </main>
    </div>
  );
}

export default App;