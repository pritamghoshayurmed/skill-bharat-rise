import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, Maximize, ExternalLink } from 'lucide-react';

interface YouTubePlayerProps {
  videoUrl: string;
  title?: string;
  autoplay?: boolean;
  showControls?: boolean;
  className?: string;
}

export const YouTubePlayer = ({ 
  videoUrl, 
  title, 
  autoplay = false, 
  showControls = true,
  className = ""
}: YouTubePlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const extractVideoId = (url: string): string | null => {
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

  const videoId = extractVideoId(videoUrl);

  console.log('YouTubePlayer - Video URL:', videoUrl, 'Extracted ID:', videoId);

  if (!videoId) {
    return (
      <Card className="bg-red-500/10 border-red-500/20">
        <CardContent className="p-4">
          <p className="text-red-400">Invalid YouTube URL: {videoUrl}</p>
          <p className="text-red-300 text-sm mt-2">Please check the URL format</p>
        </CardContent>
      </Card>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?${new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    controls: showControls ? '1' : '0',
    modestbranding: '1',
    rel: '0',
    showinfo: '0'
  }).toString()}`;

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

  return (
    <Card className={`bg-black/40 backdrop-blur-xl border border-white/10 overflow-hidden ${className}`}>
      <CardContent className="p-0">
        {title && (
          <div className="p-4 border-b border-white/10">
            <h3 className="text-white font-medium">{title}</h3>
          </div>
        )}
        
        <div className="relative aspect-video bg-black">
          {!isPlaying ? (
            // Thumbnail with play button
            <div className="relative w-full h-full group cursor-pointer" onClick={() => setIsPlaying(true)}>
              <img 
                src={thumbnailUrl}
                alt={title || 'Video thumbnail'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to standard quality thumbnail
                  e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                }}
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
                </div>
              </div>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-black/50 hover:bg-black/70 text-white border-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(watchUrl, '_blank');
                  }}
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Watch on YouTube
                </Button>
              </div>
            </div>
          ) : (
            // Embedded YouTube player
            <div className="w-full h-full">
              <div className="text-xs text-white/50 mb-2">Loading: {embedUrl}</div>
              <iframe
                src={embedUrl}
                title={title || 'YouTube video player'}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={() => console.log('YouTube iframe loaded successfully')}
                onError={(e) => console.error('YouTube iframe error:', e)}
              />
            </div>
          )}
        </div>

        {showControls && (
          <div className="p-4 bg-black/20 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/10"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/10"
                  onClick={() => window.open(watchUrl, '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Utility function to validate YouTube URLs
export const isValidYouTubeUrl = (url: string): boolean => {
  const patterns = [
    /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[a-zA-Z0-9_-]+/,
    /^https?:\/\/(www\.)?youtube\.com\/watch\?.*v=[a-zA-Z0-9_-]+/
  ];
  
  return patterns.some(pattern => pattern.test(url));
};

// Utility function to get video ID from URL
export const getYouTubeVideoId = (url: string): string | null => {
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

// Utility function to get thumbnail URL
export const getYouTubeThumbnail = (videoId: string, quality: 'default' | 'hq' | 'max' = 'max'): string => {
  const qualityMap = {
    default: 'default',
    hq: 'hqdefault', 
    max: 'maxresdefault'
  };
  
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
};
