import { useState, useEffect } from 'react';
import { geminiService } from '@/lib/gemini';
import { jobSearchService } from '@/lib/jobSearchService';
import { resumeStorageService } from '@/lib/resumeStorage';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface ResumeAnalysis {
  text: string;
  skills: string[];
  experience: string[];
  education: string[];
  matchPercentage?: number;
  strengths?: string[];
  improvements?: string[];
  missingSkills?: string[];
}

export interface JobMatch {
  id?: string;
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

export interface InterviewQuestion {
  question: string;
  type: 'technical' | 'behavioral' | 'role-specific';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  reasoning: string;
  sampleAnswer?: string;
  tips?: string[];
}

export const useJobSearchAgent = () => {
  const [loading, setLoading] = useState(false);
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysis | null>(null);
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([]);
  const [interviewQuestions, setInterviewQuestions] = useState<InterviewQuestion[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load stored resume profile on mount
  useEffect(() => {
    if (user?.id) {
      loadStoredResumeProfile();
    }
  }, [user?.id]);

  const loadStoredResumeProfile = async () => {
    if (!user?.id) return;

    try {
      const profile = await resumeStorageService.getResumeProfile(user.id);
      if (profile) {
        setResumeAnalysis(profile.analysis_data);

        // Load stored job recommendations
        const recommendations = await resumeStorageService.getJobRecommendations(user.id);
        if (recommendations.length > 0) {
          const jobs = recommendations.map(rec => rec.job_data);
          setJobMatches(jobs);
        }
      }
    } catch (error) {
      console.error('Error loading stored resume profile:', error);
    }
  };

  const analyzeResume = async (resumeText: string, jobDescription?: string) => {
    setLoading(true);
    try {
      const response = await geminiService.analyzeResume(resumeText, jobDescription);

      if (response.success) {
        // Parse the response to extract structured data
        const analysis = parseResumeAnalysis(response.text, resumeText);
        setResumeAnalysis(analysis);

        // Save to database if user is logged in
        if (user?.id) {
          await resumeStorageService.saveResumeProfile(
            user.id,
            resumeText,
            analysis,
            'United States' // Default location, can be customized
          );
        }

        toast({
          title: "Resume Analysis Complete",
          description: "Your resume has been analyzed and saved successfully."
        });

        return analysis;
      } else {
        throw new Error(response.error || 'Failed to analyze resume');
      }
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze resume",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const findJobMatches = async (resumeText: string, location: string = 'United States') => {
    setLoading(true);
    try {
      // Use the new job search service with SERP API and Gemini fallback
      const searchResult = await jobSearchService.searchJobs(resumeText, location, 10);

      setJobMatches(searchResult.jobs);

      // Save job recommendations to database if user is logged in
      if (user?.id && searchResult.jobs.length > 0) {
        const profile = await resumeStorageService.getResumeProfile(user.id);
        if (profile) {
          await resumeStorageService.saveJobRecommendations(
            user.id,
            profile.id,
            searchResult.jobs
          );
        }
      }

      toast({
        title: "Job Search Complete",
        description: `Found ${searchResult.jobs.length} job matches using ${searchResult.source === 'serp' ? 'SERP API' : 'AI search'}.`
      });

      return searchResult.jobs;
    } catch (error) {
      console.error('Job search error:', error);

      // Fallback to basic Gemini job matching if everything fails
      try {
        const response = await geminiService.matchJobs(resumeText, { location });

        if (response.success) {
          const matches = parseJobMatches(response.text);
          setJobMatches(matches);

          toast({
            title: "Job Recommendations Generated",
            description: `Generated ${matches.length} job recommendations based on your resume.`
          });

          return matches;
        }
      } catch (fallbackError) {
        console.error('Fallback job search also failed:', fallbackError);
      }

      toast({
        title: "Job Search Failed",
        description: error instanceof Error ? error.message : "Failed to find job matches",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const generateInterviewQuestions = async (
    resumeText: string,
    jobRole: string,
    difficulty: 'beginner' | 'intermediate' | 'advanced' = 'intermediate',
    questionCount: number = 5
  ) => {
    setLoading(true);
    try {
      // Enhanced prompt for better interview questions with sample answers
      const enhancedPrompt = `
      Generate comprehensive interview questions for a ${jobRole} position based on this resume:

      RESUME:
      ${resumeText}

      REQUIREMENTS:
      - Generate ${questionCount} questions total
      - Difficulty level: ${difficulty}
      - Include a mix of technical, behavioral, and role-specific questions
      - For each question, provide:
        1. The question itself
        2. Question type (technical/behavioral/role-specific)
        3. Difficulty level
        4. Reasoning for why this question is relevant
        5. A sample ideal answer
        6. Tips for answering effectively

      FORMAT EACH QUESTION AS:
      QUESTION [number]:
      Question: [The actual question]
      Type: [technical/behavioral/role-specific]
      Difficulty: [beginner/intermediate/advanced]
      Reasoning: [Why this question is relevant to the candidate]
      Sample Answer: [An ideal response example]
      Tips: [3-4 specific tips for answering this question]

      Focus on questions that are:
      - Relevant to the candidate's experience and skills
      - Appropriate for the ${jobRole} role
      - Likely to be asked in real interviews
      - Designed to showcase the candidate's strengths
      `;

      const response = await geminiService.generateText(enhancedPrompt);

      if (response.success) {
        // Parse the response to extract interview questions
        const questions = parseEnhancedInterviewQuestions(response.text);
        setInterviewQuestions(questions);

        toast({
          title: "Interview Questions Generated",
          description: `Generated ${questions.length} comprehensive interview questions for ${jobRole} role.`
        });

        return questions;
      } else {
        throw new Error(response.error || 'Failed to generate interview questions');
      }
    } catch (error) {
      toast({
        title: "Question Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate interview questions",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Helper function to parse resume analysis from AI response
  const parseResumeAnalysis = (responseText: string, originalText: string): ResumeAnalysis => {
    // Extract skills, experience, and education from the original resume text
    const skills = extractSkills(originalText);
    const experience = extractExperience(originalText);
    const education = extractEducation(originalText);
    
    // Try to extract match percentage from AI response
    const matchPercentageMatch = responseText.match(/(\d+)%/);
    const matchPercentage = matchPercentageMatch ? parseInt(matchPercentageMatch[1]) : undefined;
    
    return {
      text: responseText,
      skills,
      experience,
      education,
      matchPercentage,
      strengths: extractListItems(responseText, ['strengths', 'strong points', 'advantages']),
      improvements: extractListItems(responseText, ['improvements', 'areas for improvement', 'recommendations']),
      missingSkills: extractListItems(responseText, ['missing skills', 'gaps', 'lacking'])
    };
  };

  // Helper function to parse job matches from AI response
  const parseJobMatches = (responseText: string): JobMatch[] => {
    // This is a simplified parser - in a real implementation, you might want more sophisticated parsing
    const matches: JobMatch[] = [];
    
    // Extract job roles mentioned in the response
    const roleMatches = responseText.match(/\d+\.\s*([^:\n]+)/g);
    
    if (roleMatches) {
      roleMatches.forEach((match, index) => {
        const title = match.replace(/^\d+\.\s*/, '').trim();
        matches.push({
          title,
          company: 'Various Companies',
          location: 'Multiple Locations',
          description: `Suitable role based on your profile analysis`,
          requirements: [],
          matchScore: Math.max(70, 90 - index * 5), // Decreasing match score
          jobType: 'Full-time'
        });
      });
    }
    
    return matches;
  };

  // Helper function to parse enhanced interview questions from AI response
  const parseEnhancedInterviewQuestions = (responseText: string): InterviewQuestion[] => {
    const questions: InterviewQuestion[] = [];

    // Extract questions from the response using the new format
    const questionBlocks = responseText.split(/QUESTION \d+:/i).slice(1);

    questionBlocks.forEach((block) => {
      try {
        const lines = block.trim().split('\n');
        const question: Partial<InterviewQuestion> = {};

        lines.forEach(line => {
          const [key, ...valueParts] = line.split(':');
          const value = valueParts.join(':').trim();

          switch (key.trim().toLowerCase()) {
            case 'question':
              question.question = value;
              break;
            case 'type':
              const type = value.toLowerCase();
              question.type = type.includes('technical') ? 'technical' :
                            type.includes('behavioral') ? 'behavioral' : 'role-specific';
              break;
            case 'difficulty':
              const difficulty = value.toLowerCase();
              question.difficulty = difficulty.includes('beginner') ? 'beginner' :
                                   difficulty.includes('advanced') ? 'advanced' : 'intermediate';
              break;
            case 'reasoning':
              question.reasoning = value;
              break;
            case 'sample answer':
              question.sampleAnswer = value;
              break;
            case 'tips':
              question.tips = value.split(',').map(tip => tip.trim());
              break;
          }
        });

        if (question.question) {
          questions.push({
            question: question.question,
            type: question.type || 'role-specific',
            difficulty: question.difficulty || 'intermediate',
            reasoning: question.reasoning || 'Relevant to the role and candidate background',
            sampleAnswer: question.sampleAnswer,
            tips: question.tips || []
          });
        }
      } catch (error) {
        console.warn('Failed to parse question block:', error);
      }
    });

    return questions;
  };

  // Helper function to parse interview questions from AI response (fallback)
  const parseInterviewQuestions = (responseText: string): InterviewQuestion[] => {
    const questions: InterviewQuestion[] = [];
    
    // Extract questions from the response
    const questionMatches = responseText.match(/\d+\.\s*([^?]+\?)/g);
    
    if (questionMatches) {
      questionMatches.forEach((match) => {
        const question = match.replace(/^\d+\.\s*/, '').trim();
        questions.push({
          question,
          type: determineQuestionType(question),
          difficulty: 'intermediate',
          reasoning: 'Generated based on your resume and role requirements'
        });
      });
    }
    
    return questions;
  };

  // Helper functions for text extraction
  const extractSkills = (text: string): string[] => {
    const skillKeywords = ['skills', 'technologies', 'programming languages', 'tools'];
    const skills: string[] = [];
    
    // Simple extraction - look for common technical terms
    const commonSkills = [
      'JavaScript', 'Python', 'React', 'Node.js', 'Java', 'C++', 'SQL', 'HTML', 'CSS',
      'TypeScript', 'Angular', 'Vue', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Git'
    ];
    
    commonSkills.forEach(skill => {
      if (text.toLowerCase().includes(skill.toLowerCase())) {
        skills.push(skill);
      }
    });
    
    return skills;
  };

  const extractExperience = (text: string): string[] => {
    // Extract experience entries (simplified)
    const experiencePattern = /(\d{4})\s*[-–]\s*(\d{4}|present|current)/gi;
    const matches = text.match(experiencePattern);
    return matches || [];
  };

  const extractEducation = (text: string): string[] => {
    // Extract education entries (simplified)
    const educationKeywords = ['bachelor', 'master', 'phd', 'degree', 'university', 'college'];
    const education: string[] = [];
    
    educationKeywords.forEach(keyword => {
      const regex = new RegExp(`[^.]*${keyword}[^.]*`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        education.push(...matches);
      }
    });
    
    return education;
  };

  const extractListItems = (text: string, keywords: string[]): string[] => {
    const items: string[] = [];
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`${keyword}[^:]*:([^]*?)(?=\\n\\n|\\n[A-Z]|$)`, 'gi');
      const match = text.match(regex);
      if (match) {
        const listItems = match[0].split('\n').filter(line => 
          line.trim().startsWith('-') || line.trim().startsWith('•') || /^\d+\./.test(line.trim())
        );
        items.push(...listItems.map(item => item.replace(/^[-•\d.]\s*/, '').trim()));
      }
    });
    
    return items;
  };

  const determineQuestionType = (question: string): 'technical' | 'behavioral' | 'role-specific' => {
    const technicalKeywords = ['code', 'algorithm', 'database', 'programming', 'technical'];
    const behavioralKeywords = ['tell me about', 'describe a time', 'how do you handle', 'experience'];
    
    const lowerQuestion = question.toLowerCase();
    
    if (technicalKeywords.some(keyword => lowerQuestion.includes(keyword))) {
      return 'technical';
    } else if (behavioralKeywords.some(keyword => lowerQuestion.includes(keyword))) {
      return 'behavioral';
    } else {
      return 'role-specific';
    }
  };

  return {
    loading,
    resumeAnalysis,
    jobMatches,
    interviewQuestions,
    analyzeResume,
    findJobMatches,
    generateInterviewQuestions,
    setResumeAnalysis,
    setJobMatches,
    setInterviewQuestions
  };
};
