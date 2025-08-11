import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  FileText, 
  Download, 
  Search, 
  Upload, 
  Image,
  FileVideo,
  FileAudio,
  Archive,
  Eye,
  MoreHorizontal,
  Filter
} from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'document' | 'image' | 'video' | 'audio' | 'archive';
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  category: string;
  url?: string;
}

export const FilesTab = () => {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const mockFiles: FileItem[] = [
    {
      id: '1',
      name: 'Project Requirements.pdf',
      type: 'document',
      size: '2.4 MB',
      uploadedBy: 'John Doe',
      uploadedAt: '2024-12-10',
      category: 'documentation'
    },
    {
      id: '2',
      name: 'Timeline Mockup.png',
      type: 'image',
      size: '1.8 MB',
      uploadedBy: 'Jane Smith',
      uploadedAt: '2024-12-09',
      category: 'design'
    },
    {
      id: '3',
      name: 'Demo Video.mp4',
      type: 'video',
      size: '45.2 MB',
      uploadedBy: 'Mike Johnson',
      uploadedAt: '2024-12-08',
      category: 'media'
    },
    {
      id: '4',
      name: 'Meeting Recording.mp3',
      type: 'audio',
      size: '12.5 MB',
      uploadedBy: 'Sarah Wilson',
      uploadedAt: '2024-12-07',
      category: 'meetings'
    },
    {
      id: '5',
      name: 'Source Code.zip',
      type: 'archive',
      size: '8.7 MB',
      uploadedBy: 'Alex Brown',
      uploadedAt: '2024-12-06',
      category: 'development'
    }
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="h-5 w-5 text-blue-600" />;
      case 'image': return <Image className="h-5 w-5 text-green-600" />;
      case 'video': return <FileVideo className="h-5 w-5 text-purple-600" />;
      case 'audio': return <FileAudio className="h-5 w-5 text-orange-600" />;
      case 'archive': return <Archive className="h-5 w-5 text-gray-600" />;
      default: return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const categories = [
    { id: 'all', label: 'All Files', count: mockFiles.length },
    { id: 'documentation', label: 'Documentation', count: mockFiles.filter(f => f.category === 'documentation').length },
    { id: 'design', label: 'Design', count: mockFiles.filter(f => f.category === 'design').length },
    { id: 'media', label: 'Media', count: mockFiles.filter(f => f.category === 'media').length },
    { id: 'meetings', label: 'Meetings', count: mockFiles.filter(f => f.category === 'meetings').length },
    { id: 'development', label: 'Development', count: mockFiles.filter(f => f.category === 'development').length }
  ];

  const filteredFiles = mockFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalSize = mockFiles.reduce((acc, file) => {
    const sizeInMB = parseFloat(file.size.replace(' MB', ''));
    return acc + sizeInMB;
  }, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="text-lg font-semibold">Files ({mockFiles.length})</h3>
        <Button size="sm" className="touch-manipulation">
          <Upload className="h-4 w-4 mr-2" />
          Upload File
        </Button>
      </div>

      {/* File Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Total Files</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold">{mockFiles.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <Archive className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium">Total Size</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold">{totalSize.toFixed(1)} MB</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <Image className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Images</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold">
              {mockFiles.filter(f => f.type === 'image').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <FileVideo className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Videos</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold">
              {mockFiles.filter(f => f.type === 'video').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 touch-manipulation"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="whitespace-nowrap touch-manipulation"
            >
              {category.label}
              <Badge variant="secondary" className="ml-2 text-xs">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {filteredFiles.map((file) => (
          <Card key={file.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {getFileIcon(file.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-sm truncate">{file.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span>{file.size}</span>
                        <span>•</span>
                        <Badge variant="outline" className="text-xs capitalize">
                          {file.category}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 touch-manipulation">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-xs text-muted-foreground">
                      <span>By {file.uploadedBy}</span>
                      <span> • {file.uploadedAt}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-8 px-2 touch-manipulation">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 px-2 touch-manipulation">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFiles.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No files found matching your criteria</p>
            <Button variant="outline" className="mt-4 touch-manipulation">
              <Upload className="h-4 w-4 mr-2" />
              Upload your first file
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};