
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, Briefcase, Users, Award, Target, Globe } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-lg border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Globe className="w-8 h-8 text-orange-500" />
            <h1 className="text-2xl font-bold text-white">SKILL BHARAT</h1>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <Link to="/dashboard">
                <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    Login
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-orange-500/20 text-orange-300 hover:bg-orange-500/30">
            Empowering India's Future
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Transform Lives Through
            <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              {" "}Skills
            </span>
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
            India's premier skill development platform connecting university students, rural women, 
            and underserved youth with opportunities that change lives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={user ? "/dashboard" : "/auth"}>
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                Start Learning
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/courses">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Explore Courses
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">50,000+</div>
            <div className="text-white/70">Students Trained</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">200+</div>
            <div className="text-white/70">Courses Available</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">1,000+</div>
            <div className="text-white/70">Jobs Connected</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">95%</div>
            <div className="text-white/70">Success Rate</div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <Card className="bg-black/40 backdrop-blur-xl border border-white/10 group hover:border-white/20 transition-all">
            <CardHeader>
              <BookOpen className="w-12 h-12 text-orange-500 mb-4" />
              <CardTitle className="text-white">Expert-Led Courses</CardTitle>
              <CardDescription className="text-white/70">
                Learn from industry experts with hands-on projects and real-world applications
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-black/40 backdrop-blur-xl border border-white/10 group hover:border-white/20 transition-all">
            <CardHeader>
              <Briefcase className="w-12 h-12 text-green-500 mb-4" />
              <CardTitle className="text-white">Job Placement</CardTitle>
              <CardDescription className="text-white/70">
                Direct connections to employers with guaranteed interview opportunities
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-black/40 backdrop-blur-xl border border-white/10 group hover:border-white/20 transition-all">
            <CardHeader>
              <Award className="w-12 h-12 text-purple-500 mb-4" />
              <CardTitle className="text-white">Certified Learning</CardTitle>
              <CardDescription className="text-white/70">
                Earn industry-recognized certificates that boost your career prospects
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Target Groups */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Who We Serve</h2>
            <p className="text-white/70 text-lg">Tailored programs for different communities across India</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-blue-500/20">
              <CardHeader>
                <Users className="w-10 h-10 text-blue-400 mb-4" />
                <CardTitle className="text-white">University Students</CardTitle>
                <CardDescription className="text-white/70">
                  Advanced technical skills, industry internships, and career guidance for college students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-white/60 space-y-2">
                  <li>• Full-stack development</li>
                  <li>• Data science & AI</li>
                  <li>• Digital marketing</li>
                  <li>• Industry placements</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-pink-900/50 to-rose-900/50 border-pink-500/20">
              <CardHeader>
                <Target className="w-10 h-10 text-pink-400 mb-4" />
                <CardTitle className="text-white">Rural Women</CardTitle>
                <CardDescription className="text-white/70">
                  Entrepreneurship training, traditional crafts, and digital literacy programs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-white/60 space-y-2">
                  <li>• Handicrafts & textiles</li>
                  <li>• Small business setup</li>
                  <li>• Digital payments</li>
                  <li>• Market access</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-900/50 to-teal-900/50 border-green-500/20">
              <CardHeader>
                <BookOpen className="w-10 h-10 text-green-400 mb-4" />
                <CardTitle className="text-white">Underserved Youth</CardTitle>
                <CardDescription className="text-white/70">
                  Basic skills training, life skills, and pathway to employment opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-white/60 space-y-2">
                  <li>• Basic computer skills</li>
                  <li>• Communication training</li>
                  <li>• Vocational skills</li>
                  <li>• Job readiness</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-2xl p-12 backdrop-blur-sm border border-white/10">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Future?</h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of learners who have already transformed their lives through our comprehensive skill development programs.
          </p>
          <Link to={user ? "/dashboard" : "/auth"}>
            <Button size="lg" className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
              {user ? "Continue Learning" : "Start Your Journey"}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </section>
      </section>
    </div>
  );
};

export default Index;
