import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface Props {
  onSubmit: (urls: string[]) => void;
}

export const CrawlerInput: React.FC<Props> = ({ onSubmit }) => {
  const [urls, setUrls] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const urlList = urls.split('\n').filter(url => url.trim());
    onSubmit(urlList);
    setUrls('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <textarea
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          placeholder="Enter URLs to crawl (one per line)"
          className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="mt-4 inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Start Crawling
        </button>
      </div>
    </form>
  );
};