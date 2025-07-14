import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { 
  GraduationCap, 
  MessageSquare, 
  Brain, 
  BookOpen, 
  CheckCircle,
  XCircle,
  Lightbulb,
  Target,
  Clock
} from 'lucide-react';
import { useLearningTutor, LearningPreferences } from '@/hooks/useLearningTutor';

export const LearningTutor = () => {
  const [question, setQuestion] = useState('');
  const [preferences, setPreferences] = useState<LearningPreferences>({
    subject: 'Computer Science',
    level: 'intermediate',
    learningStyle: 'text-based',
    language: 'English'
  });
  const [quizSettings, setQuizSettings] = useState({
    questionCount: 5,
    topics: ''
  });
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [learningPathSettings, setLearningPathSettings] = useState({
    goals: '',
    timeframe: '3 months'
  });
  const [learningPath, setLearningPath] = useState<string | null>(null);

  const {
    loading,
    currentResponse,
    quizQuestions,
    learningHistory,
    askQuestion,
    generateQuiz,
    getPersonalizedLearningPath
  } = useLearningTutor();

  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    await askQuestion(question, preferences);
    setQuestion('');
  };

  const handleGenerateQuiz = async () => {
    const topics = quizSettings.topics ? quizSettings.topics.split(',').map(t => t.trim()) : undefined;
    await generateQuiz(preferences.subject, preferences.level, quizSettings.questionCount, topics);
    setSelectedAnswers({});
    setShowResults(false);
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setShowResults(false);
  };

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const handleSubmitQuiz = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    quizQuestions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / quizQuestions.length) * 100);
  };

  const handleGenerateLearningPath = async () => {
    if (!learningPathSettings.goals.trim()) return;

    const goals = learningPathSettings.goals.split(',').map(g => g.trim()).filter(g => g);
    const result = await getPersonalizedLearningPath(
      preferences.subject,
      preferences.level,
      goals,
      learningPathSettings.timeframe
    );

    if (result) {
      setLearningPath(result);
    }
  };

  const subjects = [
    'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology',
    'History', 'Literature', 'Economics', 'Psychology', 'Engineering'
  ];

  const languages = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Chinese'];

  return (
    <div className="space-y-6">
      <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            AI Learning Tutor
          </CardTitle>
          <CardDescription className="text-white/70">
            Get personalized explanations, take quizzes, and create learning paths
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Learning Preferences */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <div>
              <Label className="text-white text-sm">Subject</Label>
              <Select value={preferences.subject} onValueChange={(value) => setPreferences(prev => ({ ...prev, subject: value }))}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-white text-sm">Level</Label>
              <Select value={preferences.level} onValueChange={(value: any) => setPreferences(prev => ({ ...prev, level: value }))}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-white text-sm">Learning Style</Label>
              <Select value={preferences.learningStyle} onValueChange={(value: any) => setPreferences(prev => ({ ...prev, learningStyle: value }))}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visual">Visual</SelectItem>
                  <SelectItem value="text-based">Text-based</SelectItem>
                  <SelectItem value="hands-on">Hands-on</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-white text-sm">Language</Label>
              <Select value={preferences.language} onValueChange={(value) => setPreferences(prev => ({ ...prev, language: value }))}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map(language => (
                    <SelectItem key={language} value={language}>{language}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="ask" className="w-full">
            <TabsList className="bg-black/20 border border-white/10">
              <TabsTrigger value="ask" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500">
                <MessageSquare className="w-4 h-4 mr-2" />
                Ask Question
              </TabsTrigger>
              <TabsTrigger value="quiz" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500">
                <Brain className="w-4 h-4 mr-2" />
                Take Quiz
              </TabsTrigger>
              <TabsTrigger value="path" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500">
                <Target className="w-4 h-4 mr-2" />
                Learning Path
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ask" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="question" className="text-white">What would you like to learn?</Label>
                    <Textarea
                      id="question"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Ask any question about your subject..."
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[120px]"
                    />
                  </div>
                  <Button
                    onClick={handleAskQuestion}
                    disabled={loading || !question.trim()}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    {loading ? 'Getting Answer...' : 'Get Explanation'}
                  </Button>
                </div>

                <div className="space-y-4">
                  {currentResponse && (
                    <Card className="bg-white/5 border-white/10">
                      <CardHeader>
                        <CardTitle className="text-white text-lg flex items-center gap-2">
                          <Lightbulb className="w-5 h-5" />
                          Explanation
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-white/90 text-sm leading-relaxed">
                          {currentResponse.explanation}
                        </div>
                        
                        {currentResponse.keyPoints.length > 0 && (
                          <div>
                            <h4 className="text-white font-medium mb-2">Key Points</h4>
                            <ul className="text-white/70 text-sm space-y-1">
                              {currentResponse.keyPoints.map((point, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <CheckCircle className="w-3 h-3 text-green-400 mt-1 flex-shrink-0" />
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {currentResponse.examples.length > 0 && (
                          <div>
                            <h4 className="text-white font-medium mb-2">Examples</h4>
                            <div className="space-y-2">
                              {currentResponse.examples.map((example, index) => (
                                <div key={index} className="bg-white/5 p-3 rounded border border-white/10">
                                  <p className="text-white/80 text-sm">{example}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="quiz" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-white">Number of Questions</Label>
                    <div className="mt-2">
                      <Slider
                        value={[quizSettings.questionCount]}
                        onValueChange={(value) => setQuizSettings(prev => ({ ...prev, questionCount: value[0] }))}
                        max={10}
                        min={3}
                        step={1}
                        className="w-full"
                      />
                      <div className="text-white/70 text-sm mt-1">{quizSettings.questionCount} questions</div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="topics" className="text-white">Specific Topics (Optional)</Label>
                    <Input
                      id="topics"
                      value={quizSettings.topics}
                      onChange={(e) => setQuizSettings(prev => ({ ...prev, topics: e.target.value }))}
                      placeholder="e.g., loops, functions, arrays"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>

                  <Button
                    onClick={handleGenerateQuiz}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                  >
                    {loading ? 'Generating Quiz...' : 'Generate Quiz'}
                  </Button>
                </div>

                <div className="space-y-4">
                  {quizQuestions.length > 0 && (
                    <Card className="bg-white/5 border-white/10">
                      <CardHeader>
                        <CardTitle className="text-white text-lg flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <Brain className="w-5 h-5" />
                            Quiz Questions
                          </span>
                          {showResults && (
                            <Badge className="bg-green-500/20 text-green-300">
                              Score: {calculateScore()}%
                            </Badge>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {quizQuestions.map((question, index) => (
                          <div key={index} className="space-y-3 p-4 bg-white/5 rounded border border-white/10">
                            <h4 className="text-white font-medium">
                              {index + 1}. {question.question}
                            </h4>
                            <div className="space-y-2">
                              {question.options.map((option, optionIndex) => {
                                const isSelected = selectedAnswers[index] === option;
                                const isCorrect = option === question.correctAnswer;
                                const showCorrect = showResults && isCorrect;
                                const showIncorrect = showResults && isSelected && !isCorrect;
                                
                                return (
                                  <button
                                    key={optionIndex}
                                    onClick={() => !showResults && handleAnswerSelect(index, option)}
                                    disabled={showResults}
                                    className={`w-full text-left p-3 rounded border transition-colors ${
                                      showCorrect 
                                        ? 'bg-green-500/20 border-green-500/40 text-green-300'
                                        : showIncorrect
                                        ? 'bg-red-500/20 border-red-500/40 text-red-300'
                                        : isSelected
                                        ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                                        : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      {showCorrect && <CheckCircle className="w-4 h-4" />}
                                      {showIncorrect && <XCircle className="w-4 h-4" />}
                                      {String.fromCharCode(65 + optionIndex)}. {option}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                            {showResults && (
                              <div className="mt-3 p-3 bg-white/5 rounded border border-white/10">
                                <p className="text-white/80 text-sm">{question.explanation}</p>
                              </div>
                            )}
                          </div>
                        ))}
                        
                        {!showResults && Object.keys(selectedAnswers).length === quizQuestions.length && (
                          <Button
                            onClick={handleSubmitQuiz}
                            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                          >
                            Submit Quiz
                          </Button>
                        )}

                        {showResults && (
                          <div className="flex gap-2">
                            <Button
                              onClick={handleResetQuiz}
                              variant="outline"
                              className="flex-1 bg-white/10 border-white/30 text-white hover:bg-white/20"
                            >
                              Try Again
                            </Button>
                            <Button
                              onClick={handleGenerateQuiz}
                              className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                            >
                              New Quiz
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="path" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="goals" className="text-white">Learning Goals</Label>
                    <Textarea
                      id="goals"
                      value={learningPathSettings.goals}
                      onChange={(e) => setLearningPathSettings(prev => ({ ...prev, goals: e.target.value }))}
                      placeholder="Enter your learning goals separated by commas (e.g., master algorithms, build web apps, understand databases)"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[100px]"
                    />
                  </div>

                  <div>
                    <Label className="text-white">Timeframe</Label>
                    <Select value={learningPathSettings.timeframe} onValueChange={(value) => setLearningPathSettings(prev => ({ ...prev, timeframe: value }))}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1 month">1 Month</SelectItem>
                        <SelectItem value="3 months">3 Months</SelectItem>
                        <SelectItem value="6 months">6 Months</SelectItem>
                        <SelectItem value="1 year">1 Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleGenerateLearningPath}
                    disabled={loading || !learningPathSettings.goals.trim()}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    {loading ? 'Creating Learning Path...' : 'Generate Learning Path'}
                  </Button>
                </div>

                <div className="space-y-4">
                  {learningPath && (
                    <Card className="bg-white/5 border-white/10">
                      <CardHeader>
                        <CardTitle className="text-white text-lg flex items-center gap-2">
                          <Target className="w-5 h-5" />
                          Your Learning Path
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
                          {learningPath}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
