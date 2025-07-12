
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileText, Clock, CheckCircle, Upload, Eye, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const Assignments = () => {
  const [selectedTab, setSelectedTab] = useState("pending");

  const assignments = [
    {
      id: 1,
      title: "Build a React Portfolio Website",
      course: "Full Stack Web Development",
      dueDate: "2024-01-15",
      status: "pending",
      maxScore: 100,
      description: "Create a personal portfolio website using React.js with responsive design",
      requirements: ["React components", "Responsive design", "Contact form", "Project showcase"],
      submissionType: "GitHub Repository",
      difficulty: "Intermediate"
    },
    {
      id: 2,
      title: "Traditional Embroidery Pattern Design",
      course: "Traditional Embroidery & Handicrafts",
      dueDate: "2024-01-10",
      status: "submitted",
      score: 85,
      maxScore: 100,
      description: "Design and create a traditional Indian embroidery pattern",
      requirements: ["Pattern sketch", "Color selection", "Stitch types", "Final product photo"],
      submissionType: "Image Upload",
      difficulty: "Beginner",
      submittedDate: "2024-01-08"
    },
    {
      id: 3,
      title: "Digital Marketing Campaign Plan",
      course: "Digital Marketing Fundamentals",
      dueDate: "2024-01-20",
      status: "graded",
      score: 92,
      maxScore: 100,
      description: "Create a comprehensive digital marketing campaign for a local business",
      requirements: ["Target audience analysis", "Platform selection", "Content calendar", "Budget allocation"],
      submissionType: "PDF Document",
      difficulty: "Intermediate",
      submittedDate: "2024-01-18",
      feedback: "Excellent work! Great understanding of target audience segmentation."
    },
    {
      id: 4,
      title: "Healthcare Data Analysis",
      course: "Healthcare Technology",
      dueDate: "2024-01-25",
      status: "overdue",
      maxScore: 100,
      description: "Analyze patient data trends and create visualizations",
      requirements: ["Data cleaning", "Statistical analysis", "Visualization charts", "Report summary"],
      submissionType: "Jupyter Notebook",
      difficulty: "Advanced"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-300';
      case 'submitted': return 'bg-blue-500/20 text-blue-300';
      case 'graded': return 'bg-green-500/20 text-green-300';
      case 'overdue': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/20 text-green-300';
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-300';
      case 'Advanced': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    if (selectedTab === "all") return true;
    return assignment.status === selectedTab;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Assignments</h1>
            <p className="text-white/70">Track and submit your course assignments</p>
          </div>
          <Link to="/dashboard">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Total Assignments</p>
                  <p className="text-3xl font-bold text-white">{assignments.length}</p>
                </div>
                <FileText className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Pending</p>
                  <p className="text-3xl font-bold text-yellow-400">
                    {assignments.filter(a => a.status === 'pending').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Completed</p>
                  <p className="text-3xl font-bold text-green-400">
                    {assignments.filter(a => a.status === 'graded').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Average Score</p>
                  <p className="text-3xl font-bold text-white">
                    {Math.round(assignments.filter(a => a.score).reduce((acc, a) => acc + (a.score || 0), 0) / assignments.filter(a => a.score).length)}%
                  </p>
                </div>
                <Badge className="bg-gradient-to-r from-orange-500 to-pink-500 text-2xl px-3 py-1">
                  A
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 mb-8 bg-black/20 rounded-lg p-1">
          {["all", "pending", "submitted", "graded", "overdue"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all capitalize ${
                selectedTab === tab
                  ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab} ({tab === "all" ? assignments.length : assignments.filter(a => a.status === tab).length})
            </button>
          ))}
        </div>

        {/* Assignments List */}
        <div className="space-y-6">
          {filteredAssignments.map((assignment) => (
            <Card key={assignment.id} className="bg-black/40 backdrop-blur-xl border border-white/10">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{assignment.title}</h3>
                      <Badge className={getStatusColor(assignment.status)}>
                        {assignment.status}
                      </Badge>
                      <Badge className={getDifficultyColor(assignment.difficulty)}>
                        {assignment.difficulty}
                      </Badge>
                    </div>
                    <p className="text-white/80 mb-2">{assignment.course}</p>
                    <p className="text-white/70 text-sm mb-4">{assignment.description}</p>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-white font-medium mb-2">Requirements:</h4>
                        <ul className="space-y-1">
                          {assignment.requirements.map((req, index) => (
                            <li key={index} className="text-white/70 text-sm flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 text-green-400" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-white/70 text-sm">
                            <Calendar className="w-4 h-4" />
                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2 text-white/70 text-sm">
                            <Upload className="w-4 h-4" />
                            Submit as: {assignment.submissionType}
                          </div>
                          {assignment.score !== undefined && (
                            <div className="flex items-center gap-2">
                              <span className="text-white/70 text-sm">Score:</span>
                              <Badge className="bg-green-500/20 text-green-300">
                                {assignment.score}/{assignment.maxScore}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {assignment.feedback && (
                      <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 mb-4">
                        <h4 className="text-green-300 font-medium mb-1">Instructor Feedback:</h4>
                        <p className="text-green-200 text-sm">{assignment.feedback}</p>
                      </div>
                    )}

                    {assignment.status === 'graded' && assignment.score && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/70">Progress</span>
                          <span className="text-white">{assignment.score}%</span>
                        </div>
                        <Progress value={assignment.score} className="h-2" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {assignment.status === 'pending' && (
                    <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                      <Upload className="w-4 h-4 mr-2" />
                      Submit Assignment
                    </Button>
                  )}
                  {assignment.status === 'submitted' && (
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      <Eye className="w-4 h-4 mr-2" />
                      View Submission
                    </Button>
                  )}
                  {assignment.status === 'graded' && (
                    <Button variant="outline" className="border-green-500/20 text-green-300 hover:bg-green-500/10">
                      <Eye className="w-4 h-4 mr-2" />
                      View Results
                    </Button>
                  )}
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <FileText className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAssignments.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-white/60" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No assignments found</h3>
            <p className="text-white/60">No assignments match the selected filter</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assignments;
