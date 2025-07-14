import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  MessageSquare, 
  Brain, 
  Code, 
  Users, 
  Target,
  ChevronDown,
  ChevronUp,
  Clock,
  Star,
  Lightbulb,
  CheckCircle,
  Download,
  Play,
  Pause
} from 'lucide-react';
import { pdfExportService } from '@/lib/pdfExport';

interface Question {
  id: string;
  question: string;
  category: 'technical' | 'behavioral' | 'role-specific' | 'general';
  difficulty: 'easy' | 'medium' | 'hard';
  sampleAnswer?: string;
  tips?: string[];
  timeLimit?: number;
}

interface InterviewPrepDisplayProps {
  questions: string[];
  jobTitle?: string;
  onExport?: () => void;
}

export const InterviewPrepDisplay = ({ questions, jobTitle, onExport }: InterviewPrepDisplayProps) => {
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [practiceMode, setPracticeMode] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Parse and categorize questions
  const categorizedQuestions: Question[] = questions.map((q, index) => {
    const question = q.trim();
    let category: Question['category'] = 'general';
    let difficulty: Question['difficulty'] = 'medium';

    // Categorize based on keywords
    if (question.toLowerCase().includes('technical') || 
        question.toLowerCase().includes('code') || 
        question.toLowerCase().includes('algorithm') ||
        question.toLowerCase().includes('programming')) {
      category = 'technical';
    } else if (question.toLowerCase().includes('team') || 
               question.toLowerCase().includes('conflict') || 
               question.toLowerCase().includes('leadership') ||
               question.toLowerCase().includes('challenge')) {
      category = 'behavioral';
    } else if (jobTitle && question.toLowerCase().includes(jobTitle.toLowerCase())) {
      category = 'role-specific';
    }

    // Determine difficulty
    if (question.length > 100 || question.includes('complex') || question.includes('advanced')) {
      difficulty = 'hard';
    } else if (question.length < 50 || question.includes('basic') || question.includes('simple')) {
      difficulty = 'easy';
    }

    return {
      id: `q-${index}`,
      question,
      category,
      difficulty,
      timeLimit: category === 'technical' ? 30 : 15
    };
  });

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const getCategoryIcon = (category: Question['category']) => {
    switch (category) {
      case 'technical': return <Code className="w-4 h-4" />;
      case 'behavioral': return <Users className="w-4 h-4" />;
      case 'role-specific': return <Target className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: Question['category']) => {
    switch (category) {
      case 'technical': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'behavioral': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'role-specific': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getDifficultyColor = (difficulty: Question['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-300';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300';
      case 'hard': return 'bg-red-500/20 text-red-300';
    }
  };

  const filteredQuestions = selectedCategory === 'all' 
    ? categorizedQuestions 
    : categorizedQuestions.filter(q => q.category === selectedCategory);

  const categoryStats = {
    technical: categorizedQuestions.filter(q => q.category === 'technical').length,
    behavioral: categorizedQuestions.filter(q => q.category === 'behavioral').length,
    'role-specific': categorizedQuestions.filter(q => q.category === 'role-specific').length,
    general: categorizedQuestions.filter(q => q.category === 'general').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Interview Preparation</h2>
          <p className="text-white/70">
            {jobTitle ? `Tailored questions for ${jobTitle}` : 'AI-generated interview questions'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setPracticeMode(!practiceMode)}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            {practiceMode ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {practiceMode ? 'Exit Practice' : 'Practice Mode'}
          </Button>
          {onExport && (
            <Button
              onClick={onExport}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white/5 border-white/10 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{categoryStats.technical}</div>
            <p className="text-white/70 text-sm">Technical</p>
          </div>
        </Card>
        <Card className="bg-white/5 border-white/10 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{categoryStats.behavioral}</div>
            <p className="text-white/70 text-sm">Behavioral</p>
          </div>
        </Card>
        <Card className="bg-white/5 border-white/10 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{categoryStats['role-specific']}</div>
            <p className="text-white/70 text-sm">Role-Specific</p>
          </div>
        </Card>
        <Card className="bg-white/5 border-white/10 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-400">{categoryStats.general}</div>
            <p className="text-white/70 text-sm">General</p>
          </div>
        </Card>
      </div>

      {practiceMode ? (
        /* Practice Mode */
        <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-white">
                Practice Mode - Question {currentQuestionIndex + 1} of {filteredQuestions.length}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-white/70" />
                <span className="text-white/70">{filteredQuestions[currentQuestionIndex]?.timeLimit || 15} min</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {filteredQuestions[currentQuestionIndex] && (
              <>
                <div className="flex gap-2 mb-4">
                  <Badge className={getCategoryColor(filteredQuestions[currentQuestionIndex].category)}>
                    {getCategoryIcon(filteredQuestions[currentQuestionIndex].category)}
                    <span className="ml-1 capitalize">{filteredQuestions[currentQuestionIndex].category}</span>
                  </Badge>
                  <Badge className={getDifficultyColor(filteredQuestions[currentQuestionIndex].difficulty)}>
                    <span className="capitalize">{filteredQuestions[currentQuestionIndex].difficulty}</span>
                  </Badge>
                </div>
                
                <div className="p-6 bg-white/5 rounded-lg border border-white/10">
                  <h3 className="text-xl text-white font-medium mb-4">
                    {filteredQuestions[currentQuestionIndex].question}
                  </h3>
                </div>

                <div className="flex justify-between">
                  <Button
                    onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                    disabled={currentQuestionIndex === 0}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => setCurrentQuestionIndex(Math.min(filteredQuestions.length - 1, currentQuestionIndex + 1))}
                    disabled={currentQuestionIndex === filteredQuestions.length - 1}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        /* Regular Mode */
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-black/20 border border-white/10">
            <TabsTrigger value="all" onClick={() => setSelectedCategory('all')}>
              All Questions ({categorizedQuestions.length})
            </TabsTrigger>
            <TabsTrigger value="technical" onClick={() => setSelectedCategory('technical')}>
              Technical ({categoryStats.technical})
            </TabsTrigger>
            <TabsTrigger value="behavioral" onClick={() => setSelectedCategory('behavioral')}>
              Behavioral ({categoryStats.behavioral})
            </TabsTrigger>
            <TabsTrigger value="role-specific" onClick={() => setSelectedCategory('role-specific')}>
              Role-Specific ({categoryStats['role-specific']})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="space-y-4">
              {filteredQuestions.map((question, index) => (
                <Card key={question.id} className="bg-black/40 backdrop-blur-xl border border-white/10">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex gap-2 mb-2">
                          <Badge className={getCategoryColor(question.category)}>
                            {getCategoryIcon(question.category)}
                            <span className="ml-1 capitalize">{question.category}</span>
                          </Badge>
                          <Badge className={getDifficultyColor(question.difficulty)}>
                            <span className="capitalize">{question.difficulty}</span>
                          </Badge>
                          <Badge className="bg-white/10 text-white/70">
                            <Clock className="w-3 h-3 mr-1" />
                            {question.timeLimit} min
                          </Badge>
                        </div>
                        <CardTitle className="text-white text-lg">
                          {question.question}
                        </CardTitle>
                      </div>
                      <Collapsible open={expandedQuestions[question.id]} onOpenChange={() => toggleQuestion(question.id)}>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                            {expandedQuestions[question.id] ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                      </Collapsible>
                    </div>
                  </CardHeader>
                  
                  <Collapsible open={expandedQuestions[question.id]} onOpenChange={() => toggleQuestion(question.id)}>
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          {/* Sample Answer */}
                          {question.sampleAnswer && (
                            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                              <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Sample Answer
                              </h4>
                              <p className="text-white/80 text-sm leading-relaxed">
                                {question.sampleAnswer}
                              </p>
                            </div>
                          )}

                          {/* Interview Tips */}
                          <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                            <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                              <Lightbulb className="w-4 h-4" />
                              Interview Tips
                            </h4>
                            <ul className="text-white/80 text-sm space-y-1">
                              {question.tips && question.tips.length > 0 ? (
                                question.tips.map((tip, tipIndex) => (
                                  <li key={tipIndex}>• {tip}</li>
                                ))
                              ) : (
                                <>
                                  {question.category === 'technical' && (
                                    <>
                                      <li>• Think out loud and explain your reasoning</li>
                                      <li>• Ask clarifying questions before starting</li>
                                      <li>• Consider edge cases and error handling</li>
                                    </>
                                  )}
                                  {question.category === 'behavioral' && (
                                    <>
                                      <li>• Use the STAR method (Situation, Task, Action, Result)</li>
                                      <li>• Provide specific examples from your experience</li>
                                      <li>• Focus on your role and contributions</li>
                                    </>
                                  )}
                                  {question.category === 'role-specific' && (
                                    <>
                                      <li>• Relate your answer to the specific role requirements</li>
                                      <li>• Show knowledge of the company and industry</li>
                                      <li>• Demonstrate relevant skills and experience</li>
                                    </>
                                  )}
                                  <li>• Be honest and authentic in your response</li>
                                  <li>• Take a moment to think before answering</li>
                                </>
                              )}
                            </ul>
                          </div>

                          {/* Sample Structure */}
                          <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                            <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4" />
                              Answer Structure
                            </h4>
                            <div className="text-white/80 text-sm space-y-2">
                              {question.category === 'behavioral' ? (
                                <div>
                                  <p><strong>Situation:</strong> Set the context</p>
                                  <p><strong>Task:</strong> Describe what needed to be done</p>
                                  <p><strong>Action:</strong> Explain what you did</p>
                                  <p><strong>Result:</strong> Share the outcome</p>
                                </div>
                              ) : (
                                <div>
                                  <p><strong>Understanding:</strong> Clarify the question</p>
                                  <p><strong>Approach:</strong> Outline your strategy</p>
                                  <p><strong>Implementation:</strong> Walk through your solution</p>
                                  <p><strong>Validation:</strong> Test and verify your answer</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="technical" className="space-y-4">
            <div className="space-y-4">
              {filteredQuestions.map((question, index) => (
                <Card key={question.id} className="bg-black/40 backdrop-blur-xl border border-white/10">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-white text-lg flex-1">
                        {question.question}
                      </CardTitle>
                      <Badge className={getDifficultyColor(question.difficulty)}>
                        <span className="capitalize">{question.difficulty}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="behavioral" className="space-y-4">
            <div className="space-y-4">
              {filteredQuestions.map((question, index) => (
                <Card key={question.id} className="bg-black/40 backdrop-blur-xl border border-white/10">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-white text-lg flex-1">
                        {question.question}
                      </CardTitle>
                      <Badge className={getDifficultyColor(question.difficulty)}>
                        <span className="capitalize">{question.difficulty}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="role-specific" className="space-y-4">
            <div className="space-y-4">
              {filteredQuestions.map((question, index) => (
                <Card key={question.id} className="bg-black/40 backdrop-blur-xl border border-white/10">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-white text-lg flex-1">
                        {question.question}
                      </CardTitle>
                      <Badge className={getDifficultyColor(question.difficulty)}>
                        <span className="capitalize">{question.difficulty}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
