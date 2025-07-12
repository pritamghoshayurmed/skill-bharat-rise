
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BookOpen, Users, Trophy, Briefcase, Star, Play, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SB</span>
              </div>
              <span className="text-white text-xl font-bold">SKILL BHARAT</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/courses" className="text-white/80 hover:text-white transition-colors">Courses</Link>
              <Link to="/labs" className="text-white/80 hover:text-white transition-colors">3D Labs</Link>
              <Link to="/jobs" className="text-white/80 hover:text-white transition-colors">Jobs</Link>
              <Link to="/about" className="text-white/80 hover:text-white transition-colors">About</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-pink-500/20 border border-orange-500/30 mb-8">
            <Star className="w-4 h-4 text-orange-400 mr-2" />
            <span className="text-orange-300 text-sm font-medium">India's Premier Digital Upskilling Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Transform Your
            <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent"> Career Journey</span>
          </h1>
          
          <p className="text-xl text-white/70 mb-10 max-w-3xl mx-auto leading-relaxed">
            Empowering Rural Women, Youth, and Students across India with cutting-edge skills through immersive learning, 3D labs, and real-world projects.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/register">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-lg px-8 py-4">
                Start Learning Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/courses">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-4">
                <Play className="mr-2 w-5 h-5" />
                Explore Courses
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">50K+</div>
              <div className="text-white/60">Active Learners</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">200+</div>
              <div className="text-white/60">Expert Courses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">95%</div>
              <div className="text-white/60">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">1000+</div>
              <div className="text-white/60">Job Placements</div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Choose Your Learning Path</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Personalized learning experiences designed for different communities across India
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Rural Women</h3>
                <p className="text-white/70 mb-6">Master traditional crafts, tailoring, and entrepreneurship skills to build sustainable livelihoods.</p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-white/80">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    Handcrafting & Embroidery
                  </li>
                  <li className="flex items-center text-white/80">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    Tailoring & Fashion Design
                  </li>
                  <li className="flex items-center text-white/80">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    Business & Marketing
                  </li>
                </ul>
                <Link to="/courses?category=rural-women">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                    Explore Courses
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-900/50 to-teal-900/50 border-green-500/20 hover:border-green-400/40 transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">University Students</h3>
                <p className="text-white/70 mb-6">Advanced coding, healthcare science, and technology skills for career excellence.</p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-white/80">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    Full-Stack Development
                  </li>
                  <li className="flex items-center text-white/80">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    Healthcare Technology
                  </li>
                  <li className="flex items-center text-white/80">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    Data Science & AI
                  </li>
                </ul>
                <Link to="/courses?category=university">
                  <Button className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600">
                    Explore Courses
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-900/50 to-red-900/50 border-orange-500/20 hover:border-orange-400/40 transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Underserved Youth</h3>
                <p className="text-white/70 mb-6">Essential digital skills and vocational training for immediate employment opportunities.</p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-white/80">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    Digital Literacy
                  </li>
                  <li className="flex items-center text-white/80">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    Vocational Skills
                  </li>
                  <li className="flex items-center text-white/80">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    Job Readiness
                  </li>
                </ul>
                <Link to="/courses?category=youth">
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                    Explore Courses
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-slate-900/50 to-purple-900/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Why Choose SKILL BHARAT?</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Complete ecosystem for skill development and career advancement
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Interactive 3D Labs</h3>
              <p className="text-white/70">Hands-on learning with immersive 3D environments and real-world simulations.</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Verified Certificates</h3>
              <p className="text-white/70">Industry-recognized certificates based on performance and skill assessments.</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Briefcase className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Job Portal</h3>
              <p className="text-white/70">Direct connections to employers actively seeking skilled professionals.</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">AI Resume Builder</h3>
              <p className="text-white/70">Automatically generated resumes showcasing your completed skills and achievements.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Future?</h2>
          <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            Join thousands of learners who have already started their journey towards a brighter future.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-lg px-10 py-4">
              Start Your Journey Today
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/30 border-t border-white/10 py-12 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-pink-500 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">SB</span>
                </div>
                <span className="text-white font-bold">SKILL BHARAT</span>
              </div>
              <p className="text-white/60 text-sm">Empowering India's workforce through digital transformation and skill development.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2">
                <li><Link to="/courses" className="text-white/60 hover:text-white text-sm">Courses</Link></li>
                <li><Link to="/labs" className="text-white/60 hover:text-white text-sm">3D Labs</Link></li>
                <li><Link to="/jobs" className="text-white/60 hover:text-white text-sm">Jobs</Link></li>
                <li><Link to="/certificates" className="text-white/60 hover:text-white text-sm">Certificates</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link to="/help" className="text-white/60 hover:text-white text-sm">Help Center</Link></li>
                <li><Link to="/contact" className="text-white/60 hover:text-white text-sm">Contact Us</Link></li>
                <li><Link to="/privacy" className="text-white/60 hover:text-white text-sm">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-white/60 hover:text-white text-sm">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/60 hover:text-white text-sm">Twitter</a></li>
                <li><a href="#" className="text-white/60 hover:text-white text-sm">LinkedIn</a></li>
                <li><a href="#" className="text-white/60 hover:text-white text-sm">Facebook</a></li>
                <li><a href="#" className="text-white/60 hover:text-white text-sm">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-white/60 text-sm">© 2024 SKILL BHARAT. All rights reserved. Made with ❤️ for India.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
