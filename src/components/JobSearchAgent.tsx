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
  FileText,
  Search,
  MessageSquare,
  Upload,
  Briefcase,
  Star,
  MapPin,
  Clock,
  DollarSign
} from 'lucide-react';
import { useJobSearchAgent } from '@/hooks/useJobSearchAgent';
import { ResumeAnalysisDisplay } from './ResumeAnalysisDisplay';
import { InterviewPrepDisplay } from './InterviewPrepDisplay';
import { JobMatchDisplay } from './JobMatchDisplay';
import { pdfExportService } from '@/lib/pdfExport';

export const JobSearchAgent = () => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [location, setLocation] = useState('United States');
  const [selectedJobRole, setSelectedJobRole] = useState('');
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [autoSearchEnabled, setAutoSearchEnabled] = useState(true);

  const {
    loading,
    resumeAnalysis,
    jobMatches,
    interviewQuestions,
    analyzeResume,
    findJobMatches,
    generateInterviewQuestions
  } = useJobSearchAgent();

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

  const handleAnalyzeResume = async () => {
    if (!resumeText.trim()) {
      return;
    }
    const analysis = await analyzeResume(resumeText, jobDescription || undefined);

    // Automatically search for jobs after resume analysis if enabled
    if (analysis && autoSearchEnabled) {
      setTimeout(() => {
        handleFindJobs();
      }, 1000); // Small delay to show analysis first
    }
  };

  const handleFindJobs = async () => {
    if (!resumeText.trim()) {
      return;
    }
    await findJobMatches(resumeText, location);
  };

  const handleGenerateQuestions = async () => {
    if (!resumeText.trim() || !selectedJobRole) {
      return;
    }
    await generateInterviewQuestions(resumeText, selectedJobRole);
  };

  const handleSaveJob = (job: any) => {
    const jobId = job.id || job.title + job.company;
    setSavedJobIds(prev =>
      prev.includes(jobId)
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  return (
    <div className="space-y-6">
      <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                AI Job Search Assistant
              </CardTitle>
              <CardDescription className="text-white/70">
                Upload your resume and get AI-powered job search assistance
              </CardDescription>
            </div>
            {resumeAnalysis && jobMatches.length > 0 && interviewQuestions.length > 0 && (
              <Button
                onClick={() => {
                  pdfExportService.exportComprehensiveReport(
                    resumeAnalysis,
                    jobMatches,
                    interviewQuestions
                  );
                }}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                <Download className="w-4 h-4 mr-2" />
                Export All to PDF
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="resume" className="w-full">
            <TabsList className="bg-black/20 border border-white/10">
              <TabsTrigger value="resume" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500">
                <FileText className="w-4 h-4 mr-2" />
                Resume Analysis
              </TabsTrigger>
              <TabsTrigger value="jobs" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500">
                <Search className="w-4 h-4 mr-2" />
                Job Matching
              </TabsTrigger>
              <TabsTrigger value="interview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500">
                <MessageSquare className="w-4 h-4 mr-2" />
                Interview Prep
              </TabsTrigger>
            </TabsList>

            <TabsContent value="resume" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="resume-upload" className="text-white">Upload Resume</Label>
                    <div className="mt-2">
                      <Input
                        id="resume-upload"
                        type="file"
                        accept=".txt,.pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="resume-text" className="text-white">Or Paste Resume Text</Label>
                    <Textarea
                      id="resume-text"
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      placeholder="Paste your resume content here..."
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[200px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="job-description" className="text-white">Job Description (Optional)</Label>
                    <Textarea
                      id="job-description"
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste job description to get targeted analysis..."
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>

                  <Button
                    onClick={handleAnalyzeResume}
                    disabled={loading || !resumeText.trim()}
                    className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                  >
                    {loading ? 'Analyzing...' : 'Analyze Resume'}
                  </Button>
                </div>

                <div className="space-y-4">
                  {resumeAnalysis && (
                    <ResumeAnalysisDisplay
                      analysis={resumeAnalysis}
                      onExport={() => {
                        pdfExportService.exportResumeAnalysis(resumeAnalysis);
                      }}
                    />
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="jobs" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Card className="bg-white/5 border-white/10 p-4">
                    <h3 className="text-white font-medium mb-3">Automatic Job Search</h3>
                    <p className="text-white/70 text-sm mb-4">
                      Jobs are automatically searched based on your uploaded resume.
                      You can customize the location and manually trigger a new search.
                    </p>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="location" className="text-white">Search Location</Label>
                        <Select value={location} onValueChange={setLocation}>
                          <SelectTrigger className="bg-white/10 border-white/20 text-white">
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="United States">United States</SelectItem>
                            <SelectItem value="Remote">Remote</SelectItem>
                            <SelectItem value="New York, NY">New York, NY</SelectItem>
                            <SelectItem value="San Francisco, CA">San Francisco, CA</SelectItem>
                            <SelectItem value="Seattle, WA">Seattle, WA</SelectItem>
                            <SelectItem value="Austin, TX">Austin, TX</SelectItem>
                            <SelectItem value="Boston, MA">Boston, MA</SelectItem>
                            <SelectItem value="Chicago, IL">Chicago, IL</SelectItem>
                            <SelectItem value="Los Angeles, CA">Los Angeles, CA</SelectItem>
                            <SelectItem value="London, UK">London, UK</SelectItem>
                            <SelectItem value="Toronto, Canada">Toronto, Canada</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="auto-search"
                          checked={autoSearchEnabled}
                          onChange={(e) => setAutoSearchEnabled(e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor="auto-search" className="text-white text-sm">
                          Auto-search after resume analysis
                        </Label>
                      </div>

                      <Button
                        onClick={handleFindJobs}
                        disabled={loading || !resumeText.trim()}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                      >
                        {loading ? 'Searching Jobs...' : 'Search Jobs Now'}
                      </Button>
                    </div>
                  </Card>
                </div>

                <div className="space-y-4">
                  {jobMatches.length > 0 && (
                    <JobMatchDisplay
                      jobs={jobMatches}
                      onSaveJob={handleSaveJob}
                      savedJobIds={savedJobIds}
                      onExport={() => {
                        pdfExportService.exportJobMatches(jobMatches);
                      }}
                    />
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="interview" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="job-role" className="text-white">Target Job Role</Label>
                    <Input
                      id="job-role"
                      value={selectedJobRole}
                      onChange={(e) => setSelectedJobRole(e.target.value)}
                      placeholder="e.g., Software Engineer, Data Scientist"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>

                  <Button
                    onClick={handleGenerateQuestions}
                    disabled={loading || !resumeText.trim() || !selectedJobRole}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    {loading ? 'Generating Questions...' : 'Generate Interview Questions'}
                  </Button>
                </div>

                <div className="space-y-4">
                  {interviewQuestions.length > 0 && (
                    <InterviewPrepDisplay
                      questions={interviewQuestions.map(q => q.question)}
                      jobTitle={selectedJobRole}
                      onExport={() => {
                        pdfExportService.exportInterviewQuestions(interviewQuestions, selectedJobRole);
                      }}
                    />
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
