interface SerpApiJobResult {
  title: string;
  company_name: string;
  location: string;
  description?: string;
  job_highlights?: {
    Qualifications?: string[];
    Responsibilities?: string[];
  };
  detected_extensions?: {
    posted_at?: string;
    schedule_type?: string;
    salary?: string;
  };
  apply_options?: Array<{
    title: string;
    link: string;
  }>;
  job_id?: string;
}

interface SerpApiResponse {
  jobs_results?: SerpApiJobResult[];
  error?: string;
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  matchScore?: number;
  salaryRange?: string;
  jobType?: string;
  postedDate?: string;
  url?: string;
  featured?: boolean;
  requiredSkills?: string[];
  keyMatches?: string[];
}

class SerpApiService {
  private apiKey: string;
  private baseUrl = 'https://serpapi.com/search.json';

  constructor() {
    this.apiKey = import.meta.env.VITE_SERP_API_KEY || '';
    if (!this.apiKey) {
      console.warn('SERP API key not found in environment variables');
    }
  }

  async searchJobs(
    query: string,
    location: string = 'United States',
    numResults: number = 10
  ): Promise<JobListing[]> {
    if (!this.apiKey) {
      throw new Error('SERP API key not configured');
    }

    try {
      const params = new URLSearchParams({
        engine: 'google_jobs',
        q: query,
        location: location,
        api_key: this.apiKey,
        num: numResults.toString(),
        start: '0'
      });

      const response = await fetch(`${this.baseUrl}?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`SERP API request failed: ${response.status} ${response.statusText}`);
      }

      const data: SerpApiResponse = await response.json();

      if (data.error) {
        throw new Error(`SERP API error: ${data.error}`);
      }

      if (!data.jobs_results || data.jobs_results.length === 0) {
        return [];
      }

      return data.jobs_results.map((job, index) => this.transformJobResult(job, index));
    } catch (error) {
      console.error('SERP API search failed:', error);
      throw error;
    }
  }

  private transformJobResult(job: SerpApiJobResult, index: number): JobListing {
    const requirements: string[] = [];
    
    // Extract requirements from job highlights
    if (job.job_highlights?.Qualifications) {
      requirements.push(...job.job_highlights.Qualifications);
    }
    if (job.job_highlights?.Responsibilities) {
      requirements.push(...job.job_highlights.Responsibilities.slice(0, 3)); // Limit responsibilities
    }

    // Extract skills from description and requirements
    const skillKeywords = [
      'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'C#',
      'SQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Azure', 'Docker', 'Kubernetes',
      'Git', 'Agile', 'Scrum', 'REST API', 'GraphQL', 'HTML', 'CSS', 'Vue.js',
      'Angular', 'Express.js', 'Django', 'Flask', 'Spring Boot', 'Laravel'
    ];

    const jobText = `${job.title} ${job.description || ''} ${requirements.join(' ')}`.toLowerCase();
    const detectedSkills = skillKeywords.filter(skill => 
      jobText.includes(skill.toLowerCase())
    );

    // Get apply URL
    const applyUrl = job.apply_options?.[0]?.link || `https://www.google.com/search?q=${encodeURIComponent(job.title + ' ' + job.company_name)}`;

    return {
      id: job.job_id || `job-${index}`,
      title: job.title,
      company: job.company_name,
      location: job.location,
      description: job.description || 'No description available',
      requirements,
      salaryRange: job.detected_extensions?.salary,
      jobType: job.detected_extensions?.schedule_type,
      postedDate: job.detected_extensions?.posted_at,
      url: applyUrl,
      featured: index === 0, // Mark first result as featured
      requiredSkills: detectedSkills,
      keyMatches: [] // Will be populated by AI analysis
    };
  }

  async searchJobsWithFallback(
    query: string,
    location: string = 'United States',
    numResults: number = 10
  ): Promise<{ jobs: JobListing[]; source: 'serp' | 'fallback' }> {
    try {
      const jobs = await this.searchJobs(query, location, numResults);
      return { jobs, source: 'serp' };
    } catch (error) {
      console.warn('SERP API failed, will use fallback method:', error);
      // Return empty array for now - fallback will be handled by Gemini service
      return { jobs: [], source: 'fallback' };
    }
  }

  // Method to test API connectivity
  async testConnection(): Promise<boolean> {
    try {
      const jobs = await this.searchJobs('software engineer', 'United States', 1);
      return jobs.length > 0;
    } catch (error) {
      console.error('SERP API connection test failed:', error);
      return false;
    }
  }
}

export const serpApiService = new SerpApiService();
