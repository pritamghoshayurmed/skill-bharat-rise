
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface CourseFormData {
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  price: number;
  instructor: string;
}

export const CourseCreationForm = ({ onCourseCreated }: { onCourseCreated?: () => void }) => {
  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    description: "",
    category: "Programming",
    level: "Beginner",
    duration: "",
    price: 0,
    instructor: ""
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('courses')
        .insert({
          ...formData,
          students_enrolled: 0,
          rating: 0,
          is_featured: false
        });

      if (error) throw error;

      toast({
        title: "Course Created!",
        description: "Your course has been created successfully",
      });

      setFormData({
        title: "",
        description: "",
        category: "Programming",
        level: "Beginner",
        duration: "",
        price: 0,
        instructor: ""
      });

      onCourseCreated?.();
    } catch (error: any) {
      console.error('Error creating course:', error);
      toast({
        title: "Error",
        description: "Failed to create course",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Create New Course
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">Course Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                placeholder="e.g., Advanced React Development"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructor" className="text-white">Instructor Name</Label>
              <Input
                id="instructor"
                value={formData.instructor}
                onChange={(e) => setFormData({...formData, instructor: e.target.value})}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                placeholder="Instructor name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-white">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Programming">Programming</SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="level" className="text-white">Level</Label>
              <Select value={formData.level} onValueChange={(value) => setFormData({...formData, level: value})}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="text-white">Duration</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                placeholder="e.g., 8 weeks"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price" className="text-white">Price (₹)</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              placeholder="0 for free"
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">Course Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              placeholder="Describe what students will learn in this course..."
              rows={4}
              required
            />
          </div>

          <Button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            {loading ? 'Creating...' : 'Create Course'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
