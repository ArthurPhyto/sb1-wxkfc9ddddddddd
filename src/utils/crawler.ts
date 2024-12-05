import axios from 'axios';
import * as cheerio from 'cheerio';
import { DomainStatus, CrawlerState } from '../types/crawler';

export const checkDomain = async (url: string): Promise<DomainStatus> => {
  try {
    const response = await axios.get(url, { 
      timeout: 5000,
      validateStatus: () => true
    });
    
    if (response.status === 200) {
      return {
        url,
        status: 'active',
        httpStatus: response.status
      };
    }

    // Check DNS
    try {
      const dnsResult = await new Promise((resolve, reject) => {
        dns.resolve(new URL(url).hostname, (err, addresses) => {
          if (err) reject(err);
          else resolve(addresses);
        });
      });
      
      return {
        url,
        status: 'active',
        httpStatus: response.status,
        hasDNS: true
      };
    } catch {
      return {
        url,
        status: 'expired',
        httpStatus: response.status,
        hasDNS: false
      };
    }
  } catch (error) {
    return {
      url,
      status: 'error',
      httpStatus: 0,
      hasDNS: false
    };
  }
};

export const extractLinks = (html: string, baseUrl: string): string[] => {
  const $ = cheerio.load(html);
  const links = new Set<string>();
  
  $('a').each((_, element) => {
    const href = $(element).attr('href');
    if (href) {
      try {
        const absoluteUrl = new URL(href, baseUrl).toString();
        if (absoluteUrl.startsWith('http')) {
          links.add(absoluteUrl);
        }
      } catch {}
    }
  });
  
  return Array.from(links);
};