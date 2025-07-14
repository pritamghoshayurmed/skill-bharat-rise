import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Atom, Beaker, Microscope, ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import MolecularViewer3D from "@/components/MolecularViewer3D";

const Labs = () => {

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
              <div className="text-2xl font-bold text-white mb-1">1</div>
              <div className="text-white/60 text-sm">Active Lab</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">3D</div>
              <div className="text-white/60 text-sm">Interactive</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">Real-time</div>
              <div className="text-white/60 text-sm">Rendering</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">Educational</div>
              <div className="text-white/60 text-sm">Content</div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Lab */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Featured 3D Lab</h2>
          <p className="text-white/70">
            Experience hands-on learning with our interactive 3D molecular viewer
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 3D Molecular Viewer */}
          <div>
            <MolecularViewer3D />
          </div>

          {/* Lab Information */}
          <div className="space-y-6">
            <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Atom className="w-5 h-5" />
                  Molecular Chemistry Lab
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Badge className="bg-gradient-to-r from-green-500 to-teal-500">
                    Chemistry
                  </Badge>
                  <Badge variant="outline" className="border-white/30 text-white">
                    Beginner Friendly
                  </Badge>
                  <Badge variant="outline" className="border-white/30 text-white">
                    Interactive
                  </Badge>
                </div>

                <p className="text-white/80 leading-relaxed">
                  Explore the fascinating world of molecular chemistry through our interactive 3D viewer.
                  Visualize molecular structures, understand chemical bonds, and learn about different
                  compounds in an immersive environment.
                </p>

                <div className="space-y-3">
                  <h4 className="text-white font-semibold">What you'll learn:</h4>
                  <ul className="text-white/70 space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      Molecular structure and geometry
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      Chemical bonding principles
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      3D visualization techniques
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      Interactive molecular manipulation
                    </li>
                  </ul>
                </div>

                <Button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                  <Play className="w-4 h-4 mr-2" />
                  Start Learning
                </Button>
              </CardContent>
            </Card>

            {/* Additional Features */}
            <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg">Lab Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Atom className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Real-time 3D Rendering</h4>
                    <p className="text-white/60 text-sm">Powered by Three.js for smooth interactions</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <Beaker className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Multiple Molecules</h4>
                    <p className="text-white/60 text-sm">Explore water, methane, caffeine, and more</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <Microscope className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Educational Content</h4>
                    <p className="text-white/60 text-sm">Learn with detailed molecular descriptions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Why Choose Our 3D Molecular Lab?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Atom className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Real-time 3D Visualization</h3>
              <p className="text-white/70">
                Interact with molecular structures in real-time using advanced 3D rendering
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Beaker className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Educational Content</h3>
              <p className="text-white/70">
                Learn chemistry concepts through interactive molecular exploration
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Microscope className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Professional Tools</h3>
              <p className="text-white/70">
                Use industry-standard visualization techniques for molecular analysis
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Labs;
