import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { 
  interviewQuestionsService, 
  InterviewQuestionsSet, 
  InterviewQuestion 
} from '@/lib/interviewQuestionsService';

export const useInterviewQuestions = () => {
  const [questionSets, setQuestionSets] = useState<InterviewQuestionsSet[]>([]);
  const [currentSet, setCurrentSet] = useState<InterviewQuestionsSet | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load all question sets for the user
  const loadQuestionSets = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const sets = await interviewQuestionsService.loadFromDatabase(user.id);
      setQuestionSets(sets);
    } catch (error) {
      console.error('Error loading question sets:', error);
      toast({
        title: "Error",
        description: "Failed to load interview questions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Load a specific question set
  const loadQuestionSet = async (setId: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const sets = await interviewQuestionsService.loadFromDatabase(user.id, setId);
      if (sets.length > 0) {
        setCurrentSet(sets[0]);
      }
    } catch (error) {
      console.error('Error loading question set:', error);
      toast({
        title: "Error",
        description: "Failed to load interview question set",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate new interview questions
  const generateQuestions = async (
    resumeText: string,
    jobTitle: string,
    jobDescription?: string,
    options?: {
      totalQuestions?: number;
      difficulty?: 'easy' | 'medium' | 'hard';
      categories?: ('behavioral' | 'technical' | 'coding' | 'project-architecture')[];
    }
  ) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to generate interview questions",
        variant: "destructive"
      });
      return null;
    }

    setGenerating(true);
    try {
      // Generate questions using the service
      const questionsSet = await interviewQuestionsService.generateInterviewQuestions(
        resumeText,
        jobTitle,
        jobDescription,
        options
      );

      // Save to database
      const setId = await interviewQuestionsService.saveToDatabase(user.id, questionsSet);
      
      // Update the set with the database ID
      const updatedSet = { ...questionsSet, id: setId };
      
      // Update local state
      setQuestionSets(prev => [updatedSet, ...prev]);
      setCurrentSet(updatedSet);

      toast({
        title: "Questions Generated",
        description: `Generated ${questionsSet.totalQuestions} interview questions for ${jobTitle}`,
      });

      return updatedSet;
    } catch (error) {
      console.error('Error generating questions:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate interview questions",
        variant: "destructive"
      });
      return null;
    } finally {
      setGenerating(false);
    }
  };

  // Delete a question set
  const deleteQuestionSet = async (setId: string) => {
    if (!user) return;

    try {
      const { supabase } = await import('@/integrations/supabase/client');

      const { error } = await (supabase as any)
        .from('interview_question_sets')
        .delete()
        .eq('id', setId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setQuestionSets(prev => prev.filter(set => set.id !== setId));
      if (currentSet?.id === setId) {
        setCurrentSet(null);
      }

      toast({
        title: "Questions Deleted",
        description: "Interview question set has been deleted",
      });
    } catch (error) {
      console.error('Error deleting question set:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete interview question set",
        variant: "destructive"
      });
    }
  };

  // Get questions by category
  const getQuestionsByCategory = (category: string) => {
    if (!currentSet) return [];
    return currentSet.questions.filter(q => q.category === category);
  };

  // Get category statistics
  const getCategoryStats = () => {
    if (!currentSet) return {};
    return currentSet.categories;
  };

  // Export questions as formatted text
  const exportQuestionsAsText = (set?: InterviewQuestionsSet) => {
    const targetSet = set || currentSet;
    if (!targetSet) return '';

    let exportText = `# Interview Questions for ${targetSet.jobTitle}\n\n`;
    exportText += `Generated on: ${new Date(targetSet.generatedAt).toLocaleDateString()}\n`;
    exportText += `Total Questions: ${targetSet.totalQuestions}\n\n`;

    if (targetSet.jobDescription) {
      exportText += `## Job Description\n${targetSet.jobDescription}\n\n`;
    }

    // Group questions by category
    const categories = ['behavioral', 'technical', 'coding', 'project-architecture', 'general'];
    
    categories.forEach(category => {
      const categoryQuestions = targetSet.questions.filter(q => q.category === category);
      if (categoryQuestions.length === 0) return;

      exportText += `## ${category.charAt(0).toUpperCase() + category.slice(1)} Questions\n\n`;
      
      categoryQuestions.forEach((question, index) => {
        exportText += `### Question ${index + 1}\n`;
        exportText += `**Question:** ${question.question}\n\n`;
        exportText += `**Difficulty:** ${question.difficulty}\n`;
        exportText += `**Time Limit:** ${question.timeLimit} minutes\n\n`;
        
        if (question.context) {
          exportText += `**Context:** ${question.context}\n\n`;
        }
        
        if (question.sampleAnswer) {
          exportText += `**Sample Answer:**\n${question.sampleAnswer}\n\n`;
        }
        
        if (question.tips.length > 0) {
          exportText += `**Tips:**\n`;
          question.tips.forEach(tip => {
            exportText += `- ${tip}\n`;
          });
          exportText += '\n';
        }
        
        exportText += '---\n\n';
      });
    });

    return exportText;
  };

  // Load question sets on component mount
  useEffect(() => {
    if (user) {
      loadQuestionSets();
    }
  }, [user]);

  return {
    questionSets,
    currentSet,
    loading,
    generating,
    loadQuestionSets,
    loadQuestionSet,
    generateQuestions,
    deleteQuestionSet,
    getQuestionsByCategory,
    getCategoryStats,
    exportQuestionsAsText,
    setCurrentSet
  };
};
