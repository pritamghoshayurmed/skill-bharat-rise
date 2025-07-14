import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Play, Plus, Youtube, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LessonCreationFormProps {
  moduleId: string;
  onLessonCreated: () => void;
  orderIndex?: number;
}

export const LessonCreationForm = ({ moduleId, onLessonCreated, orderIndex = 1 }: LessonCreationFormProps) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    videoUrl: "",
    durationMinutes: 0,
    isPreview: false
  });
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const { toast } = useToast();

  // Check permissions when component mounts
  useEffect(() => {
    checkUserPermissions();
  }, []);

  const extractYouTubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
      /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const validateYouTubeUrl = (url: string): boolean => {
    if (!url) return true; // Empty URL is valid
    return extractYouTubeId(url) !== null;
  };

  const checkUserPermissions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setPermissionError('User not authenticated');
        return false;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user.id)
        .single();

      if (profileError) {
        setPermissionError('Could not load user profile');
        return false;
      }

      setUserType(profile?.user_type || null);

      if (!profile || (profile.user_type !== 'company' && profile.user_type !== 'admin')) {
        setPermissionError(`You need to be a company user to create lessons. Current user type: ${profile?.user_type || 'unknown'}`);
        return false;
      }

      setPermissionError(null);
      return true;
    } catch (error) {
      setPermissionError('Error checking permissions');
      return false;
    }
  };

  const upgradeToCompanyUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({ user_type: 'company' })
        .eq('id', user.id);

      if (error) throw error;

      setUserType('company');
      setPermissionError(null);
      toast({
        title: "Profile Updated!",
        description: "You can now create courses and lessons as a company user.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update profile: " + error.message,
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (formData.videoUrl && !validateYouTubeUrl(formData.videoUrl)) {
      toast({
        title: "Invalid YouTube URL",
        description: "Please enter a valid YouTube video URL",
        variant: "destructive"
      });
      return;
    }

    // Check permissions before proceeding
    const hasPermission = await checkUserPermissions();
    if (!hasPermission) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('course_lessons')
        .insert({
          module_id: moduleId,
          title: formData.title,
          content: formData.content || null,
          video_url: formData.videoUrl || null,
          duration_minutes: formData.durationMinutes,
          order_index: orderIndex,
          lesson_type: formData.videoUrl ? 'video' : 'text'
          // Temporarily removed is_preview until column is added to database
        });

      if (error) throw error;

      toast({
        title: "Lesson Created!",
        description: "Your lesson has been created successfully",
      });

      // Reset form
      setFormData({
        title: "",
        content: "",
        videoUrl: "",
        durationMinutes: 0,
        isPreview: false
      });
      
      onLessonCreated();
    } catch (error: any) {
      console.error('Error creating lesson:', error);
      console.error('Error details:', error.message, error.details, error.hint);
      toast({
        title: "Error",
        description: error.message || "Failed to create lesson",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getYouTubeThumbnail = (url: string): string | null => {
    const videoId = extractYouTubeId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
  };

  return (
    <Card className="bg-black/40 backdrop-blur-xl border border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add New Lesson
        </CardTitle>
      </CardHeader>

      <CardContent>
        {permissionError && (
          <Alert className="mb-4 border-orange-500/50 bg-orange-500/10">
            <AlertCircle className="h-4 w-4 text-orange-500" />
            <AlertDescription className="text-orange-200">
              {permissionError}
              {userType === 'student' && (
                <div className="mt-2">
                  <Button
                    onClick={upgradeToCompanyUser}
                    size="sm"
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Upgrade to Company User
                  </Button>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lesson-title" className="text-white">Lesson Title *</Label>
            <Input
              id="lesson-title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Enter lesson title..."
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="video-url" className="text-white flex items-center gap-2">
              <Youtube className="w-4 h-4" />
              YouTube Video URL
            </Label>
            <Input
              id="video-url"
              value={formData.videoUrl}
              onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
              placeholder="https://www.youtube.com/watch?v=..."
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
            {formData.videoUrl && !validateYouTubeUrl(formData.videoUrl) && (
              <p className="text-red-400 text-sm">Please enter a valid YouTube URL</p>
            )}
            {formData.videoUrl && validateYouTubeUrl(formData.videoUrl) && (
              <div className="mt-2">
                <img 
                  src={getYouTubeThumbnail(formData.videoUrl) || ''} 
                  alt="Video thumbnail"
                  className="w-32 h-18 object-cover rounded border border-white/20"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lesson-content" className="text-white">Lesson Description</Label>
            <Textarea
              id="lesson-content"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              placeholder="Enter lesson description or additional content..."
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-white">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.durationMinutes}
                onChange={(e) => setFormData({...formData, durationMinutes: parseInt(e.target.value) || 0})}
                placeholder="0"
                min="0"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>

            {/* Temporarily hidden until is_preview column is added to database
            <div className="space-y-2">
              <Label className="text-white">Preview Lesson</Label>
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  checked={formData.isPreview}
                  onCheckedChange={(checked) => setFormData({...formData, isPreview: checked})}
                />
                <span className="text-white/70 text-sm">
                  Allow non-enrolled users to watch
                </span>
              </div>
            </div>
            */}
          </div>
          
          <Button
            type="submit"
            disabled={loading || !formData.title.trim()}
            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
          >
            <Play className="w-4 h-4 mr-2" />
            {loading ? "Creating..." : "Create Lesson"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
