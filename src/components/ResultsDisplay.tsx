import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { DomainStatus } from '../types/crawler';

interface Props {
  crawledUrls: string[];
  externalDomains: Map<string, DomainStatus>;
  expiredDomains: DomainStatus[];
}

export const ResultsDisplay: React.FC<Props> = ({
  crawledUrls,
  externalDomains,
  expiredDomains,
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'expired':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className="grid grid-cols-3 gap-6 w-full max-w-7xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Crawled URLs</h2>
        <div className="h-[600px] overflow-y-auto">
          {crawledUrls.map((url, index) => (
            <div key={index} className="py-2 border-b border-gray-100">
              {url}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">External Domains</h2>
        <div className="h-[600px] overflow-y-auto">
          {Array.from(externalDomains.entries()).map(([domain, status]) => (
            <div key={domain} className="py-2 border-b border-gray-100 flex items-center">
              {getStatusIcon(status.status)}
              <span className="ml-2">{domain}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Expired Domains</h2>
        <div className="h-[600px] overflow-y-auto">
          {expiredDomains.map((domain, index) => (
            <div key={index} className="py-2 border-b border-gray-100">
              <div className="font-medium">{domain.url}</div>
              <div className="text-sm text-gray-500">
                Status: {domain.httpStatus} | DNS: {domain.hasDNS ? 'Yes' : 'No'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};