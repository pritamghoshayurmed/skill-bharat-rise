import { useState } from 'react';
import { geminiService } from '@/lib/gemini';
import { useToast } from '@/hooks/use-toast';

export interface CandidateAnalysis {
  fitScore: number;
  recommendation: 'Strong Fit' | 'Good Fit' | 'Weak Fit' | 'Not Suitable';
  strengths: string[];
  concerns: string[];
  interviewFocus: string[];
  suggestedQuestions: string[];
  skillsMatch: {
    matched: string[];
    missing: string[];
  };
}

export interface ResumeScreening {
  candidateName: string;
  resumeText: string;
  analysis: CandidateAnalysis;
  timestamp: Date;
}

export interface InterviewQuestionSet {
  technical: string[];
  behavioral: string[];
  roleSpecific: string[];
  difficulty: 'entry' | 'mid' | 'senior';
}

export const useRecruitmentAgent = () => {
  const [loading, setLoading] = useState(false);
  const [screenedCandidates, setScreenedCandidates] = useState<ResumeScreening[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<CandidateAnalysis | null>(null);
  const [interviewQuestions, setInterviewQuestions] = useState<InterviewQuestionSet | null>(null);
  const { toast } = useToast();

  const analyzeCandidate = async (
    resumeText: string,
    jobRequirements: string[],
    roleTitle: string,
    candidateName?: string
  ) => {
    setLoading(true);
    try {
      const response = await geminiService.analyzeCandidateForRecruitment(
        resumeText,
        jobRequirements,
        roleTitle
      );

      if (response.success) {
        const analysis = parseCandidateAnalysis(response.text);
        setCurrentAnalysis(analysis);

        // Add to screened candidates
        const screening: ResumeScreening = {
          candidateName: candidateName || 'Anonymous Candidate',
          resumeText,
          analysis,
          timestamp: new Date()
        };
        
        setScreenedCandidates(prev => [screening, ...prev]);

        toast({
          title: "Candidate Analysis Complete",
          description: `Analysis complete for ${roleTitle} position. Fit score: ${analysis.fitScore}%`
        });

        return analysis;
      } else {
        throw new Error(response.error || 'Failed to analyze candidate');
      }
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze candidate",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const generateInterviewQuestions = async (
    roleTitle: string,
    requiredSkills: string[],
    experienceLevel: 'entry' | 'mid' | 'senior' = 'mid',
    candidateResume?: string
  ) => {
    setLoading(true);
    try {
      const prompt = `Generate comprehensive interview questions for a ${roleTitle} position at ${experienceLevel} level.

Required Skills: ${requiredSkills.join(', ')}
${candidateResume ? `\nCandidate Resume Context:\n${candidateResume.substring(0, 1000)}...` : ''}

Please provide:
1. 5 Technical questions specific to the required skills
2. 5 Behavioral questions for assessing soft skills and culture fit
3. 5 Role-specific questions for ${roleTitle}

Format each section clearly with numbered questions.`;

      const response = await geminiService.generateText(prompt);

      if (response.success) {
        const questions = parseInterviewQuestions(response.text, experienceLevel);
        setInterviewQuestions(questions);

        toast({
          title: "Interview Questions Generated",
          description: `Generated comprehensive question set for ${roleTitle} position`
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
      return null;
    } finally {
      setLoading(false);
    }
  };

  const batchScreenCandidates = async (
    candidates: Array<{ name: string; resumeText: string }>,
    jobRequirements: string[],
    roleTitle: string
  ) => {
    setLoading(true);
    const results: ResumeScreening[] = [];

    try {
      for (const candidate of candidates) {
        const analysis = await analyzeCandidate(
          candidate.resumeText,
          jobRequirements,
          roleTitle,
          candidate.name
        );

        if (analysis) {
          results.push({
            candidateName: candidate.name,
            resumeText: candidate.resumeText,
            analysis,
            timestamp: new Date()
          });
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      toast({
        title: "Batch Screening Complete",
        description: `Analyzed ${results.length} candidates for ${roleTitle} position`
      });

      return results;
    } catch (error) {
      toast({
        title: "Batch Screening Failed",
        description: error instanceof Error ? error.message : "Failed to complete batch screening",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const compareResumes = async (
    resumes: Array<{ name: string; text: string }>,
    jobRequirements: string[],
    roleTitle: string
  ) => {
    setLoading(true);
    try {
      const resumeTexts = resumes.map(r => `${r.name}:\n${r.text}`).join('\n\n---\n\n');
      
      const prompt = `Compare these ${resumes.length} candidates for the ${roleTitle} position and rank them.

Job Requirements: ${jobRequirements.join(', ')}

Candidates:
${resumeTexts}

Please provide:
1. Ranking from best to worst fit
2. Comparison matrix of key skills
3. Strengths and weaknesses of each candidate
4. Final recommendation for top 3 candidates

Format the response clearly with sections for each candidate.`;

      const response = await geminiService.generateText(prompt);

      if (response.success) {
        toast({
          title: "Resume Comparison Complete",
          description: `Compared ${resumes.length} candidates for ${roleTitle} position`
        });

        return response.text;
      } else {
        throw new Error(response.error || 'Failed to compare resumes');
      }
    } catch (error) {
      toast({
        title: "Comparison Failed",
        description: error instanceof Error ? error.message : "Failed to compare resumes",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Helper function to parse candidate analysis
  const parseCandidateAnalysis = (responseText: string): CandidateAnalysis => {
    // Extract fit score
    const scoreMatch = responseText.match(/(\d+)%/);
    const fitScore = scoreMatch ? parseInt(scoreMatch[1]) : 0;

    // Extract recommendation
    const recommendations = ['Strong Fit', 'Good Fit', 'Weak Fit', 'Not Suitable'];
    const recommendation = recommendations.find(rec => 
      responseText.toLowerCase().includes(rec.toLowerCase())
    ) as CandidateAnalysis['recommendation'] || 'Weak Fit';

    return {
      fitScore,
      recommendation,
      strengths: extractListItems(responseText, ['strengths', 'strong points', 'advantages']),
      concerns: extractListItems(responseText, ['concerns', 'gaps', 'weaknesses', 'issues']),
      interviewFocus: extractListItems(responseText, ['interview focus', 'focus areas', 'areas to explore']),
      suggestedQuestions: extractListItems(responseText, ['questions', 'interview questions', 'ask about']),
      skillsMatch: {
        matched: extractListItems(responseText, ['matched skills', 'relevant skills', 'has experience']),
        missing: extractListItems(responseText, ['missing skills', 'lacks', 'needs development'])
      }
    };
  };

  // Helper function to parse interview questions
  const parseInterviewQuestions = (responseText: string, difficulty: 'entry' | 'mid' | 'senior'): InterviewQuestionSet => {
    const sections = responseText.split(/\n\n+/);
    
    return {
      technical: extractQuestions(responseText, ['technical', 'technical questions']),
      behavioral: extractQuestions(responseText, ['behavioral', 'behavioral questions', 'soft skills']),
      roleSpecific: extractQuestions(responseText, ['role-specific', 'role specific', 'position specific']),
      difficulty
    };
  };

  // Helper function to extract list items
  const extractListItems = (text: string, keywords: string[]): string[] => {
    const items: string[] = [];
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`${keyword}[^:]*:([^]*?)(?=\\n\\n|\\n[A-Z]|$)`, 'gi');
      const match = text.match(regex);
      if (match) {
        const listItems = match[0].split('\n').filter(line => 
          line.trim().startsWith('-') || 
          line.trim().startsWith('•') || 
          /^\d+\./.test(line.trim()) ||
          line.trim().startsWith('*')
        );
        items.push(...listItems.map(item => 
          item.replace(/^[-•*\d.]\s*/, '').trim()
        ).filter(item => item.length > 0));
      }
    });
    
    return items;
  };

  // Helper function to extract questions
  const extractQuestions = (text: string, keywords: string[]): string[] => {
    const questions: string[] = [];
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`${keyword}[^:]*:([^]*?)(?=\\n\\n|\\n[A-Z]|$)`, 'gi');
      const match = text.match(regex);
      if (match) {
        const questionLines = match[0].split('\n').filter(line => 
          (line.trim().startsWith('-') || 
           line.trim().startsWith('•') || 
           /^\d+\./.test(line.trim()) ||
           line.trim().startsWith('*')) &&
          line.includes('?')
        );
        questions.push(...questionLines.map(line => 
          line.replace(/^[-•*\d.]\s*/, '').trim()
        ).filter(q => q.length > 0));
      }
    });
    
    return questions;
  };

  const clearAnalysis = () => {
    setCurrentAnalysis(null);
    setInterviewQuestions(null);
  };

  const removeCandidate = (index: number) => {
    setScreenedCandidates(prev => prev.filter((_, i) => i !== index));
  };

  return {
    loading,
    screenedCandidates,
    currentAnalysis,
    interviewQuestions,
    analyzeCandidate,
    generateInterviewQuestions,
    batchScreenCandidates,
    compareResumes,
    clearAnalysis,
    removeCandidate,
    setCurrentAnalysis,
    setInterviewQuestions
  };
};
