import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  FileText, 
  Video, 
  Image, 
  Music, 
  Download, 
  Eye, 
  Upload,
  Play,
  Pause,
  Volume2
} from 'lucide-react';

interface FileAttachmentsProps {
  attachments?: string[];
  recordings?: string[];
  onUpload?: (files: FileList) => void;
}

export const FileAttachments = ({ attachments = [], recordings = [], onUpload }: FileAttachmentsProps) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<{ [key: string]: boolean }>({});

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'mp4':
      case 'mov':
      case 'avi':
        return Video;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return Image;
      case 'mp3':
      case 'wav':
      case 'ogg':
        return Music;
      default:
        return FileText;
    }
  };

  const getFileType = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['mp4', 'mov', 'avi'].includes(ext || '')) return 'video';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) return 'image';
    if (['mp3', 'wav', 'ogg'].includes(ext || '')) return 'audio';
    return 'document';
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && onUpload) {
      onUpload(files);
    }
  };

  const togglePlayback = (filename: string) => {
    setIsPlaying(prev => ({
      ...prev,
      [filename]: !prev[filename]
    }));
  };

  const allFiles = [...attachments, ...recordings];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Files & Recordings ({allFiles.length})
          </CardTitle>
          {onUpload && (
            <div>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                accept="*/*"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {allFiles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No files attached yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {allFiles.map((file, index) => {
                const Icon = getFileIcon(file);
                const fileType = getFileType(file);
                const isRecording = recordings.includes(file);
                
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium truncate">{file}</p>
                        {isRecording && (
                          <Badge variant="secondary" className="text-xs">
                            Recording
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedFile(file)}
                          className="h-6 px-2 text-xs"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        
                        {(fileType === 'video' || fileType === 'audio') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePlayback(file)}
                            className="h-6 px-2 text-xs"
                          >
                            {isPlaying[file] ? (
                              <Pause className="h-3 w-3 mr-1" />
                            ) : (
                              <Play className="h-3 w-3 mr-1" />
                            )}
                            {isPlaying[file] ? 'Pause' : 'Play'}
                          </Button>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* File Preview Modal */}
      <Dialog open={!!selectedFile} onOpenChange={() => setSelectedFile(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {selectedFile}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex items-center justify-center p-8 bg-muted/20 rounded-lg">
            {selectedFile && getFileType(selectedFile) === 'video' && (
              <div className="space-y-4">
                <div className="w-full max-w-2xl aspect-video bg-black rounded-lg flex items-center justify-center">
                  <div className="text-center text-white">
                    <Video className="h-16 w-16 mx-auto mb-4" />
                    <p className="text-lg">Video Player</p>
                    <p className="text-sm opacity-75">({selectedFile})</p>
                  </div>
                </div>
                <div className="flex justify-center gap-2">
                  <Button variant="outline" onClick={() => togglePlayback(selectedFile)}>
                    {isPlaying[selectedFile] ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline">
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            
            {selectedFile && getFileType(selectedFile) === 'image' && (
              <div className="text-center">
                <Image className="h-32 w-32 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium">{selectedFile}</p>
                <p className="text-sm text-muted-foreground">Image preview would appear here</p>
              </div>
            )}
            
            {selectedFile && getFileType(selectedFile) === 'document' && (
              <div className="text-center">
                <FileText className="h-32 w-32 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium">{selectedFile}</p>
                <p className="text-sm text-muted-foreground">Document preview would appear here</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};