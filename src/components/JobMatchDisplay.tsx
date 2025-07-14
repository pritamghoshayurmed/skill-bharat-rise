import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Building, 
  ExternalLink,
  Star,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Bookmark,
  BookmarkCheck,
  Filter,
  SortAsc,
  Download
} from 'lucide-react';
import { JobMatch } from '@/hooks/useJobSearchAgent';
import { pdfExportService } from '@/lib/pdfExport';

interface JobMatchDisplayProps {
  jobs: JobMatch[];
  onSaveJob?: (job: JobMatch) => void;
  onExport?: () => void;
  savedJobIds?: string[];
}

export const JobMatchDisplay = ({ jobs, onSaveJob, onExport, savedJobIds = [] }: JobMatchDisplayProps) => {
  const [expandedJobs, setExpandedJobs] = useState<Record<string, boolean>>({});
  const [sortBy, setSortBy] = useState<'match' | 'date' | 'salary'>('match');
  const [filterBy, setFilterBy] = useState<'all' | 'high-match' | 'saved'>('all');

  const toggleJob = (jobId: string) => {
    setExpandedJobs(prev => ({
      ...prev,
      [jobId]: !prev[jobId]
    }));
  };

  const getMatchColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-blue-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getMatchBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-500/20 text-green-300 border-green-500/30';
    if (score >= 60) return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    if (score >= 40) return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    return 'bg-red-500/20 text-red-300 border-red-500/30';
  };

  const handleViewJob = (job: JobMatch) => {
    // Check if the job has a valid URL
    if (job.url && isValidUrl(job.url)) {
      window.open(job.url, '_blank', 'noopener,noreferrer');
      return;
    }

    // If no valid URL, create a search URL based on job details
    const searchQuery = encodeURIComponent(`${job.title} ${job.company} jobs`);
    const location = job.location ? encodeURIComponent(job.location) : '';

    // Try to determine the best job platform based on job source or company
    let searchUrl = '';

    // Check if it's from a known platform
    if (job.url && job.url.includes('linkedin.com')) {
      searchUrl = `https://www.linkedin.com/jobs/search/?keywords=${searchQuery}&location=${location}`;
    } else if (job.url && job.url.includes('indeed.com')) {
      searchUrl = `https://www.indeed.com/jobs?q=${searchQuery}&l=${location}`;
    } else if (job.url && job.url.includes('naukri.com')) {
      searchUrl = `https://www.naukri.com/jobs-in-${location}?k=${searchQuery}`;
    } else if (job.url && job.url.includes('glassdoor.com')) {
      searchUrl = `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${searchQuery}&locT=C&locId=${location}`;
    } else {
      // Default to LinkedIn search as it's most comprehensive
      searchUrl = `https://www.linkedin.com/jobs/search/?keywords=${searchQuery}&location=${location}`;
    }

    window.open(searchUrl, '_blank', 'noopener,noreferrer');
  };

  const isValidUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      // Check if it's a real domain (not localhost, not placeholder)
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:' &&
             !url.includes('localhost') &&
             !url.includes('example.com') &&
             !url.includes('placeholder') &&
             !url.includes('mock');
    } catch {
      return false;
    }
  };

  const sortedJobs = [...jobs].sort((a, b) => {
    switch (sortBy) {
      case 'match':
        return (b.matchScore || 0) - (a.matchScore || 0);
      case 'date':
        return new Date(b.postedDate || '').getTime() - new Date(a.postedDate || '').getTime();
      case 'salary':
        // Simple salary comparison - in real app, parse salary ranges properly
        return (b.salaryRange || '').localeCompare(a.salaryRange || '');
      default:
        return 0;
    }
  });

  const filteredJobs = sortedJobs.filter(job => {
    switch (filterBy) {
      case 'high-match':
        return (job.matchScore || 0) >= 70;
      case 'saved':
        return savedJobIds.includes(job.id || '');
      default:
        return true;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Job Matches</h2>
          <p className="text-white/70">
            Found {filteredJobs.length} matching positions
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortBy(sortBy === 'match' ? 'date' : 'match')}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <SortAsc className="w-4 h-4 mr-2" />
            Sort by {sortBy === 'match' ? 'Date' : 'Match'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilterBy(filterBy === 'all' ? 'high-match' : 'all')}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Filter className="w-4 h-4 mr-2" />
            {filterBy === 'all' ? 'High Match' : 'All Jobs'}
          </Button>
          {onExport && (
            <Button
              onClick={onExport}
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          )}
        </div>
      </div>

      {/* Job Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white/5 border-white/10 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {jobs.filter(j => (j.matchScore || 0) >= 80).length}
            </div>
            <p className="text-white/70 text-sm">Excellent Match</p>
          </div>
        </Card>
        <Card className="bg-white/5 border-white/10 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {jobs.filter(j => (j.matchScore || 0) >= 60 && (j.matchScore || 0) < 80).length}
            </div>
            <p className="text-white/70 text-sm">Good Match</p>
          </div>
        </Card>
        <Card className="bg-white/5 border-white/10 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {jobs.filter(j => (j.matchScore || 0) >= 40 && (j.matchScore || 0) < 60).length}
            </div>
            <p className="text-white/70 text-sm">Fair Match</p>
          </div>
        </Card>
        <Card className="bg-white/5 border-white/10 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {savedJobIds.length}
            </div>
            <p className="text-white/70 text-sm">Saved Jobs</p>
          </div>
        </Card>
      </div>

      {/* Job List */}
      <div className="space-y-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job, index) => (
            <Card key={job.id || index} className="bg-black/40 backdrop-blur-xl border border-white/10">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-white text-xl">{job.title}</CardTitle>
                      {job.matchScore && (
                        <Badge className={getMatchBadgeColor(job.matchScore)}>
                          {job.matchScore}% match
                        </Badge>
                      )}
                      {job.featured && (
                        <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                          Featured
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <Building className="w-4 h-4 text-white/70" />
                      <span className="text-white/90 font-medium">{job.company}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-white/60 text-sm">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                      {job.jobType && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.jobType}
                        </span>
                      )}
                      {job.salaryRange && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {job.salaryRange}
                        </span>
                      )}
                      {job.postedDate && (
                        <span className="text-white/50">
                          Posted {new Date(job.postedDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    {job.matchScore && (
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/70">Match Score</span>
                          <span className={getMatchColor(job.matchScore)}>{job.matchScore}%</span>
                        </div>
                        <Progress value={job.matchScore} className="h-2" />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    {onSaveJob && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSaveJob(job)}
                        className="text-white/70 hover:text-white"
                      >
                        {savedJobIds.includes(job.id || '') ? (
                          <BookmarkCheck className="w-4 h-4" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </Button>
                    )}
                    
                    <Collapsible open={expandedJobs[job.id || index]} onOpenChange={() => toggleJob(job.id || index.toString())}>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                          {expandedJobs[job.id || index] ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                    </Collapsible>
                  </div>
                </div>
              </CardHeader>

              <Collapsible open={expandedJobs[job.id || index]} onOpenChange={() => toggleJob(job.id || index.toString())}>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {/* Job Description */}
                      {job.description && (
                        <div>
                          <h4 className="text-white font-medium mb-2">Job Description</h4>
                          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <p className="text-white/80 text-sm leading-relaxed">
                              {job.description.length > 300 
                                ? `${job.description.substring(0, 300)}...` 
                                : job.description
                              }
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Required Skills */}
                      {job.requiredSkills && job.requiredSkills.length > 0 && (
                        <div>
                          <h4 className="text-white font-medium mb-2">Required Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {job.requiredSkills.map((skill, skillIndex) => (
                              <Badge key={skillIndex} className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Match Analysis */}
                      {job.keyMatches && job.keyMatches.length > 0 && (
                        <div>
                          <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                            <Star className="w-4 h-4 text-green-400" />
                            Why You're a Good Match
                          </h4>
                          <ul className="space-y-2">
                            {job.keyMatches.map((match, matchIndex) => (
                              <li key={matchIndex} className="flex items-start gap-2 text-white/80 text-sm">
                                <TrendingUp className="w-3 h-3 text-green-400 mt-1 flex-shrink-0" />
                                {match}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-2">
                        <Button
                          onClick={() => handleViewJob(job)}
                          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Job
                        </Button>
                        <Button
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          Generate Cover Letter
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))
        ) : (
          <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
            <CardContent className="p-8 text-center">
              <p className="text-white/70">No jobs found matching your criteria.</p>
              <p className="text-white/50 text-sm mt-2">Try adjusting your filters or search parameters.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
