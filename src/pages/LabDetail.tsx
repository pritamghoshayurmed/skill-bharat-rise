
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Play, Users, Clock, Trophy, Box, RotateCcw, Settings, Maximize } from "lucide-react";
import { useLab } from "@/hooks/useLab";
import CSS3DLab from "@/components/CSS3DLab";

const LabDetail = () => {
  const { id } = useParams();
  const [isLabActive, setIsLabActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const { lab, loading } = useLab(id || '');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading lab details...</div>
      </div>
    );
  }

  if (!lab) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Lab not found</div>
      </div>
    );
  }

  // Mock additional data that's not in the database yet
  const labExtras = {
    id: 1,
    title: "3D Web Development Lab",
    description: "Interactive 3D environment to learn HTML, CSS, and JavaScript through hands-on coding exercises and real-time visualization.",
    category: "Programming",
    difficulty: "Beginner",
    duration: "45 min",
    participants: 2500,
    rating: 4.8,
    completionRate: 87,
    objectives: [
      "Master HTML5 semantic elements",
      "Style components with CSS3",
      "Add interactivity with JavaScript",
      "Build responsive layouts",
      "Debug code in real-time"
    ],
    tools: [
      "3D Code Editor",
      "Live Preview Panel",
      "Interactive Console",
      "Asset Library",
      "Collaboration Tools"
    ],
    experiments: [
      { id: 1, title: "HTML Structure Basics", duration: "10 min", completed: true },
      { id: 2, title: "CSS Styling & Layout", duration: "15 min", completed: true },
      { id: 3, title: "JavaScript Fundamentals", duration: "12 min", completed: false },
      { id: 4, title: "Responsive Design", duration: "8 min", completed: false },
    ]
  };

  const completedExperiments = lab.experiments.filter(exp => exp.completed).length;
  const progressPercentage = (completedExperiments / lab.experiments.length) * 100;

  const handleStartLab = () => {
    setIsLabActive(true);
    // Simulate lab session
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto">
          <Link to="/labs" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Labs
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-blue-500/20 text-blue-300">
                  {lab.difficulty || 'Beginner'}
                </Badge>
                <Badge variant="outline" className="border-white/20 text-white">
                  {lab.category || 'General'}
                </Badge>
                <div className="flex items-center gap-1 text-white/70">
                  <Users className="w-4 h-4" />
                  <span>{(lab.participants || 0).toLocaleString()}</span>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-white mb-4">{lab.title}</h1>
              <p className="text-xl text-white/80 mb-6">{lab.description || 'Interactive virtual lab experience'}</p>

              <div className="flex items-center gap-6 text-white/70">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{lab.duration || 'Self-paced'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span>4.8 rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{lab.completionRate}% completion rate</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="bg-black/40 backdrop-blur-xl border border-white/10 sticky top-6">
                <CardContent className="p-6">
                  {!isLabActive ? (
                    <>
                      <div className="aspect-video bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg mb-6 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/20"></div>
                        <Box className="w-16 h-16 text-white relative z-10" />
                      </div>

                      <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-white mb-2">Ready to Start?</h3>
                        <p className="text-white/70 text-sm mb-4">
                          Launch the 3D interactive environment and begin your hands-on learning experience.
                        </p>
                        
                        {progressPercentage > 0 && (
                          <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-white/70">Progress</span>
                              <span className="text-white">{Math.round(progressPercentage)}%</span>
                            </div>
                            <Progress value={progressPercentage} className="h-2" />
                          </div>
                        )}
                      </div>

                      <Button 
                        onClick={handleStartLab}
                        className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 mb-4"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {progressPercentage > 0 ? "Continue Lab" : "Start Lab"}
                      </Button>
                    </>
                  ) : (
                    <>
                      {/* 3D Lab Environment */}
                      <div className="mb-6">
                        <CSS3DLab
                          labId={lab.id}
                          labTitle={lab.title}
                          labType={lab.category?.toLowerCase() as any || 'programming'}
                          onProgressUpdate={(newProgress) => setProgress(newProgress)}
                          onExperimentComplete={(results) => {
                            console.log('Experiment completed:', results);
                            setProgress(100);
                          }}
                        />
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/70">Session Progress</span>
                          <span className="text-white">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                          <Settings className="w-4 h-4 mr-1" />
                          Settings
                        </Button>
                        <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                          <Maximize className="w-4 h-4 mr-1" />
                          Fullscreen
                        </Button>
                        <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                          <RotateCcw className="w-4 h-4 mr-1" />
                          Reset
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                          onClick={() => setIsLabActive(false)}
                        >
                          Exit Lab
                        </Button>
                      </div>
                    </>
                  )}

                  <div className="space-y-3 text-sm text-white/80">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Safe learning environment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Real-time feedback</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Progress tracking</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Lab Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Learning Objectives */}
        <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Learning Objectives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {lab.objectives.map((objective, index) => (
                <div key={index} className="flex items-center gap-3 text-white/80">
                  <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <span>{objective}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Experiments */}
          <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Lab Experiments</CardTitle>
              <p className="text-white/70">
                Complete {lab.experiments.length} hands-on experiments
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {lab.experiments.map((experiment, index) => (
                <div key={experiment.id} className={`p-4 rounded-lg border ${
                  experiment.completed 
                    ? 'bg-green-500/10 border-green-500/20' 
                    : 'bg-white/5 border-white/10'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        experiment.completed 
                          ? 'bg-green-500 text-white' 
                          : 'bg-white/10 text-white/80'
                      }`}>
                        {experiment.completed ? '✓' : index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{experiment.title}</h3>
                        <p className="text-white/60 text-sm">{experiment.duration}</p>
                      </div>
                    </div>
                    {!experiment.completed && (
                      <Button size="sm" className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                        Start
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Tools & Features */}
          <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Available Tools</CardTitle>
              <p className="text-white/70">
                Professional-grade tools for immersive learning
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {lab.tools.map((tool, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Box className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white font-medium">{tool}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Lab Stats */}
        <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Lab Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">{lab.participants.toLocaleString()}</div>
                <div className="text-white/60">Total Participants</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">{lab.completionRate}%</div>
                <div className="text-white/60">Completion Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">{lab.rating}</div>
                <div className="text-white/60">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">{lab.experiments.length}</div>
                <div className="text-white/60">Experiments</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LabDetail;
