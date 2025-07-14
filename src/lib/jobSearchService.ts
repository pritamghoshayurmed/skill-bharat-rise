import { serpApiService, JobListing } from './serpApi';
import { geminiService } from './gemini';

export interface JobSearchResult {
  jobs: JobListing[];
  source: 'serp' | 'gemini';
  totalFound: number;
  searchQuery: string;
  location: string;
}

export interface ResumeProfile {
  skills: string[];
  experience: string[];
  jobTitles: string[];
  industries: string[];
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
}

class JobSearchService {
  /**
   * Extract job search keywords from resume text
   */
  private extractJobSearchKeywords(resumeText: string): string[] {
    const keywords: string[] = [];
    const text = resumeText.toLowerCase();

    // Common job titles and roles
    const jobTitles = [
      'software engineer', 'developer', 'programmer', 'data scientist', 'analyst',
      'manager', 'director', 'consultant', 'designer', 'architect', 'specialist',
      'coordinator', 'administrator', 'technician', 'engineer', 'researcher'
    ];

    // Extract job titles mentioned in resume
    jobTitles.forEach(title => {
      if (text.includes(title)) {
        keywords.push(title);
      }
    });

    // Extract technical skills
    const techSkills = [
      'javascript', 'python', 'java', 'react', 'node.js', 'sql', 'aws', 'docker',
      'kubernetes', 'machine learning', 'data analysis', 'project management'
    ];

    techSkills.forEach(skill => {
      if (text.includes(skill)) {
        keywords.push(skill);
      }
    });

    return keywords.slice(0, 5); // Limit to top 5 keywords
  }

  /**
   * Determine experience level from resume
   */
  private determineExperienceLevel(resumeText: string): 'entry' | 'mid' | 'senior' | 'executive' {
    const text = resumeText.toLowerCase();
    
    if (text.includes('ceo') || text.includes('cto') || text.includes('vp') || text.includes('director')) {
      return 'executive';
    }
    
    if (text.includes('senior') || text.includes('lead') || text.includes('principal')) {
      return 'senior';
    }
    
    if (text.includes('junior') || text.includes('intern') || text.includes('entry')) {
      return 'entry';
    }
    
    return 'mid';
  }

