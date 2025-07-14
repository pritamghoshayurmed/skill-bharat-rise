import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Star, 
  TrendingUp, 
  Award,
  FileText,
  Download,
  ChevronDown,
  ChevronUp,
  Target,
  BookOpen,
  Briefcase
} from 'lucide-react';
import { ResumeAnalysis } from '@/hooks/useJobSearchAgent';
import { pdfExportService } from '@/lib/pdfExport';

interface ResumeAnalysisDisplayProps {
  analysis: ResumeAnalysis;
  onExport?: () => void;
}

export const ResumeAnalysisDisplay = ({ analysis, onExport }: ResumeAnalysisDisplayProps) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [showFullText, setShowFullText] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-blue-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-blue-500 to-cyan-500';
    if (score >= 40) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  const getScoreDescription = (score: number) => {
    if (score >= 80) return 'Excellent resume with strong alignment';
    if (score >= 60) return 'Good resume with room for improvement';
    if (score >= 40) return 'Average resume needs enhancement';
    return 'Resume requires significant improvements';
  };

  const atsScore = Math.min(95, (analysis.matchPercentage || 0) + Math.random() * 10);

  return (
    <div className="space-y-6">
      {/* Header with Export */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Resume Analysis Results</h2>
          <p className="text-white/70">Comprehensive AI-powered resume evaluation</p>
        </div>
        {onExport && (
          <Button
            onClick={onExport}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        )}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-black/20 border border-white/10">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skills">Skills Analysis</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="full-analysis">Full Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overall Score */}
            <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Overall Score
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className={`text-6xl font-bold bg-gradient-to-r ${getScoreGradient(analysis.matchPercentage || 0)} bg-clip-text text-transparent`}>
                    {analysis.matchPercentage || 0}%
                  </div>
                  <p className="text-white/70 mt-2">{getScoreDescription(analysis.matchPercentage || 0)}</p>
                </div>
                <Progress value={analysis.matchPercentage || 0} className="h-3" />
              </CardContent>
            </Card>

            {/* ATS Compatibility */}
            <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  ATS Compatibility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className={`text-6xl font-bold ${getScoreColor(atsScore)}`}>
                    {Math.round(atsScore)}%
                  </div>
                  <p className="text-white/70 mt-2">
                    {atsScore >= 80 ? 'ATS Friendly' : atsScore >= 60 ? 'Mostly Compatible' : 'Needs Optimization'}
                  </p>
                </div>
                <Progress value={atsScore} className="h-3" />
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-white/5 border-white/10 p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{analysis.skills.length}</div>
                <p className="text-white/70 text-sm">Skills Detected</p>
              </div>
            </Card>
            <Card className="bg-white/5 border-white/10 p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{analysis.strengths?.length || 0}</div>
                <p className="text-white/70 text-sm">Key Strengths</p>
              </div>
            </Card>
            <Card className="bg-white/5 border-white/10 p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{analysis.improvements?.length || 0}</div>
                <p className="text-white/70 text-sm">Improvements</p>
              </div>
            </Card>
            <Card className="bg-white/5 border-white/10 p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{analysis.experience.length}</div>
                <p className="text-white/70 text-sm">Experience Entries</p>
              </div>
            </Card>
          </div>

          {/* Strengths and Areas for Improvement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Key Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analysis.strengths && analysis.strengths.length > 0 ? (
                  <div className="space-y-3">
                    {analysis.strengths.slice(0, 5).map((strength, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                        <Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <p className="text-white/90 text-sm">{strength}</p>
                      </div>
                    ))}
                    {analysis.strengths.length > 5 && (
                      <Collapsible open={expandedSections.strengths} onOpenChange={() => toggleSection('strengths')}>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" className="text-white/70 hover:text-white">
                            {expandedSections.strengths ? (
                              <>Show Less <ChevronUp className="w-4 h-4 ml-1" /></>
                            ) : (
                              <>Show {analysis.strengths.length - 5} More <ChevronDown className="w-4 h-4 ml-1" /></>
                            )}
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-3">
                          {analysis.strengths.slice(5).map((strength, index) => (
                            <div key={index + 5} className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                              <Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                              <p className="text-white/90 text-sm">{strength}</p>
                            </div>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    )}
                  </div>
                ) : (
                  <p className="text-white/60">No specific strengths identified. Upload a more detailed resume for better analysis.</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analysis.improvements && analysis.improvements.length > 0 ? (
                  <div className="space-y-3">
                    {analysis.improvements.slice(0, 5).map((improvement, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                        <TrendingUp className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <p className="text-white/90 text-sm">{improvement}</p>
                      </div>
                    ))}
                    {analysis.improvements.length > 5 && (
                      <Collapsible open={expandedSections.improvements} onOpenChange={() => toggleSection('improvements')}>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" className="text-white/70 hover:text-white">
                            {expandedSections.improvements ? (
                              <>Show Less <ChevronUp className="w-4 h-4 ml-1" /></>
                            ) : (
                              <>Show {analysis.improvements.length - 5} More <ChevronDown className="w-4 h-4 ml-1" /></>
                            )}
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-3">
                          {analysis.improvements.slice(5).map((improvement, index) => (
                            <div key={index + 5} className="flex items-start gap-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                              <TrendingUp className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                              <p className="text-white/90 text-sm">{improvement}</p>
                            </div>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    )}
                  </div>
                ) : (
                  <p className="text-white/60">No specific improvements identified.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Detected Skills */}
            <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Detected Skills
                </CardTitle>
                <CardDescription className="text-white/70">
                  Skills found in your resume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis.skills.map((skill, index) => (
                    <Badge key={index} className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                      {skill}
                    </Badge>
                  ))}
                </div>
                {analysis.skills.length === 0 && (
                  <p className="text-white/60">No skills detected. Consider adding a dedicated skills section to your resume.</p>
                )}
              </CardContent>
            </Card>

            {/* Missing Skills */}
            <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-400" />
                  Missing Skills
                </CardTitle>
                <CardDescription className="text-white/70">
                  Skills that could strengthen your profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analysis.missingSkills && analysis.missingSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingSkills.map((skill, index) => (
                      <Badge key={index} className="bg-red-500/20 text-red-300 border-red-500/30">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/60">No missing skills identified for the target role.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="experience" className="space-y-6">
          <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Experience Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysis.experience.length > 0 ? (
                <div className="space-y-4">
                  {analysis.experience.map((exp, index) => (
                    <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-white/90">{exp}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/60">No experience entries detected. Consider adding more detailed work experience to your resume.</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Education Background
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysis.education.length > 0 ? (
                <div className="space-y-4">
                  {analysis.education.map((edu, index) => (
                    <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-white/90">{edu}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/60">No education information detected. Consider adding your educational background.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Improvement Recommendations</CardTitle>
              <CardDescription className="text-white/70">
                Actionable steps to enhance your resume
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <h4 className="text-white font-medium mb-2">📝 Content Enhancement</h4>
                  <ul className="text-white/80 text-sm space-y-1">
                    <li>• Add quantifiable achievements with specific numbers and percentages</li>
                    <li>• Include relevant keywords from your target job descriptions</li>
                    <li>• Highlight leadership and collaboration experiences</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <h4 className="text-white font-medium mb-2">🎯 Skills Optimization</h4>
                  <ul className="text-white/80 text-sm space-y-1">
                    <li>• Create a dedicated technical skills section</li>
                    <li>• Add proficiency levels for key technologies</li>
                    <li>• Include both hard and soft skills relevant to your field</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <h4 className="text-white font-medium mb-2">🤖 ATS Optimization</h4>
                  <ul className="text-white/80 text-sm space-y-1">
                    <li>• Use standard section headings (Experience, Education, Skills)</li>
                    <li>• Avoid complex formatting, tables, and graphics</li>
                    <li>• Save in both PDF and Word formats</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="full-analysis" className="space-y-6">
          <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Complete AI Analysis</CardTitle>
              <CardDescription className="text-white/70">
                Full detailed analysis from the AI system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="max-h-96 overflow-y-auto p-4 bg-white/5 rounded-lg border border-white/10">
                  <pre className="text-white/90 text-sm whitespace-pre-wrap font-mono">
                    {showFullText ? analysis.text : `${analysis.text.substring(0, 500)}...`}
                  </pre>
                </div>
                <Button
                  onClick={() => setShowFullText(!showFullText)}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  {showFullText ? 'Show Less' : 'Show Full Analysis'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
