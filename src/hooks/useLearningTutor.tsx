import { useState } from 'react';
import { geminiService } from '@/lib/gemini';
import { useToast } from '@/hooks/use-toast';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface TutoringResponse {
  explanation: string;
  keyPoints: string[];
  examples: string[];
  practiceQuestions: string[];
  additionalResources: string[];
}

export interface LearningPreferences {
  subject: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  learningStyle: 'visual' | 'text-based' | 'hands-on';
  language: string;
}

export const useLearningTutor = () => {
  const [loading, setLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<TutoringResponse | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [learningHistory, setLearningHistory] = useState<Array<{
    question: string;
    response: TutoringResponse;
    timestamp: Date;
  }>>([]);
  const { toast } = useToast();

  const askQuestion = async (
    question: string,
    preferences: LearningPreferences
  ) => {
    setLoading(true);
    try {
      const response = await geminiService.generateTutoringResponse(
        preferences.subject,
        preferences.level,
        question,
        preferences.learningStyle,
        preferences.language
      );

      if (response.success) {
        const tutoringResponse = parseTutoringResponse(response.text);
        setCurrentResponse(tutoringResponse);
        
        // Add to learning history
        setLearningHistory(prev => [...prev, {
          question,
          response: tutoringResponse,
          timestamp: new Date()
        }]);

        toast({
          title: "Question Answered",
          description: "Your personalized explanation is ready!"
        });

        return tutoringResponse;
      } else {
        throw new Error(response.error || 'Failed to get tutoring response');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const generateQuiz = async (
    subject: string,
    level: string,
    questionCount: number = 5,
    topics?: string[]
  ) => {
    setLoading(true);
    try {
      const response = await geminiService.generateQuiz(
        subject,
        level,
        questionCount,
        topics
      );

      if (response.success) {
        const questions = parseQuizQuestions(response.text);
        setQuizQuestions(questions);

        toast({
          title: "Quiz Generated",
          description: `Generated ${questions.length} questions for ${subject}`
        });

        return questions;
      } else {
        throw new Error(response.error || 'Failed to generate quiz');
      }
    } catch (error) {
      toast({
        title: "Quiz Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate quiz",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getPersonalizedLearningPath = async (
    subject: string,
    currentLevel: string,
    goals: string[],
    timeframe: string = '3 months'
  ) => {
    setLoading(true);
    try {
      const response = await geminiService.generateLearningPath(
        subject,
        currentLevel,
        goals,
        timeframe
      );

      if (response.success) {
        toast({
          title: "Learning Path Created",
          description: "Your personalized learning path is ready!"
        });

        return response.text;
      } else {
        throw new Error(response.error || 'Failed to create learning path');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create learning path",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Helper function to parse tutoring response
  const parseTutoringResponse = (responseText: string): TutoringResponse => {
    try {
      // Initialize default response
      const response: TutoringResponse = {
        explanation: '',
        keyPoints: [],
        examples: [],
        practiceQuestions: [],
        additionalResources: []
      };

      // Extract explanation section
      const explanationMatch = responseText.match(/EXPLANATION:\s*([\s\S]*?)(?=\n\s*KEY POINTS:|$)/i);
      response.explanation = explanationMatch ? explanationMatch[1].trim() : extractMainExplanation(responseText);

      // Extract key points
      const keyPointsMatch = responseText.match(/KEY POINTS:\s*([\s\S]*?)(?=\n\s*EXAMPLES:|$)/i);
      if (keyPointsMatch) {
        response.keyPoints = extractBulletPoints(keyPointsMatch[1]);
      }

      // Extract examples
      const examplesMatch = responseText.match(/EXAMPLES:\s*([\s\S]*?)(?=\n\s*PRACTICE QUESTIONS:|$)/i);
      if (examplesMatch) {
        response.examples = extractBulletPoints(examplesMatch[1]);
      }

      // Extract practice questions
      const practiceMatch = responseText.match(/PRACTICE QUESTIONS:\s*([\s\S]*?)(?=\n\s*ADDITIONAL RESOURCES:|$)/i);
      if (practiceMatch) {
        response.practiceQuestions = extractBulletPoints(practiceMatch[1]);
      }

      // Extract additional resources
      const resourcesMatch = responseText.match(/ADDITIONAL RESOURCES:\s*([\s\S]*?)$/i);
      if (resourcesMatch) {
        response.additionalResources = extractBulletPoints(resourcesMatch[1]);
      }

      // Fallback to old parsing method if structured parsing fails
      if (!response.explanation && !response.keyPoints.length) {
        return {
          explanation: extractMainExplanation(responseText),
          keyPoints: extractListItems(responseText, ['key points', 'important points', 'main concepts']),
          examples: extractListItems(responseText, ['examples', 'example', 'for instance']),
          practiceQuestions: extractListItems(responseText, ['practice', 'exercises', 'try this']),
          additionalResources: extractListItems(responseText, ['resources', 'further reading', 'learn more'])
        };
      }

      return response;
    } catch (error) {
      console.error('Error parsing tutoring response:', error);
      // Return basic response with just the explanation
      return {
        explanation: responseText.substring(0, 500) + '...',
        keyPoints: [],
        examples: [],
        practiceQuestions: [],
        additionalResources: []
      };
    }
  };

  // Helper function to parse quiz questions
  const parseQuizQuestions = (responseText: string): QuizQuestion[] => {
    const questions: QuizQuestion[] = [];

    try {
      // Split by QUESTION pattern
      const questionBlocks = responseText.split(/QUESTION\s+\d+:/i).filter(block => block.trim());

      questionBlocks.forEach((block, index) => {
        if (index === 0 && !block.includes('A)')) return; // Skip intro text

        const lines = block.split('\n').filter(line => line.trim());
        if (lines.length < 6) return; // Need at least question + 4 options + answer + explanation

        let question = '';
        const options: string[] = [];
        let correctAnswerLetter = '';
        let explanation = '';

        // Extract question (first non-empty line)
        question = lines[0].trim().replace(/^\d+\.\s*/, '');

        // Extract options and other data
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();

          // Match options A), B), C), D)
          const optionMatch = line.match(/^([A-D])\)\s*(.+)$/);
          if (optionMatch) {
            options.push(optionMatch[2]);
            continue;
          }

          // Match correct answer
          const answerMatch = line.match(/CORRECT\s+ANSWER:\s*([A-D])/i);
          if (answerMatch) {
            correctAnswerLetter = answerMatch[1];
            continue;
          }

          // Match explanation
          const explanationMatch = line.match(/EXPLANATION:\s*(.+)/i);
          if (explanationMatch) {
            explanation = explanationMatch[1];
            continue;
          }
        }

        // Find the correct answer text based on the letter
        let correctAnswer = '';
        if (correctAnswerLetter && options.length === 4) {
          const answerIndex = correctAnswerLetter.charCodeAt(0) - 65; // A=0, B=1, C=2, D=3
          if (answerIndex >= 0 && answerIndex < options.length) {
            correctAnswer = options[answerIndex];
          }
        }

        if (question && options.length === 4 && correctAnswer) {
          questions.push({
            question,
            options,
            correctAnswer,
            explanation: explanation || 'No explanation provided',
            difficulty: 'medium'
          });
        }
      });

      // Fallback to old parsing method if new method fails
      if (questions.length === 0) {
        return parseQuizQuestionsLegacy(responseText);
      }

      return questions;
    } catch (error) {
      console.error('Error parsing quiz questions:', error);
      return parseQuizQuestionsLegacy(responseText);
    }
  };

  // Legacy parsing method as fallback
  const parseQuizQuestionsLegacy = (responseText: string): QuizQuestion[] => {
    const questions: QuizQuestion[] = [];

    // Split by question numbers
    const questionBlocks = responseText.split(/\d+\.\s+/).filter(block => block.trim());

    questionBlocks.forEach(block => {
      const lines = block.split('\n').filter(line => line.trim());
      if (lines.length < 6) return; // Need at least question + 4 options + answer

      const question = lines[0].replace(/\?.*/, '?').trim();
      const options: string[] = [];
      let correctAnswer = '';
      let explanation = '';

      // Extract options (A, B, C, D)
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (/^[A-D][\.\)]\s+/.test(line)) {
          const option = line.replace(/^[A-D][\.\)]\s+/, '');
          options.push(option);
        } else if (line.toLowerCase().includes('correct answer') || line.toLowerCase().includes('answer:')) {
          correctAnswer = extractCorrectAnswer(line);
        } else if (line.toLowerCase().includes('explanation')) {
          explanation = line.replace(/explanation:?\s*/i, '');
        }
      }

      if (question && options.length === 4 && correctAnswer) {
        questions.push({
          question,
          options,
          correctAnswer,
          explanation: explanation || 'No explanation provided',
          difficulty: 'medium'
        });
      }
    });

    return questions;
  };

  // Helper functions
  const extractMainExplanation = (text: string): string => {
    // Extract the first substantial paragraph as the main explanation
    const paragraphs = text.split('\n\n').filter(p => p.trim().length > 50);
    return paragraphs[0] || text.substring(0, 300);
  };

  // Helper function to extract bullet points from text
  const extractBulletPoints = (text: string): string[] => {
    const lines = text.split('\n').filter(line => line.trim());
    const bulletPoints: string[] = [];

    lines.forEach(line => {
      const trimmed = line.trim();
      // Match various bullet point formats
      if (trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.match(/^\d+\./)) {
        const cleaned = trimmed.replace(/^[-•\d\.]\s*/, '').trim();
        if (cleaned) {
          bulletPoints.push(cleaned);
        }
      }
    });

    return bulletPoints;
  };

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

  const extractCorrectAnswer = (line: string): string => {
    // Extract the correct answer letter or full text
    const match = line.match(/[A-D][\.\)]\s*([^]*?)(?=\n|$)/);
    if (match) {
      return match[1].trim();
    }
    
    // Fallback: look for just the letter
    const letterMatch = line.match(/[A-D]/);
    return letterMatch ? letterMatch[0] : '';
  };

  const clearHistory = () => {
    setLearningHistory([]);
    setCurrentResponse(null);
    setQuizQuestions([]);
  };

  return {
    loading,
    currentResponse,
    quizQuestions,
    learningHistory,
    askQuestion,
    generateQuiz,
    getPersonalizedLearningPath,
    clearHistory,
    setCurrentResponse,
    setQuizQuestions
  };
};
