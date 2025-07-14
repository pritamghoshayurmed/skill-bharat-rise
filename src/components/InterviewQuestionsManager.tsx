import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Brain, 
  Download, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  Clock,
  Target,
  Code,
  Users,
  Building,
  FileText,
  Loader2
} from 'lucide-react';
import { useInterviewQuestions } from '@/hooks/useInterviewQuestions';
import { interviewQuestionsPdfExport } from '@/lib/interviewQuestionsPdfExport';
import { InterviewQuestionsSet } from '@/lib/interviewQuestionsService';

export const InterviewQuestionsManager = () => {
  const {
    questionSets,
    currentSet,
    loading,
    generating,
    generateQuestions,
    deleteQuestionSet,
    setCurrentSet,
    exportQuestionsAsText
  } = useInterviewQuestions();

  const [showGenerator, setShowGenerator] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});
  const [generatorForm, setGeneratorForm] = useState({
    resumeText: '',
    jobTitle: '',
    jobDescription: '',
    totalQuestions: 15,
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    categories: ['behavioral', 'technical', 'coding', 'project-architecture'] as string[]
  });

  const handleGenerateQuestions = async () => {
    if (!generatorForm.resumeText.trim() || !generatorForm.jobTitle.trim()) {
      return;
    }

    const result = await generateQuestions(
      generatorForm.resumeText,
      generatorForm.jobTitle,
      generatorForm.jobDescription || undefined,
      {
        totalQuestions: generatorForm.totalQuestions,
        difficulty: generatorForm.difficulty,
        categories: generatorForm.categories as any[]
      }
    );

    if (result) {
      setShowGenerator(false);
      setGeneratorForm({
        resumeText: '',
        jobTitle: '',
        jobDescription: '',
        totalQuestions: 15,
        difficulty: 'medium',
        categories: ['behavioral', 'technical', 'coding', 'project-architecture']
      });
    }
  };

  const handleExportPDF = async (set: InterviewQuestionsSet, questionsOnly = false) => {
    try {
      if (questionsOnly) {
        await interviewQuestionsPdfExport.exportQuestionsOnly(set);
      } else {
        await interviewQuestionsPdfExport.exportToPdf(set);
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  };

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'behavioral': return <Users className="w-4 h-4" />;
      case 'technical': return <Target className="w-4 h-4" />;
      case 'coding': return <Code className="w-4 h-4" />;
      case 'project-architecture': return <Building className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'behavioral': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'technical': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'coding': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'project-architecture': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'hard': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Interview Questions</h2>
          <p className="text-white/70">AI-generated interview preparation with categorized questions and answers</p>
        </div>
        <Button
          onClick={() => setShowGenerator(true)}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Generate Questions
        </Button>
      </div>

      {/* Question Generator */}
      {showGenerator && (
        <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Brain className="w-5 h-5 mr-2" />
              Generate Interview Questions
            </CardTitle>
            <CardDescription className="text-white/70">
              Create personalized interview questions based on your resume and target job
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-white text-sm font-medium mb-2 block">Job Title *</label>
                <Input
                  value={generatorForm.jobTitle}
                  onChange={(e) => setGeneratorForm(prev => ({ ...prev, jobTitle: e.target.value }))}
                  placeholder="e.g., Senior Software Engineer"
                  className="bg-black/20 border-white/20 text-white"
                />
              </div>
              <div>
                <label className="text-white text-sm font-medium mb-2 block">Number of Questions</label>
                <Select
                  value={generatorForm.totalQuestions.toString()}
                  onValueChange={(value) => setGeneratorForm(prev => ({ ...prev, totalQuestions: parseInt(value) }))}
                >
                  <SelectTrigger className="bg-black/20 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 Questions</SelectItem>
                    <SelectItem value="15">15 Questions</SelectItem>
                    <SelectItem value="20">20 Questions</SelectItem>
                    <SelectItem value="25">25 Questions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-white text-sm font-medium mb-2 block">Resume Text *</label>
              <Textarea
                value={generatorForm.resumeText}
                onChange={(e) => setGeneratorForm(prev => ({ ...prev, resumeText: e.target.value }))}
                placeholder="Paste your resume content here..."
                className="bg-black/20 border-white/20 text-white min-h-[120px]"
              />
            </div>

            <div>
              <label className="text-white text-sm font-medium mb-2 block">Job Description (Optional)</label>
              <Textarea
                value={generatorForm.jobDescription}
                onChange={(e) => setGeneratorForm(prev => ({ ...prev, jobDescription: e.target.value }))}
                placeholder="Paste the job description for more targeted questions..."
                className="bg-black/20 border-white/20 text-white min-h-[100px]"
              />
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowGenerator(false)}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleGenerateQuestions}
                  disabled={generating || !generatorForm.resumeText.trim() || !generatorForm.jobTitle.trim()}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Generate Questions
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Question Sets List */}
      <Tabs defaultValue="current" className="w-full">
        <TabsList className="bg-black/20 border border-white/10">
          <TabsTrigger value="current">Current Set</TabsTrigger>
          <TabsTrigger value="all">All Sets ({questionSets.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          {currentSet ? (
            <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white">{currentSet.jobTitle}</CardTitle>
                    <CardDescription className="text-white/70">
                      {currentSet.totalQuestions} questions • Generated {new Date(currentSet.generatedAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportPDF(currentSet, true)}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Questions Only
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportPDF(currentSet)}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Full PDF
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Category Summary */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {Object.entries(currentSet.categories).map(([category, count]) => (
                    count > 0 && (
                      <Badge key={category} className={getCategoryColor(category)}>
                        {getCategoryIcon(category)}
                        <span className="ml-1 capitalize">{category}: {count}</span>
                      </Badge>
                    )
                  ))}
                </div>

                {/* Questions List */}
                <div className="space-y-4">
                  {currentSet.questions.map((question, index) => (
                    <Card key={question.id} className="bg-black/20 border border-white/10">
                      <Collapsible 
                        open={expandedQuestions[question.id]} 
                        onOpenChange={() => toggleQuestion(question.id)}
                      >
                        <CollapsibleTrigger asChild>
                          <CardHeader className="cursor-pointer hover:bg-white/5">
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
                                  Q{index + 1}. {question.question}
                                </CardTitle>
                              </div>
                              <div className="ml-4">
                                {expandedQuestions[question.id] ? (
                                  <ChevronUp className="w-5 h-5 text-white/70" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-white/70" />
                                )}
                              </div>
                            </div>
                          </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <CardContent className="pt-0">
                            {question.context && (
                              <div className="mb-4">
                                <h4 className="text-white font-medium mb-2">Context:</h4>
                                <p className="text-white/70 text-sm">{question.context}</p>
                              </div>
                            )}
                            
                            {question.sampleAnswer && (
                              <div className="mb-4">
                                <h4 className="text-white font-medium mb-2">Sample Answer:</h4>
                                <p className="text-white/70 text-sm whitespace-pre-wrap">{question.sampleAnswer}</p>
                              </div>
                            )}
                            
                            {question.tips.length > 0 && (
                              <div>
                                <h4 className="text-white font-medium mb-2">Tips:</h4>
                                <ul className="text-white/70 text-sm space-y-1">
                                  {question.tips.map((tip, tipIndex) => (
                                    <li key={tipIndex} className="flex items-start">
                                      <span className="text-blue-400 mr-2">•</span>
                                      {tip}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </CardContent>
                        </CollapsibleContent>
                      </Collapsible>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
              <CardContent className="text-center py-12">
                <Brain className="w-12 h-12 text-white/50 mx-auto mb-4" />
                <h3 className="text-white text-lg font-medium mb-2">No Interview Questions Yet</h3>
                <p className="text-white/70 mb-4">Generate your first set of interview questions to get started</p>
                <Button
                  onClick={() => setShowGenerator(true)}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Generate Questions
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {questionSets.length > 0 ? (
            <div className="grid gap-4">
              {questionSets.map((set) => (
                <Card key={set.id} className="bg-black/40 backdrop-blur-xl border border-white/10">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white">{set.jobTitle}</CardTitle>
                        <CardDescription className="text-white/70">
                          {set.totalQuestions} questions • {new Date(set.generatedAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentSet(set)}
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleExportPDF(set)}
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteQuestionSet(set.id)}
                          className="border-red-500/20 text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
              <CardContent className="text-center py-12">
                <FileText className="w-12 h-12 text-white/50 mx-auto mb-4" />
                <h3 className="text-white text-lg font-medium mb-2">No Question Sets</h3>
                <p className="text-white/70">You haven't generated any interview questions yet</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
