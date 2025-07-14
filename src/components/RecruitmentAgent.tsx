import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  Upload, 
  CheckCircle,
  XCircle,
  AlertTriangle,
  Star,
  Trash2,
  Download
} from 'lucide-react';
import { useRecruitmentAgent } from '@/hooks/useRecruitmentAgent';

export const RecruitmentAgent = () => {
  const [resumeText, setResumeText] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [jobRequirements, setJobRequirements] = useState<string[]>([]);
  const [newRequirement, setNewRequirement] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [experienceLevel, setExperienceLevel] = useState<'entry' | 'mid' | 'senior'>('mid');

  const {
    loading,
    screenedCandidates,
    currentAnalysis,
    interviewQuestions,
    analyzeCandidate,
    generateInterviewQuestions,
    removeCandidate
  } = useRecruitmentAgent();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setResumeText(text);
      };
      reader.readAsText(file);
    }
  };

  const addRequirement = () => {
    if (newRequirement.trim() && !jobRequirements.includes(newRequirement.trim())) {
      setJobRequirements(prev => [...prev, newRequirement.trim()]);
      setNewRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    setJobRequirements(prev => prev.filter((_, i) => i !== index));
  };

  const handleAnalyzeCandidate = async () => {
    if (!resumeText.trim() || !roleTitle.trim() || jobRequirements.length === 0) {
      return;
    }
    await analyzeCandidate(resumeText, jobRequirements, roleTitle, candidateName || undefined);
  };

  const handleGenerateQuestions = async () => {
    if (!roleTitle.trim() || jobRequirements.length === 0) {
      return;
    }
    await generateInterviewQuestions(roleTitle, jobRequirements, experienceLevel, resumeText || undefined);
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'Strong Fit': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Good Fit': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Weak Fit': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Not Suitable': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-blue-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5" />
            AI Recruitment Agent
          </CardTitle>
          <CardDescription className="text-white/70">
            Analyze resumes, screen candidates, and generate interview questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="screen" className="w-full">
            <TabsList className="bg-black/20 border border-white/10">
              <TabsTrigger value="screen" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500">
                <FileText className="w-4 h-4 mr-2" />
                Resume Screening
              </TabsTrigger>
              <TabsTrigger value="questions" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500">
                <MessageSquare className="w-4 h-4 mr-2" />
                Interview Questions
              </TabsTrigger>
              <TabsTrigger value="candidates" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500">
                <Users className="w-4 h-4 mr-2" />
                Screened Candidates
              </TabsTrigger>
            </TabsList>

            <TabsContent value="screen" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {/* Job Setup */}
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Job Requirements</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="role-title" className="text-white">Role Title</Label>
                        <Input
                          id="role-title"
                          value={roleTitle}
                          onChange={(e) => setRoleTitle(e.target.value)}
                          placeholder="e.g., Senior Software Engineer"
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        />
                      </div>

                      <div>
                        <Label htmlFor="new-requirement" className="text-white">Add Requirement</Label>
                        <div className="flex gap-2">
                          <Input
                            id="new-requirement"
                            value={newRequirement}
                            onChange={(e) => setNewRequirement(e.target.value)}
                            placeholder="e.g., 5+ years React experience"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
                          />
                          <Button onClick={addRequirement} size="sm">Add</Button>
                        </div>
                      </div>

                      {jobRequirements.length > 0 && (
                        <div>
                          <Label className="text-white">Requirements</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {jobRequirements.map((req, index) => (
                              <Badge key={index} variant="secondary" className="bg-blue-500/20 text-blue-300 pr-1">
                                {req}
                                <button
                                  onClick={() => removeRequirement(index)}
                                  className="ml-2 text-blue-300 hover:text-red-300"
                                >
                                  ×
                                </button>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Resume Upload */}
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Candidate Resume</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="candidate-name" className="text-white">Candidate Name (Optional)</Label>
                        <Input
                          id="candidate-name"
                          value={candidateName}
                          onChange={(e) => setCandidateName(e.target.value)}
                          placeholder="John Doe"
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        />
                      </div>

                      <div>
                        <Label htmlFor="resume-upload" className="text-white">Upload Resume</Label>
                        <Input
                          id="resume-upload"
                          type="file"
                          accept=".txt,.pdf,.doc,.docx"
                          onChange={handleFileUpload}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>

                      <div>
                        <Label htmlFor="resume-text" className="text-white">Or Paste Resume Text</Label>
                        <Textarea
                          id="resume-text"
                          value={resumeText}
                          onChange={(e) => setResumeText(e.target.value)}
                          placeholder="Paste resume content here..."
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[150px]"
                        />
                      </div>

                      <Button
                        onClick={handleAnalyzeCandidate}
                        disabled={loading || !resumeText.trim() || !roleTitle.trim() || jobRequirements.length === 0}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                      >
                        {loading ? 'Analyzing Candidate...' : 'Analyze Candidate'}
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  {currentAnalysis && (
                    <Card className="bg-white/5 border-white/10">
                      <CardHeader>
                        <CardTitle className="text-white text-lg flex items-center justify-between">
                          Analysis Results
                          <Badge className={getRecommendationColor(currentAnalysis.recommendation)}>
                            {currentAnalysis.recommendation}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-white/70">Fit Score</span>
                            <span className={`font-bold ${getScoreColor(currentAnalysis.fitScore)}`}>
                              {currentAnalysis.fitScore}%
                            </span>
                          </div>
                          <Progress value={currentAnalysis.fitScore} className="h-2" />
                        </div>

                        {currentAnalysis.strengths.length > 0 && (
                          <div>
                            <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              Strengths
                            </h4>
                            <ul className="text-white/70 text-sm space-y-1">
                              {currentAnalysis.strengths.slice(0, 3).map((strength, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <Star className="w-3 h-3 text-green-400 mt-1 flex-shrink-0" />
                                  {strength}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {currentAnalysis.concerns.length > 0 && (
                          <div>
                            <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-yellow-400" />
                              Concerns
                            </h4>
                            <ul className="text-white/70 text-sm space-y-1">
                              {currentAnalysis.concerns.slice(0, 3).map((concern, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <XCircle className="w-3 h-3 text-red-400 mt-1 flex-shrink-0" />
                                  {concern}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-white font-medium mb-2">Skills Match</h4>
                            <div className="space-y-1">
                              {currentAnalysis.skillsMatch.matched.slice(0, 3).map((skill, index) => (
                                <Badge key={index} className="bg-green-500/20 text-green-300 text-xs mr-1 mb-1">
                                  ✓ {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-white font-medium mb-2">Missing Skills</h4>
                            <div className="space-y-1">
                              {currentAnalysis.skillsMatch.missing.slice(0, 3).map((skill, index) => (
                                <Badge key={index} className="bg-red-500/20 text-red-300 text-xs mr-1 mb-1">
                                  ✗ {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="questions" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Generate Interview Questions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-white">Experience Level</Label>
                        <Select value={experienceLevel} onValueChange={(value: any) => setExperienceLevel(value)}>
                          <SelectTrigger className="bg-white/10 border-white/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="entry">Entry Level</SelectItem>
                            <SelectItem value="mid">Mid Level</SelectItem>
                            <SelectItem value="senior">Senior Level</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button
                        onClick={handleGenerateQuestions}
                        disabled={loading || !roleTitle.trim() || jobRequirements.length === 0}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        {loading ? 'Generating Questions...' : 'Generate Interview Questions'}
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  {interviewQuestions && (
                    <Card className="bg-white/5 border-white/10">
                      <CardHeader>
                        <CardTitle className="text-white text-lg">Interview Questions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {interviewQuestions.technical.length > 0 && (
                          <div>
                            <h4 className="text-white font-medium mb-2">Technical Questions</h4>
                            <ul className="text-white/70 text-sm space-y-2">
                              {interviewQuestions.technical.slice(0, 3).map((question, index) => (
                                <li key={index} className="p-2 bg-white/5 rounded border border-white/10">
                                  {question}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {interviewQuestions.behavioral.length > 0 && (
                          <div>
                            <h4 className="text-white font-medium mb-2">Behavioral Questions</h4>
                            <ul className="text-white/70 text-sm space-y-2">
                              {interviewQuestions.behavioral.slice(0, 3).map((question, index) => (
                                <li key={index} className="p-2 bg-white/5 rounded border border-white/10">
                                  {question}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {interviewQuestions.roleSpecific.length > 0 && (
                          <div>
                            <h4 className="text-white font-medium mb-2">Role-Specific Questions</h4>
                            <ul className="text-white/70 text-sm space-y-2">
                              {interviewQuestions.roleSpecific.slice(0, 3).map((question, index) => (
                                <li key={index} className="p-2 bg-white/5 rounded border border-white/10">
                                  {question}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="candidates" className="space-y-4">
              {screenedCandidates.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-16 h-16 text-white/40 mx-auto mb-4" />
                  <h3 className="text-white text-xl font-semibold mb-2">No Candidates Screened</h3>
                  <p className="text-white/60">Start screening candidates to see them here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {screenedCandidates.map((candidate, index) => (
                    <Card key={index} className="bg-white/5 border-white/10">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-white font-medium">{candidate.candidateName}</h3>
                            <p className="text-white/60 text-sm">
                              Screened on {candidate.timestamp.toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getRecommendationColor(candidate.analysis.recommendation)}>
                              {candidate.analysis.recommendation}
                            </Badge>
                            <span className={`font-bold ${getScoreColor(candidate.analysis.fitScore)}`}>
                              {candidate.analysis.fitScore}%
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeCandidate(index)}
                              className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <Progress value={candidate.analysis.fitScore} className="h-2" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
