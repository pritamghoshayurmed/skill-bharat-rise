import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Box, Beaker, Microscope, Cpu, Heart, Palette, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Labs = () => {
  const labs = [
    {
      id: 1,
      title: "3D Web Development Lab",
      description: "Interactive 3D environment to learn HTML, CSS, and JavaScript",
      category: "Programming",
      difficulty: "Beginner",
      duration: "45 min",
      participants: 2500,
      icon: Box,
      gradient: "from-blue-600 to-purple-600"
    },
    {
      id: 2,
      title: "Virtual Chemistry Lab",
      description: "Conduct chemical experiments in a safe virtual environment",
      category: "Science",
      difficulty: "Intermediate",
      duration: "60 min",
      participants: 1800,
      icon: Beaker,
      gradient: "from-green-600 to-teal-600"
    },
    {
      id: 3,
      title: "Digital Tailoring Studio",
      description: "Learn pattern making and garment construction in 3D",
      category: "Handicrafts",
      difficulty: "Beginner",
      duration: "30 min",
      participants: 1200,
      icon: Palette,
      gradient: "from-pink-600 to-rose-600"
    },
    {
      id: 4,
      title: "Medical Simulation Lab",
      description: "Practice medical procedures and diagnostics safely",
      category: "Healthcare",
      difficulty: "Advanced",
      duration: "90 min",
      participants: 950,
      icon: Heart,
      gradient: "from-red-600 to-orange-600"
    },
    {
      id: 5,
      title: "IoT Electronics Lab",
      description: "Build and test IoT devices in virtual environment",
      category: "Technology",
      difficulty: "Intermediate",
      duration: "75 min",
      participants: 1650,
      icon: Cpu,
      gradient: "from-indigo-600 to-blue-600"
    },
    {
      id: 6,
      title: "Microscopy Lab",
      description: "Explore microscopic world with virtual microscopes",
      category: "Biology",
      difficulty: "Beginner",
      duration: "40 min",
      participants: 2100,
      icon: Microscope,
      gradient: "from-purple-600 to-pink-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">3D Interactive Labs</h1>
              <p className="text-white/70">Hands-on learning in immersive virtual environments</p>
            </div>
            <Link to="/dashboard">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Back to Dashboard
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">6</div>
              <div className="text-white/60 text-sm">Active Labs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">10.2K</div>
              <div className="text-white/60 text-sm">Total Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">500+</div>
              <div className="text-white/60 text-sm">Experiments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">98%</div>
              <div className="text-white/60 text-sm">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Labs Grid */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Available Labs</h2>
          <p className="text-white/70">
            Experience hands-on learning with our cutting-edge 3D virtual laboratories
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {labs.map((lab) => {
            const IconComponent = lab.icon;
            return (
              <Card key={lab.id} className="bg-black/40 backdrop-blur-xl border border-white/10 group hover:border-white/20 transition-all">
                <CardContent className="p-0">
                  <div className={`aspect-video bg-gradient-to-br ${lab.gradient} rounded-t-lg flex items-center justify-center group-hover:scale-105 transition-transform relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/20"></div>
                    <IconComponent className="w-16 h-16 text-white relative z-10" />
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className="bg-black/40 text-white">
                        {lab.difficulty}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="bg-white/10 text-white/80">
                        {lab.category}
                      </Badge>
                      <span className="text-white/60 text-sm">{lab.duration}</span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-300 transition-colors">
                      {lab.title}
                    </h3>
                    
                    <p className="text-white/70 text-sm mb-4">
                      {lab.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="text-white/60 text-sm">
                        {lab.participants.toLocaleString()} participants
                      </div>
                    </div>

                    <Link to={`/labs/${lab.id}`}>
                      <Button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                        Enter Lab
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Why Choose Our 3D Labs?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Box className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Immersive Experience</h3>
              <p className="text-white/70">
                Fully interactive 3D environments that simulate real-world scenarios
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Beaker className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Safe Learning</h3>
              <p className="text-white/70">
                Make mistakes and learn without any real-world consequences
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Accessible</h3>
              <p className="text-white/70">
                Access professional-grade equipment from anywhere in the world
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Labs;
