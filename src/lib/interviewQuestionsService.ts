import { geminiService } from './gemini';

export interface InterviewQuestion {
  id: string;
  question: string;
  category: 'behavioral' | 'technical' | 'coding' | 'project-architecture' | 'general';
  difficulty: 'easy' | 'medium' | 'hard';
  sampleAnswer: string;
  tips: string[];
  timeLimit: number; // in minutes
  context?: string;
}

export interface InterviewQuestionsSet {
  id: string;
  jobTitle: string;
  jobDescription?: string;
  generatedAt: string;
  questions: InterviewQuestion[];
  totalQuestions: number;
  categories: {
    behavioral: number;
    technical: number;
    coding: number;
    'project-architecture': number;
    general: number;
  };
}

class InterviewQuestionsService {
  /**
   * Generate comprehensive interview questions with proper categorization
   */
  async generateInterviewQuestions(
    resumeText: string,
    jobTitle: string,
    jobDescription?: string,
    options: {
      totalQuestions?: number;
      difficulty?: 'easy' | 'medium' | 'hard';
      categories?: ('behavioral' | 'technical' | 'coding' | 'project-architecture')[];
    } = {}
  ): Promise<InterviewQuestionsSet> {
    const {
      totalQuestions = 15,
      difficulty = 'medium',
      categories = ['behavioral', 'technical', 'coding', 'project-architecture']
    } = options;

    // Calculate questions per category
    const questionsPerCategory = Math.floor(totalQuestions / categories.length);
    const remainingQuestions = totalQuestions % categories.length;

    const prompt = this.createEnhancedPrompt(
      resumeText,
      jobTitle,
      categories,
      questionsPerCategory,
      difficulty,
      jobDescription
    );

    try {
      const response = await geminiService.generateText(prompt);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to generate interview questions');
      }

      const questions = this.parseInterviewQuestions(response.text, categories);
      
      // Ensure we have the right number of questions
      const finalQuestions = this.balanceQuestions(questions, totalQuestions, categories);

      const categoryCounts = this.calculateCategoryCounts(finalQuestions);

      return {
        id: `interview-${Date.now()}`,
        jobTitle,
        jobDescription,
        generatedAt: new Date().toISOString(),
        questions: finalQuestions,
        totalQuestions: finalQuestions.length,
        categories: categoryCounts
      };
    } catch (error) {
      console.error('Error generating interview questions:', error);
      throw error;
    }
  }

  private createEnhancedPrompt(
    resumeText: string,
    jobTitle: string,
    categories: string[],
    questionsPerCategory: number,
    difficulty: string,
    jobDescription?: string
  ): string {
    return `
Generate comprehensive interview questions for a ${jobTitle} position at ${difficulty} difficulty level.

CANDIDATE RESUME:
${resumeText.substring(0, 2000)}

${jobDescription ? `JOB DESCRIPTION:\n${jobDescription.substring(0, 1000)}` : ''}

REQUIREMENTS:
Generate exactly ${questionsPerCategory} questions for each of these categories:
${categories.map(cat => `- ${cat.toUpperCase()}`).join('\n')}

For each question, provide the following in JSON format:
{
  "question": "The actual interview question",
  "category": "behavioral|technical|coding|project-architecture",
  "difficulty": "easy|medium|hard",
  "sampleAnswer": "A comprehensive sample answer that demonstrates best practices",
  "tips": ["Tip 1", "Tip 2", "Tip 3"],
  "timeLimit": number_in_minutes,
  "context": "Why this question is important and what it assesses"
}

CATEGORY GUIDELINES:

BEHAVIORAL Questions:
- Focus on past experiences, leadership, teamwork, problem-solving
- Use STAR method examples
- Assess soft skills and cultural fit
- Time limit: 5-8 minutes

TECHNICAL Questions:
- Role-specific technical knowledge
- System design concepts
- Best practices and methodologies
- Time limit: 10-15 minutes

CODING Questions:
- Algorithm and data structure problems
- Code optimization challenges
- Debugging scenarios
- Time limit: 20-30 minutes

PROJECT-ARCHITECTURE Questions:
- System design and architecture decisions
- Scalability and performance considerations
- Technology stack choices
- Time limit: 15-25 minutes

SAMPLE ANSWER REQUIREMENTS:
- Provide detailed, realistic answers
- Include specific examples and metrics where possible
- Demonstrate best practices
- Show thought process and reasoning

Return the questions as a JSON array of question objects.
`;
  }

  private parseInterviewQuestions(responseText: string, categories: string[]): InterviewQuestion[] {
    const questions: InterviewQuestion[] = [];
    
    try {
      // Try to parse as JSON first
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsedQuestions = JSON.parse(jsonMatch[0]);
        return parsedQuestions.map((q: any, index: number) => ({
          id: `q-${Date.now()}-${index}`,
          question: q.question || '',
          category: q.category || 'general',
          difficulty: q.difficulty || 'medium',
          sampleAnswer: q.sampleAnswer || q.sample_answer || '',
          tips: Array.isArray(q.tips) ? q.tips : [],
          timeLimit: q.timeLimit || q.time_limit || this.getDefaultTimeLimit(q.category),
          context: q.context || ''
        }));
      }

      // Fallback: Parse structured text
      const sections = responseText.split(/(?:BEHAVIORAL|TECHNICAL|CODING|PROJECT-ARCHITECTURE)/i);
      
      sections.forEach((section, sectionIndex) => {
        if (sectionIndex === 0) return; // Skip intro text
        
        const category = categories[sectionIndex - 1] || 'general';
        const questionBlocks = section.split(/\d+\./);
        
        questionBlocks.forEach((block, blockIndex) => {
          if (blockIndex === 0) return; // Skip section header
          
          const question = this.extractQuestionFromBlock(block, category);
          if (question.question) {
            questions.push({
              ...question,
              id: `q-${Date.now()}-${sectionIndex}-${blockIndex}`
            });
          }
        });
      });

    } catch (error) {
      console.error('Error parsing interview questions:', error);
      // Return fallback questions if parsing fails
      return this.generateFallbackQuestions(categories);
    }

    return questions;
  }

  private extractQuestionFromBlock(block: string, category: string): Omit<InterviewQuestion, 'id'> {
    const lines = block.trim().split('\n').filter(line => line.trim());
    
    return {
      question: lines[0]?.trim() || '',
      category: category as any,
      difficulty: 'medium',
      sampleAnswer: this.extractSampleAnswer(block),
      tips: this.extractTips(block),
      timeLimit: this.getDefaultTimeLimit(category),
      context: this.extractContext(block)
    };
  }

  private extractSampleAnswer(block: string): string {
    const answerMatch = block.match(/(?:Sample Answer|Answer):\s*([\s\S]*?)(?:\n\n|Tips:|Context:|$)/i);
    return answerMatch ? answerMatch[1].trim() : '';
  }

  private extractTips(block: string): string[] {
    const tipsMatch = block.match(/Tips?:\s*([\s\S]*?)(?:\n\n|Context:|$)/i);
    if (tipsMatch) {
      return tipsMatch[1]
        .split(/[-•]\s*/)
        .filter(tip => tip.trim())
        .map(tip => tip.trim());
    }
    return [];
  }

  private extractContext(block: string): string {
    const contextMatch = block.match(/Context:\s*([\s\S]*?)$/i);
    return contextMatch ? contextMatch[1].trim() : '';
  }

  private getDefaultTimeLimit(category: string): number {
    switch (category) {
      case 'behavioral': return 7;
      case 'technical': return 12;
      case 'coding': return 25;
      case 'project-architecture': return 20;
      default: return 10;
    }
  }

  private balanceQuestions(
    questions: InterviewQuestion[],
    targetTotal: number,
    categories: string[]
  ): InterviewQuestion[] {
    // Group questions by category
    const questionsByCategory = categories.reduce((acc, cat) => {
      acc[cat] = questions.filter(q => q.category === cat);
      return acc;
    }, {} as Record<string, InterviewQuestion[]>);

    const questionsPerCategory = Math.floor(targetTotal / categories.length);
    const balanced: InterviewQuestion[] = [];

    // Take equal number from each category
    categories.forEach(category => {
      const categoryQuestions = questionsByCategory[category] || [];
      balanced.push(...categoryQuestions.slice(0, questionsPerCategory));
    });

    // Fill remaining slots with any available questions
    const remaining = targetTotal - balanced.length;
    const allRemaining = questions.filter(q => !balanced.includes(q));
    balanced.push(...allRemaining.slice(0, remaining));

    return balanced;
  }

  private calculateCategoryCounts(questions: InterviewQuestion[]) {
    return questions.reduce((acc, q) => {
      acc[q.category] = (acc[q.category] || 0) + 1;
      return acc;
    }, {
      behavioral: 0,
      technical: 0,
      coding: 0,
      'project-architecture': 0,
      general: 0
    });
  }

  private calculateCategoryCountsFromData(questionsData: any[]) {
    return questionsData.reduce((acc, q) => {
      const category = q.category || 'general';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {
      behavioral: 0,
      technical: 0,
      coding: 0,
      'project-architecture': 0,
      general: 0
    });
  }

  private generateFallbackQuestions(categories: string[]): InterviewQuestion[] {
    const fallbackQuestions: InterviewQuestion[] = [
      {
        id: 'fallback-1',
        question: 'Tell me about a challenging project you worked on and how you overcame obstacles.',
        category: 'behavioral',
        difficulty: 'medium',
        sampleAnswer: 'Use the STAR method to describe a specific situation, task, action, and result.',
        tips: ['Be specific', 'Focus on your role', 'Highlight problem-solving skills'],
        timeLimit: 7
      },
      {
        id: 'fallback-2',
        question: 'Explain the difference between synchronous and asynchronous programming.',
        category: 'technical',
        difficulty: 'medium',
        sampleAnswer: 'Synchronous programming executes code sequentially, while asynchronous allows non-blocking operations.',
        tips: ['Provide examples', 'Mention use cases', 'Discuss performance implications'],
        timeLimit: 12
      }
    ];

    return fallbackQuestions;
  }

  /**
   * Save interview questions to database
   */
  async saveToDatabase(
    userId: string,
    questionsSet: InterviewQuestionsSet
  ): Promise<string> {
    const { supabase } = await import('@/integrations/supabase/client');

    try {
      // Insert question set using type assertion to bypass TypeScript errors
      const { data: questionSetData, error: setError } = await (supabase as any)
        .from('interview_question_sets')
        .insert({
          user_id: userId,
          job_title: questionsSet.jobTitle,
          job_description: questionsSet.jobDescription,
          total_questions: questionsSet.totalQuestions,
          generated_at: questionsSet.generatedAt
        })
        .select('id')
        .single();

      if (setError) throw setError;

      // Insert individual questions
      const questionsToInsert = questionsSet.questions.map((q, index) => ({
        question_set_id: questionSetData.id,
        question: q.question,
        category: q.category,
        difficulty: q.difficulty,
        sample_answer: q.sampleAnswer,
        tips: q.tips,
        time_limit: q.timeLimit,
        context: q.context,
        order_index: index
      }));

      const { error: questionsError } = await (supabase as any)
        .from('interview_questions')
        .insert(questionsToInsert);

      if (questionsError) throw questionsError;

      return questionSetData.id;
    } catch (error) {
      console.error('Error saving interview questions to database:', error);
      throw error;
    }
  }

  /**
   * Load interview questions from database
   */
  async loadFromDatabase(userId: string, setId?: string): Promise<InterviewQuestionsSet[]> {
    const { supabase } = await import('@/integrations/supabase/client');

    try {
      let query = (supabase as any)
        .from('interview_question_sets')
        .select(`
          *,
          interview_questions (
            id,
            question,
            category,
            difficulty,
            sample_answer,
            tips,
            time_limit,
            context,
            order_index
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (setId) {
        query = query.eq('id', setId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).map((set: any) => ({
        id: set.id,
        jobTitle: set.job_title,
        jobDescription: set.job_description,
        generatedAt: set.generated_at,
        totalQuestions: set.total_questions,
        questions: (set.interview_questions || [])
          .sort((a: any, b: any) => a.order_index - b.order_index)
          .map((q: any) => ({
            id: q.id,
            question: q.question,
            category: q.category,
            difficulty: q.difficulty,
            sampleAnswer: q.sample_answer || '',
            tips: q.tips || [],
            timeLimit: q.time_limit || 10,
            context: q.context || ''
          })),
        categories: this.calculateCategoryCountsFromData(set.interview_questions || [])
      }));
    } catch (error) {
      console.error('Error loading interview questions from database:', error);
      throw error;
    }
  }
}

export const interviewQuestionsService = new InterviewQuestionsService();