  /**
   * Parse Gemini AI job search response with enhanced details
   */
  private parseGeminiJobResponse(response: string): JobListing[] {
    const jobs: JobListing[] = [];
    const jobBlocks = response.split(/JOB \d+:/i).slice(1);

    jobBlocks.forEach((block, index) => {
      try {
        const job: Partial<JobListing> = {
          id: `gemini-job-${index}`,
          featured: index === 0
        };

        // Extract basic information using regex for better parsing
        const titleMatch = block.match(/Title:\s*(.+)/i);
        if (titleMatch) job.title = titleMatch[1].trim();

        const companyMatch = block.match(/Company:\s*(.+)/i);
        if (companyMatch) job.company = companyMatch[1].trim();

        const locationMatch = block.match(/Location:\s*(.+)/i);
        if (locationMatch) job.location = locationMatch[1].trim();

        const matchMatch = block.match(/Match Score:\s*(\d+)%/i);
        if (matchMatch) job.matchScore = parseInt(matchMatch[1]);

        // Extract comprehensive job description
        const descMatch = block.match(/Job Description:\s*([\s\S]*?)(?=Required Qualifications:|Preferred Qualifications:|Responsibilities:|Benefits|Company Information:|Job Type:|$)/i);
        if (descMatch) {
          job.description = descMatch[1].trim();
        }

        // Extract required qualifications
        const reqMatch = block.match(/Required Qualifications:\s*([\s\S]*?)(?=Preferred Qualifications:|Responsibilities:|Benefits|Company Information:|Job Type:|$)/i);
        if (reqMatch) {
          job.requirements = reqMatch[1]
            .split(/[-•]\s*/)
            .filter(req => req.trim())
            .map(req => req.trim());
        }

        // Extract preferred qualifications and add to requirements
        const prefMatch = block.match(/Preferred Qualifications:\s*([\s\S]*?)(?=Responsibilities:|Benefits|Company Information:|Job Type:|$)/i);
        if (prefMatch) {
          const preferredQuals = prefMatch[1]
            .split(/[-•]\s*/)
            .filter(qual => qual.trim())
            .map(qual => `Preferred: ${qual.trim()}`);

          if (job.requirements) {
            job.requirements.push(...preferredQuals);
          } else {
            job.requirements = preferredQuals;
          }
        }

        // Extract responsibilities and add to description
        const respMatch = block.match(/Responsibilities:\s*([\s\S]*?)(?=Benefits|Company Information:|Salary Range:|Job Type:|$)/i);
        if (respMatch) {
          const responsibilities = respMatch[1]
            .split(/[-•]\s*/)
            .filter(resp => resp.trim())
            .map(resp => resp.trim());

          if (responsibilities.length > 0) {
            job.description = (job.description || '') + '\n\nKey Responsibilities:\n' +
              responsibilities.map(resp => `• ${resp}`).join('\n');
          }
        }

        // Extract benefits and salary
        const benefitsMatch = block.match(/Benefits & Compensation:\s*([\s\S]*?)(?=Company Information:|Job Type:|Posted Date:|$)/i);
        if (benefitsMatch) {
          const benefitsText = benefitsMatch[1];

          // Extract salary
          const salaryMatch = benefitsText.match(/Salary Range:\s*(.+)/i);
          if (salaryMatch) job.salaryRange = salaryMatch[1].trim();

          // Extract other benefits
          const benefits = benefitsText
            .split(/[-•]\s*/)
            .filter(benefit => benefit.trim() && !benefit.toLowerCase().includes('salary range:'))
            .map(benefit => benefit.trim());

          if (benefits.length > 0) {
            job.description = (job.description || '') + '\n\nBenefits:\n' +
              benefits.map(benefit => `• ${benefit}`).join('\n');
          }
        }

        // Extract company information
        const companyInfoMatch = block.match(/Company Information:\s*([\s\S]*?)(?=Job Type:|Posted Date:|Apply URL:|$)/i);
        if (companyInfoMatch) {
          const companyInfo = companyInfoMatch[1].trim();
          job.description = (job.description || '') + '\n\nAbout the Company:\n' + companyInfo;
        }

        // Extract other fields
        const typeMatch = block.match(/Job Type:\s*(.+)/i);
        if (typeMatch) job.jobType = typeMatch[1].trim();

        const postedMatch = block.match(/Posted Date:\s*(.+)/i);
        if (postedMatch) job.postedDate = postedMatch[1].trim();

        const urlMatch = block.match(/Apply URL:\s*(.+)/i);
        if (urlMatch) job.url = urlMatch[1].trim();

        const skillsMatch = block.match(/Key Skills:\s*([\s\S]*?)(?=Why Good Match:|$)/i);
        if (skillsMatch) {
          job.requiredSkills = skillsMatch[1]
            .split(/[,;]\s*/)
            .filter(skill => skill.trim())
            .map(skill => skill.trim());
        }

        const matchReasonMatch = block.match(/Why Good Match:\s*([\s\S]*?)(?=---|\n\n|$)/i);
        if (matchReasonMatch) {
          job.keyMatches = [matchReasonMatch[1].trim()];
        }

        // Fallback parsing for simpler format
        if (!job.description || !job.requirements) {
          const lines = block.trim().split('\n');
          lines.forEach(line => {
            const [key, ...valueParts] = line.split(':');
            const value = valueParts.join(':').trim();

            switch (key.trim().toLowerCase()) {
              case 'description':
                if (!job.description) job.description = value;
                break;
              case 'requirements':
                if (!job.requirements) job.requirements = value.split(',').map(r => r.trim());
                break;
              case 'salary range':
                if (!job.salaryRange) job.salaryRange = value;
                break;
            }
          });
        }

        if (job.title && job.company) {
          jobs.push(job as JobListing);
        }
      } catch (error) {
        console.warn('Failed to parse job block:', error);
      }
    });

    return jobs;
  }

