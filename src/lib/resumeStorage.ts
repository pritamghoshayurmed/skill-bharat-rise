import { supabase } from '@/integrations/supabase/client';
import { ResumeAnalysis } from '@/hooks/useJobSearchAgent';

export interface StoredResumeProfile {
  id: string;
  user_id: string;
  resume_text: string;
  analysis_data: ResumeAnalysis;
  skills: string[];
  experience_level: 'entry' | 'mid' | 'senior' | 'executive';
  job_titles: string[];
  industries: string[];
  preferred_location: string;
  created_at: string;
  updated_at: string;
}

export interface JobRecommendation {
  id: string;
  user_id: string;
  resume_profile_id: string;
  job_title: string;
  company: string;
  location: string;
  match_score: number;
  job_data: any;
  created_at: string;
}

class ResumeStorageService {
  /**
   * Save or update resume profile for a user
   */
  async saveResumeProfile(
    userId: string,
    resumeText: string,
    analysis: ResumeAnalysis,
    preferredLocation: string = 'United States'
  ): Promise<StoredResumeProfile | null> {
    try {
      // Extract additional data from analysis
      const skills = analysis.skills || [];
      const experienceLevel = this.determineExperienceLevel(resumeText);
      const jobTitles = this.extractJobTitles(resumeText);
      const industries = this.extractIndustries(resumeText);

      const profileData = {
        user_id: userId,
        resume_text: resumeText,
        analysis_data: analysis,
        skills,
        experience_level: experienceLevel,
        job_titles: jobTitles,
        industries,
        preferred_location: preferredLocation,
        updated_at: new Date().toISOString()
      };

      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('resume_profiles')
        .select('id')
        .eq('user_id', userId)
        .single();

      let result;
      if (existingProfile) {
        // Update existing profile
        const { data, error } = await supabase
          .from('resume_profiles')
          .update(profileData)
          .eq('user_id', userId)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        // Create new profile
        const { data, error } = await supabase
          .from('resume_profiles')
          .insert([{
            ...profileData,
            created_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (error) throw error;
        result = data;
      }

      return result;
    } catch (error) {
      console.error('Error saving resume profile:', error);
      return null;
    }
  }

  /**
   * Get resume profile for a user
   */
  async getResumeProfile(userId: string): Promise<StoredResumeProfile | null> {
    try {
      const { data, error } = await supabase
        .from('resume_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No profile found
          return null;
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error getting resume profile:', error);
      return null;
    }
  }

  /**
   * Save job recommendations for a user
   */
  async saveJobRecommendations(
    userId: string,
    resumeProfileId: string,
    jobs: any[]
  ): Promise<boolean> {
    try {
      // Clear existing recommendations
      await supabase
        .from('job_recommendations')
        .delete()
        .eq('user_id', userId);

      // Insert new recommendations
      const recommendations = jobs.map(job => ({
        user_id: userId,
        resume_profile_id: resumeProfileId,
        job_title: job.title,
        company: job.company,
        location: job.location,
        match_score: job.matchScore || 0,
        job_data: job,
        created_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('job_recommendations')
        .insert(recommendations);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error saving job recommendations:', error);
      return false;
    }
  }

  /**
   * Get job recommendations for a user
   */
  async getJobRecommendations(userId: string): Promise<JobRecommendation[]> {
    try {
      const { data, error } = await supabase
        .from('job_recommendations')
        .select('*')
        .eq('user_id', userId)
        .order('match_score', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting job recommendations:', error);
      return [];
    }
  }

  /**
   * Delete resume profile and related data
   */
  async deleteResumeProfile(userId: string): Promise<boolean> {
    try {
      // Delete job recommendations first
      await supabase
        .from('job_recommendations')
        .delete()
        .eq('user_id', userId);

      // Delete resume profile
      const { error } = await supabase
        .from('resume_profiles')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting resume profile:', error);
      return false;
    }
  }

  /**
   * Helper: Determine experience level from resume text
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
   * Helper: Extract job titles from resume text
   */
  private extractJobTitles(resumeText: string): string[] {
    const titles: string[] = [];
    const text = resumeText.toLowerCase();

    const commonTitles = [
      'software engineer', 'developer', 'programmer', 'data scientist', 'analyst',
      'manager', 'director', 'consultant', 'designer', 'architect', 'specialist',
      'coordinator', 'administrator', 'technician', 'engineer', 'researcher',
      'product manager', 'project manager', 'team lead', 'senior developer',
      'full stack developer', 'frontend developer', 'backend developer'
    ];

    commonTitles.forEach(title => {
      if (text.includes(title)) {
        titles.push(title);
      }
    });

    return [...new Set(titles)]; // Remove duplicates
  }

  /**
   * Helper: Extract industries from resume text
   */
  private extractIndustries(resumeText: string): string[] {
    const industries: string[] = [];
    const text = resumeText.toLowerCase();

    const commonIndustries = [
      'technology', 'software', 'healthcare', 'finance', 'education', 'retail',
      'manufacturing', 'consulting', 'media', 'telecommunications', 'automotive',
      'aerospace', 'biotechnology', 'gaming', 'e-commerce', 'fintech', 'startup'
    ];

    commonIndustries.forEach(industry => {
      if (text.includes(industry)) {
        industries.push(industry);
      }
    });

    return [...new Set(industries)]; // Remove duplicates
  }

  /**
   * Create database tables if they don't exist
   */
  async initializeTables(): Promise<boolean> {
    try {
      // This would typically be done via Supabase migrations
      // For now, we'll assume the tables exist
      console.log('Resume storage tables should be created via Supabase migrations');
      return true;
    } catch (error) {
      console.error('Error initializing tables:', error);
      return false;
    }
  }
}

export const resumeStorageService = new ResumeStorageService();
