
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Book } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ModuleFormData {
  title: string;
  description: string;
  duration_minutes: number;
  order_index: number;
}

interface ModuleCreationFormProps {
  courseId: string;
  onModuleCreated: () => void;
  nextOrderIndex: number;
}

export const ModuleCreationForm = ({ courseId, onModuleCreated, nextOrderIndex }: ModuleCreationFormProps) => {
  const [formData, setFormData] = useState<ModuleFormData>({
    title: "",
    description: "",
    duration_minutes: 60,
    order_index: nextOrderIndex
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .rpc('create_course_module', {
          p_course_id: courseId,
          p_title: formData.title,
          p_description: formData.description,
          p_duration_minutes: formData.duration_minutes,
          p_order_index: formData.order_index
        });

      if (error) throw error;

      toast({
        title: "Module Created!",
        description: "Course module has been added successfully",
      });

      setFormData({
        title: "",
        description: "",
        duration_minutes: 60,
        order_index: nextOrderIndex + 1
      });

      onModuleCreated();
    } catch (error: any) {
      console.error('Error creating module:', error);
      toast({
        title: "Error",
        description: "Failed to create module",
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
          Add Course Module
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="module-title" className="text-white">Module Title</Label>
            <Input
              id="module-title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              placeholder="e.g., Introduction to React Hooks"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-white">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration_minutes}
                onChange={(e) => setFormData({...formData, duration_minutes: Number(e.target.value)})}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                min="1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="order" className="text-white">Order</Label>
              <Input
                id="order"
                type="number"
                value={formData.order_index}
                onChange={(e) => setFormData({...formData, order_index: Number(e.target.value)})}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                min="1"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="module-description" className="text-white">Module Description</Label>
            <Textarea
              id="module-description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              placeholder="Describe what students will learn in this module..."
              rows={3}
            />
          </div>

          <Button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            <Book className="w-4 h-4 mr-2" />
            {loading ? 'Adding...' : 'Add Module'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
