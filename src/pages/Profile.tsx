
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Phone, MapPin, Edit, Save, Camera, Award, BookOpen, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useUserEnrollments } from "@/hooks/useUserEnrollments";
import { useCertificates } from "@/hooks/useCertificates";
import { useAchievements } from "@/hooks/useAchievements";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useUserProfile();
  const { enrollments, loading: enrollmentsLoading } = useUserEnrollments();
  const { certificates, loading: certificatesLoading } = useCertificates();
  const { achievements, loading: achievementsLoading } = useAchievements();

  const [profileData, setProfileData] = useState({
    name: profile?.full_name || user?.email || "User",
    email: profile?.email || user?.email || "",
    phone: "",
    location: "",
    bio: "",
    category: profile?.category || "student",
    joinDate: profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "Recently"
  });

  // Update local state when profile data loads
  useState(() => {
    if (profile) {
      setProfileData({
        name: profile.full_name || user?.email || "User",
        email: profile.email || user?.email || "",
        phone: "",
        location: "",
        bio: "",
        category: profile.category || "student",
        joinDate: new Date(profile.created_at).toLocaleDateString()
      });
    }
  });

  // Transform enrollments to completed courses format
  const completedCourses = enrollments
    .filter(enrollment => enrollment.completed)
    .map(enrollment => ({
      id: enrollment.id,
      title: enrollment.course?.title || "Course",
      completion: 100,
      grade: "Completed",
      date: enrollment.completed_at ? new Date(enrollment.completed_at).toLocaleDateString() : "Recently"
    }));

  // For now, we'll use empty skills array since we don't have a skills table
  const skills: any[] = [];

  const handleSave = async () => {
    if (profile) {
      await updateProfile({
        full_name: profileData.name,
        email: profileData.email
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
            <p className="text-white/70">Manage your account and track your progress</p>
          </div>
          <Link to="/dashboard">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
              <CardContent className="p-6 text-center">
                <div className="relative mb-4">
                  <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-white font-bold text-3xl">
                      {profileData.name.charAt(0)}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-1/2 rounded-full w-8 h-8 p-0 bg-white/20 hover:bg-white/30"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                
                <h2 className="text-xl font-bold text-white mb-1">{profileData.name}</h2>
                <p className="text-white/70 text-sm mb-2">{profileData.category}</p>
                <p className="text-white/60 text-xs">Member since {profileData.joinDate}</p>
                
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="grid grid-cols-3 gap-4 text-center text-sm">
                    <div>
                      <div className="text-white font-bold">12</div>
                      <div className="text-white/60 text-xs">Courses</div>
                    </div>
                    <div>
                      <div className="text-white font-bold">8</div>
                      <div className="text-white/60 text-xs">Completed</div>
                    </div>
                    <div>
                      <div className="text-white font-bold">5</div>
                      <div className="text-white/60 text-xs">Certificates</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/resume-builder" className="block">
                  <Button variant="outline" className="w-full justify-start border-white/20 text-white hover:bg-white/10">
                    <User className="w-4 h-4 mr-2" />
                    Build Resume
                  </Button>
                </Link>
                <Link to="/certificates" className="block">
                  <Button variant="outline" className="w-full justify-start border-white/20 text-white hover:bg-white/10">
                    <Award className="w-4 h-4 mr-2" />
                    View Certificates
                  </Button>
                </Link>
                <Link to="/courses" className="block">
                  <Button variant="outline" className="w-full justify-start border-white/20 text-white hover:bg-white/10">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Browse Courses
                  </Button>
                </Link>
                <Link to="/assignments" className="block">
                  <Button variant="outline" className="w-full justify-start border-white/20 text-white hover:bg-white/10">
                    <Target className="w-4 h-4 mr-2" />
                    View Assignments
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="bg-black/20 border border-white/10 mb-6">
                <TabsTrigger value="personal" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500">
                  Personal Info
                </TabsTrigger>
                <TabsTrigger value="progress" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500">
                  Learning Progress
                </TabsTrigger>
                <TabsTrigger value="achievements" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500">
                  Achievements
                </TabsTrigger>
                <TabsTrigger value="skills" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500">
                  Skills
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-6">
                <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">Personal Information</CardTitle>
                      <Button
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                      >
                        {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                        {isEditing ? "Save" : "Edit"}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-white">Full Name</Label>
                        {isEditing ? (
                          <Input
                            id="name"
                            value={profileData.name}
                            onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                            className="bg-white/10 border-white/20 text-white"
                          />
                        ) : (
                          <div className="flex items-center gap-2 text-white">
                            <User className="w-4 h-4 text-white/60" />
                            {profileData.name}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">Email</Label>
                        {isEditing ? (
                          <Input
                            id="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                            className="bg-white/10 border-white/20 text-white"
                          />
                        ) : (
                          <div className="flex items-center gap-2 text-white">
                            <Mail className="w-4 h-4 text-white/60" />
                            {profileData.email}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-white">Phone</Label>
                        {isEditing ? (
                          <Input
                            id="phone"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                            className="bg-white/10 border-white/20 text-white"
                          />
                        ) : (
                          <div className="flex items-center gap-2 text-white">
                            <Phone className="w-4 h-4 text-white/60" />
                            {profileData.phone}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-white">Location</Label>
                        {isEditing ? (
                          <Input
                            id="location"
                            value={profileData.location}
                            onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                            className="bg-white/10 border-white/20 text-white"
                          />
                        ) : (
                          <div className="flex items-center gap-2 text-white">
                            <MapPin className="w-4 h-4 text-white/60" />
                            {profileData.location}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-white">Bio</Label>
                      {isEditing ? (
                        <Textarea
                          id="bio"
                          value={profileData.bio}
                          onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                          className="bg-white/10 border-white/20 text-white"
                          rows={4}
                        />
                      ) : (
                        <p className="text-white/80 leading-relaxed">{profileData.bio}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="progress" className="space-y-6">
                <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Course Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {completedCourses.map((course) => (
                      <div key={course.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-white">{course.title}</h3>
                          <div className="flex items-center gap-2">
                            <Badge className={
                              course.completion === 100 
                                ? 'bg-green-500/20 text-green-300' 
                                : 'bg-yellow-500/20 text-yellow-300'
                            }>
                              {course.grade}
                            </Badge>
                            <span className="text-white/60 text-sm">{course.date}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/70">Progress</span>
                            <span className="text-white">{course.completion}%</span>
                          </div>
                          <Progress value={course.completion} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="achievements" className="space-y-6">
                <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Achievements & Badges</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {achievements.map((achievement) => (
                        <div key={achievement.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                          <div className="flex items-start gap-3">
                            <div className="text-2xl">{achievement.icon}</div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-white mb-1">{achievement.title}</h3>
                              <p className="text-white/70 text-sm mb-2">{achievement.description}</p>
                              <p className="text-white/60 text-xs">{achievement.date}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="skills" className="space-y-6">
                <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Skills & Expertise</CardTitle>
                    <p className="text-white/70">Skills gained from completed courses and lab activities</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {skills.map((skill, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium text-white">{skill.name}</span>
                              <Badge variant="secondary" className="ml-2 bg-white/10 text-white/80 text-xs">
                                {skill.category}
                              </Badge>
                            </div>
                            <span className="text-white/70 text-sm">{skill.level}%</span>
                          </div>
                          <Progress value={skill.level} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
