
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ModuleCreationFormProps {
  courseId: string;
  onModuleCreated: () => void;
}

export const ModuleCreationForm = ({ courseId, onModuleCreated }: ModuleCreationFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(0);
  const [orderIndex, setOrderIndex] = useState(1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase.rpc('create_course_module', {
        p_course_id: courseId,
        p_title: title,
        p_description: description,
        p_duration_minutes: durationMinutes,
        p_order_index: orderIndex
      });

      if (error) throw error;

      toast({
        title: "Module Created!",
        description: "Your course module has been created successfully",
      });

      // Reset form
      setTitle("");
      setDescription("");
      setDurationMinutes(0);
      setOrderIndex(orderIndex + 1);
      
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
        <CardTitle className="text-white">Add New Module</CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-white text-sm mb-2 block">Module Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter module title..."
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              required
            />
          </div>
          
          <div>
            <label className="text-white text-sm mb-2 block">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter module description..."
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-white text-sm mb-2 block">Duration (minutes)</label>
              <Input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 0)}
                className="bg-white/10 border-white/20 text-white"
                min="0"
              />
            </div>
            
            <div>
              <label className="text-white text-sm mb-2 block">Order Index</label>
              <Input
                type="number"
                value={orderIndex}
                onChange={(e) => setOrderIndex(parseInt(e.target.value) || 1)}
                className="bg-white/10 border-white/20 text-white"
                min="1"
              />
            </div>
          </div>
          
          <Button
            type="submit"
            disabled={loading || !title.trim()}
            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
          >
            {loading ? "Creating..." : "Create Module"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
