import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI with API key from environment variables
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

if (!GEMINI_API_KEY) {
  console.warn('VITE_GEMINI_API_KEY not found in environment variables');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Use the specified model: gemini-2.0-flash
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

export interface GeminiResponse {
  text: string;
  success: boolean;
  error?: string;
}

export class GeminiService {
  private static instance: GeminiService;

  private constructor() {}

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  /**
   * Generate text using Gemini AI
   */
  async generateText(prompt: string): Promise<GeminiResponse> {
    try {
      if (!GEMINI_API_KEY) {
        return {
          text: '',
          success: false,
          error: 'Gemini API key not configured'
        };
      }

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        text,
        success: true
      };
    } catch (error) {
      console.error('Gemini API error:', error);
      return {
        text: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Analyze resume content
   */
  async analyzeResume(resumeText: string, jobDescription?: string): Promise<GeminiResponse> {
    const prompt = jobDescription 
      ? `Analyze this resume against the job description and provide detailed feedback:

Resume:
${resumeText}

Job Description:
${jobDescription}

Please provide:
1. Match percentage (0-100%)
2. Key strengths that align with the job
3. Areas for improvement
4. Missing skills or qualifications
5. Specific recommendations

Format your response in a clear, structured manner.`
      : `Analyze this resume and provide comprehensive feedback:

Resume:
${resumeText}

Please provide:
1. Overall assessment
2. Key strengths
3. Areas for improvement
4. Skills analysis
5. Recommendations for enhancement

Format your response in a clear, structured manner.`;

    return this.generateText(prompt);
  }

  /**
   * Generate interview questions based on resume and job role
   */
  async generateInterviewQuestions(
    resumeText: string, 
    jobRole: string, 
    difficulty: 'beginner' | 'intermediate' | 'advanced' = 'intermediate',
    questionCount: number = 5
  ): Promise<GeminiResponse> {
    const prompt = `Generate ${questionCount} ${difficulty} level interview questions for a ${jobRole} position based on this resume:

Resume:
${resumeText}

Please provide:
1. Technical questions relevant to the candidate's skills
2. Behavioral questions based on their experience
3. Role-specific questions for ${jobRole}

Format each question clearly and include the reasoning for why each question is relevant.`;

    return this.generateText(prompt);
  }

  /**
   * Search and match jobs based on resume
   */
  async matchJobs(resumeText: string, preferences?: {
    location?: string;
    jobType?: string;
    salaryRange?: string;
  }): Promise<GeminiResponse> {
    const preferencesText = preferences 
      ? `
Preferences:
- Location: ${preferences.location || 'Any'}
- Job Type: ${preferences.jobType || 'Any'}
- Salary Range: ${preferences.salaryRange || 'Not specified'}`
      : '';

    const prompt = `Based on this resume, suggest suitable job roles and provide job search guidance:

Resume:
${resumeText}
${preferencesText}

Please provide:
1. Top 5 suitable job roles/titles
2. Key skills to highlight in job applications
3. Industries that would be a good fit
4. Recommended job search strategies
5. Skills to develop for better opportunities

Format your response in a clear, actionable manner.`;

    return this.generateText(prompt);
  }

  /**
   * Search for jobs using AI when SERP API fails
   */
  async searchJobsWithAI(resumeText: string, location: string = 'United States'): Promise<GeminiResponse> {
    const prompt = `
    Based on this resume, search for and suggest real job opportunities that are currently available:

    RESUME:
    ${resumeText}

    LOCATION: ${location}

    Please search for actual job openings and provide detailed information in this format:

    JOB 1:
    Title: [Exact job title]
    Company: [Company name - use real companies when possible]
    Location: [Specific location]
    Match Score: [0-100]%

    Job Description:
    [Provide a comprehensive 3-4 paragraph description including:
    - What the role involves day-to-day
    - Team structure and reporting
    - Key projects and responsibilities
    - Growth opportunities]

    Required Qualifications:
    - [List 6-8 specific requirements including:]
    - [Education requirements]
    - [Years of experience needed]
    - [Technical skills and tools]
    - [Certifications if applicable]

    Preferred Qualifications:
    - [List 4-6 nice-to-have skills]
    - [Advanced technical skills]
    - [Industry experience]
    - [Leadership or project management experience]

    Responsibilities:
    - [List 5-7 key job responsibilities]
    - [Be specific about daily tasks]
    - [Include collaboration aspects]

    Benefits & Compensation:
    - Salary Range: [Realistic range for role and location]
    - [Health insurance, dental, vision]
    - [PTO and vacation policy]
    - [401k or retirement benefits]
    - [Professional development opportunities]
    - [Remote work options if applicable]

    Company Information:
    - Industry: [Specific industry]
    - Company Size: [Startup/Small/Medium/Large Enterprise]
    - Founded: [Year if known]
    - About: [2-3 sentences about company mission and culture]

    Job Type: [Full-time/Part-time/Contract/Remote/Hybrid]
    Posted Date: [Recent date]
    Apply URL: [Use realistic job board URLs like LinkedIn, Indeed, company careers page]
    Key Skills: [List 8-10 technical and soft skills]
    Why Good Match: [3-4 specific reasons why this matches the resume]

    Please provide 8-10 realistic job opportunities that:
    1. Match the candidate's experience level and career progression
    2. Align with their technical skills and domain expertise
    3. Are appropriate for their career stage and salary expectations
    4. Include a mix of companies (startups, mid-size, enterprise)
    5. Have realistic and competitive salary ranges for the role and location
    6. Represent current market demand and trending technologies
    7. Include both direct matches and stretch opportunities for growth

    Focus on current market opportunities with specific, detailed information that reflects real job market conditions.
    `;

    return this.generateText(prompt);
  }

  /**
   * Generate personalized learning content
   */
  async generateTutoringResponse(
    subject: string,
    level: string,
    question: string,
    learningStyle: string = 'text-based',
    language: string = 'English'
  ): Promise<GeminiResponse> {
    const prompt = `As an expert AI tutor, provide a comprehensive explanation for this ${level} level ${subject} question.

QUESTION: ${question}

STUDENT PROFILE:
- Learning Level: ${level}
- Learning Style: ${learningStyle}
- Language: ${language}

Please structure your response EXACTLY as follows:

EXPLANATION:
[Provide a clear, detailed explanation of the concept. Make it engaging and appropriate for ${level} level. Use ${learningStyle} approach.]

KEY POINTS:
- [First key point]
- [Second key point]
- [Third key point]
- [Additional key points as needed]

EXAMPLES:
- [First practical example with clear explanation]
- [Second example if relevant]
- [Additional examples as needed]

PRACTICE QUESTIONS:
- [First practice question]
- [Second practice question]
- [Additional practice questions]

ADDITIONAL RESOURCES:
- [First resource or study tip]
- [Second resource or study tip]
- [Additional resources as needed]

Make sure to use ${language} language and tailor the complexity to ${level} level students.`;

    return this.generateText(prompt);
  }

  /**
   * Generate quiz questions for learning
   */
  async generateQuiz(
    subject: string,
    level: string,
    questionCount: number = 5,
    topics?: string[]
  ): Promise<GeminiResponse> {
    const topicsText = topics && topics.length > 0
      ? `Focus specifically on these topics: ${topics.join(', ')}`
      : `Cover various important topics in ${subject}`;

    const prompt = `Generate exactly ${questionCount} multiple-choice quiz questions for ${level} level ${subject}.
${topicsText}

Format each question EXACTLY as follows:

QUESTION 1:
What is [question text]?

A) [First option]
B) [Second option]
C) [Third option]
D) [Fourth option]

CORRECT ANSWER: [Letter only, e.g., B]
EXPLANATION: [Brief explanation of why this answer is correct]

QUESTION 2:
[Next question following the same format]

Continue this exact format for all ${questionCount} questions. Make sure:
- Questions are appropriate for ${level} level
- All options are plausible but only one is correct
- Explanations are clear and educational
- Questions test understanding, not just memorization`;

    return this.generateText(prompt);
  }

  /**
   * Generate personalized learning path
   */
  async generateLearningPath(
    subject: string,
    currentLevel: string,
    goals: string[],
    timeframe: string = '3 months'
  ): Promise<GeminiResponse> {
    const goalsText = goals.length > 0 ? goals.join(', ') : 'general mastery';

    const prompt = `Create a comprehensive personalized learning path for ${subject} at ${currentLevel} level.

STUDENT GOALS: ${goalsText}
TIMEFRAME: ${timeframe}

Structure your response EXACTLY as follows:

LEARNING ROADMAP:
[Provide an overview of the learning journey with major milestones]

PHASE 1: Foundation (Weeks 1-4)
Topics:
- [Topic 1 with brief description]
- [Topic 2 with brief description]
- [Additional topics]

Estimated Time: [X hours per week]
Key Skills: [Skills to be developed]

PHASE 2: Intermediate (Weeks 5-8)
Topics:
- [Topic 1 with brief description]
- [Topic 2 with brief description]
- [Additional topics]

Estimated Time: [X hours per week]
Key Skills: [Skills to be developed]

PHASE 3: Advanced (Weeks 9-12)
Topics:
- [Topic 1 with brief description]
- [Topic 2 with brief description]
- [Additional topics]

Estimated Time: [X hours per week]
Key Skills: [Skills to be developed]

PRACTICE PROJECTS:
- [Project 1: Description and learning objectives]
- [Project 2: Description and learning objectives]
- [Additional projects]

ASSESSMENT METHODS:
- [Assessment 1: Type and purpose]
- [Assessment 2: Type and purpose]
- [Additional assessments]

RECOMMENDED RESOURCES:
- [Resource 1: Type and description]
- [Resource 2: Type and description]
- [Additional resources]

Make the path progressive, practical, and achievable within the ${timeframe} timeframe.`;

    return this.generateText(prompt);
  }

  /**
   * Analyze candidate for recruitment
   */
  async analyzeCandidateForRecruitment(
    resumeText: string,
    jobRequirements: string[],
    roleTitle: string
  ): Promise<GeminiResponse> {
    const prompt = `As a recruitment specialist, analyze this candidate for the ${roleTitle} position:

Resume:
${resumeText}

Job Requirements:
${jobRequirements.map((req, index) => `${index + 1}. ${req}`).join('\n')}

Please provide:
1. Candidate fit score (0-100%)
2. Strengths that match the role
3. Potential concerns or gaps
4. Interview focus areas
5. Recommendation (Strong Fit / Good Fit / Weak Fit / Not Suitable)
6. Specific questions to ask in interview

Format your analysis professionally for recruitment decision-making.`;

    return this.generateText(prompt);
  }
}

// Export singleton instance
export const geminiService = GeminiService.getInstance();
