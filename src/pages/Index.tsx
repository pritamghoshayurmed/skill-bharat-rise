import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Users, 
  Award, 
  Target, 
  ChevronRight, 
  Play, 
  Star,
  Globe,
  Briefcase,
  GraduationCap,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Menu,
  X
} from "lucide-react";
import { Link } from "react-router-dom";
import { useStats } from "@/hooks/useStats";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { stats: appStats, loading: statsLoading } = useStats();

  const stats = [
    {
      label: "Active Learners",
      value: statsLoading ? "..." : `${appStats.totalUsers.toLocaleString()}+`,
      icon: Users
    },
    {
      label: "Courses Available",
      value: statsLoading ? "..." : `${appStats.activeCourses}+`,
      icon: BookOpen
    },
    {
      label: "Certificates Issued",
      value: statsLoading ? "..." : `${appStats.certificatesIssued.toLocaleString()}+`,
      icon: Award
    },
    {
      label: "Success Rate",
      value: "95%", // This would need a separate calculation
      icon: Target
    }
  ];

  const features = [
    {
      title: "Interactive 3D Labs",
      description: "Experience hands-on learning in virtual environments",
      icon: "🔬",
      gradient: "from-blue-600 to-purple-600"
    },
    {
      title: "Industry-Ready Skills",
      description: "Learn skills that matter in today's job market",
      icon: "🎯",
      gradient: "from-green-600 to-teal-600"
    },
    {
      title: "Expert Mentorship",
      description: "Get guidance from industry professionals",
      icon: "👨‍🏫",
      gradient: "from-orange-600 to-red-600"
    },
    {
      title: "Job Placement Support",
      description: "Direct connections to employment opportunities",
      icon: "💼",
      gradient: "from-purple-600 to-pink-600"
    }
  ];

  const categories = [
    { name: "Programming", courses: 150, icon: "💻", color: "bg-blue-500" },
    { name: "Digital Marketing", courses: 80, icon: "📱", color: "bg-green-500" },
    { name: "Data Science", courses: 65, icon: "📊", color: "bg-purple-500" },
    { name: "Handicrafts", courses: 45, icon: "🎨", color: "bg-pink-500" },
    { name: "Finance", courses: 35, icon: "💰", color: "bg-yellow-500" },
    { name: "Healthcare", courses: 25, icon: "🏥", color: "bg-red-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SB</span>
              </div>
              <span className="text-white font-bold text-xl">SKILL BHARAT</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="#features" className="text-white/80 hover:text-white transition-colors">Features</Link>
              <Link to="#categories" className="text-white/80 hover:text-white transition-colors">Categories</Link>
              <Link to="#about" className="text-white/80 hover:text-white transition-colors">About</Link>
              <Link to="/login">
                <Button 
                  variant="outline" 
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/40 backdrop-blur-sm"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-medium shadow-lg border-0">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-white/10">
              <div className="flex flex-col space-y-4 mt-4">
                <Link to="#features" className="text-white/80 hover:text-white transition-colors">Features</Link>
                <Link to="#categories" className="text-white/80 hover:text-white transition-colors">Categories</Link>
                <Link to="#about" className="text-white/80 hover:text-white transition-colors">About</Link>
                <Link to="/login" className="block">
                  <Button 
                    variant="outline" 
                    className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/40 backdrop-blur-sm"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth" className="block">
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-medium shadow-lg border-0">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Transform Your
                <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent"> Future</span>
                <br />
                With Skills That Matter
              </h1>
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                Join India's premier skill development platform. Learn from experts, 
                practice in 3D labs, and land your dream job with industry-ready skills.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/auth">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-medium shadow-lg border-0 text-lg px-8 py-6"
                  >
                    Start Learning Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/40 backdrop-blur-sm text-lg px-8 py-6"
                >
                  <Play className="mr-2 w-5 h-5" />
                  Watch Demo
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-3xl backdrop-blur-sm border border-white/10 flex items-center justify-center">
                <div className="w-3/4 h-3/4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                  <GraduationCap className="w-24 h-24 text-white" />
                </div>
              </div>
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-black/40 backdrop-blur-xl border border-white/10 text-center">
                <CardContent className="p-6">
                  <stat.icon className="w-8 h-8 text-orange-400 mx-auto mb-4" />
                  <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
                  <p className="text-white/70">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose SKILL BHARAT?</h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Experience the future of learning with our innovative approach to skill development
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-black/40 backdrop-blur-xl border border-white/10 group hover:border-white/20 transition-all">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-white/70">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-20 px-6 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Explore Learning Categories</h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Discover courses across diverse fields and industries
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Card key={index} className="bg-black/40 backdrop-blur-xl border border-white/10 group hover:border-white/20 transition-all cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center text-xl`}>
                        {category.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                        <p className="text-white/60 text-sm">{category.courses} courses</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white/80 transition-colors" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/courses">
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/40 backdrop-blur-sm text-lg px-8 py-6"
              >
                View All Courses
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-gradient-to-r from-orange-500/20 to-pink-500/20 border border-white/20 backdrop-blur-xl">
            <CardContent className="p-12 text-center">
              <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Career?</h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Join thousands of learners who have already upgraded their skills and landed better jobs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-medium shadow-lg border-0 text-lg px-8 py-6"
                  >
                    Start Your Journey
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/courses">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/40 backdrop-blur-sm text-lg px-8 py-6"
                  >
                    Browse Courses
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SB</span>
                </div>
                <span className="text-white font-bold text-xl">SKILL BHARAT</span>
              </div>
              <p className="text-white/60">
                Empowering India's workforce with industry-ready skills and opportunities.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-white/60">
                <li><Link to="/courses" className="hover:text-white transition-colors">Courses</Link></li>
                <li><Link to="/labs" className="hover:text-white transition-colors">3D Labs</Link></li>
                <li><Link to="/jobs" className="hover:text-white transition-colors">Jobs</Link></li>
                <li><Link to="/certificates" className="hover:text-white transition-colors">Certificates</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-white/60">
                <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link to="/community" className="hover:text-white transition-colors">Community</Link></li>
                <li><Link to="/feedback" className="hover:text-white transition-colors">Feedback</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/40 backdrop-blur-sm w-10 h-10 p-0"
                >
                  📘
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/40 backdrop-blur-sm w-10 h-10 p-0"
                >
                  🐦
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/40 backdrop-blur-sm w-10 h-10 p-0"
                >
                  📸
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/60">
            <p>&copy; 2024 SKILL BHARAT. All rights reserved. | Made with ❤️ in India</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