  /**
   * Search for jobs using SERP API with Gemini fallback
   */
  async searchJobs(
    resumeText: string,
    location: string = 'United States',
    maxResults: number = 10
  ): Promise<JobSearchResult> {
    // Extract search keywords from resume
    const keywords = this.extractJobSearchKeywords(resumeText);
    const searchQuery = keywords.join(' OR ');

    console.log('Searching jobs with query:', searchQuery, 'in location:', location);

    try {
      // Try SERP API first
      const serpResult = await serpApiService.searchJobsWithFallback(
        searchQuery,
        location,
        maxResults
      );

      if (serpResult.source === 'serp' && serpResult.jobs.length > 0) {
        // Enhance SERP results with AI match analysis
        const enhancedJobs = await this.enhanceJobsWithMatchAnalysis(
          serpResult.jobs,
          resumeText
        );

        return {
          jobs: enhancedJobs,
          source: 'serp',
          totalFound: enhancedJobs.length,
          searchQuery,
          location
        };
      }

      // Fallback to Gemini AI search
      console.log('Using Gemini AI fallback for job search');
      const geminiResponse = await geminiService.searchJobsWithAI(resumeText, location);

      if (geminiResponse.success) {
        const geminiJobs = this.parseGeminiJobResponse(geminiResponse.text);
        
        return {
          jobs: geminiJobs,
          source: 'gemini',
          totalFound: geminiJobs.length,
          searchQuery,
          location
        };
      }

      throw new Error('Both SERP API and Gemini AI search failed');

    } catch (error) {
      console.error('Job search failed:', error);
      throw new Error(`Job search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Enhance job listings with AI-powered match analysis
   */
  private async enhanceJobsWithMatchAnalysis(
    jobs: JobListing[],
    resumeText: string
  ): Promise<JobListing[]> {
    const enhancedJobs: JobListing[] = [];

    for (const job of jobs) {
      try {
        const matchAnalysisPrompt = `
        Analyze how well this resume matches this job posting:

        RESUME:
        ${resumeText}

        JOB:
        Title: ${job.title}
        Company: ${job.company}
        Description: ${job.description}
        Requirements: ${job.requirements.join(', ')}

        Provide:
        1. Match Score (0-100%)
        2. Key Matches (3-5 specific reasons why this is a good match)
        3. Missing Skills (if any)

        Format:
        Match Score: [number]%
        Key Matches: [reason 1], [reason 2], [reason 3]
        Missing Skills: [skill 1], [skill 2]
        `;

        const analysisResponse = await geminiService.generateText(matchAnalysisPrompt);
        
        if (analysisResponse.success) {
          const analysis = analysisResponse.text;
          
          // Extract match score
          const matchScoreMatch = analysis.match(/Match Score:\s*(\d+)%/i);
          if (matchScoreMatch) {
            job.matchScore = parseInt(matchScoreMatch[1]);
          }

          // Extract key matches
          const keyMatchesMatch = analysis.match(/Key Matches:\s*(.+)/i);
          if (keyMatchesMatch) {
            job.keyMatches = keyMatchesMatch[1].split(',').map(m => m.trim());
          }
        }

        enhancedJobs.push(job);
      } catch (error) {
        console.warn('Failed to enhance job with match analysis:', error);
        enhancedJobs.push(job);
      }
    }

    return enhancedJobs;
  }

  /**
   * Get job recommendations based on stored resume profile
   */
  async getRecommendations(
    resumeProfile: ResumeProfile,
    location: string = 'United States'
  ): Promise<JobSearchResult> {
    const searchQuery = [
      ...resumeProfile.jobTitles,
      ...resumeProfile.skills.slice(0, 3)
    ].join(' OR ');

    // Create a synthetic resume text for search
    const syntheticResume = `
    Experience: ${resumeProfile.experience.join('. ')}
    Skills: ${resumeProfile.skills.join(', ')}
    Job Titles: ${resumeProfile.jobTitles.join(', ')}
    Industries: ${resumeProfile.industries.join(', ')}
    Experience Level: ${resumeProfile.experienceLevel}
    `;

    return this.searchJobs(syntheticResume, location);
  }
}

export const jobSearchService = new JobSearchService();
