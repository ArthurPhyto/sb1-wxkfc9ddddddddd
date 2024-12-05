export interface DomainStatus {
  url: string;
  status: 'checking' | 'active' | 'expired' | 'error';
  httpStatus?: number;
  hasDNS?: boolean;
  whoisInfo?: string;
}

export interface CrawlerState {
  crawledUrls: Set<string>;
  externalDomains: Map<string, DomainStatus>;
  expiredDomains: DomainStatus[];
}

export interface CrawlerJob {
  id: string;
  url: string;
  status: 'running' | 'completed' | 'error';
  progress: number;
}