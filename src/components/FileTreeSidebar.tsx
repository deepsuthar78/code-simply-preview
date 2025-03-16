
import React, { useState, useEffect } from 'react';
import { 
  Folder, 
  FolderOpen, 
  File, 
  FileText, 
  ChevronRight, 
  ChevronDown,
  FileCode,
  Bot
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCodeState } from '@/hooks/useCodeState';

type FileType = 'file' | 'folder';

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  children?: FileItem[];
  extension?: string;
}

interface FileTreeProps {
  data: FileItem[];
  onFileSelect?: (file: FileItem) => void;
  selectedFileId?: string;
  className?: string;
  hasGeneratedFiles: boolean;
}

// Helper to get the appropriate icon based on file extension
const getFileIcon = (extension?: string) => {
  switch(extension) {
    case 'tsx':
    case 'ts':
    case 'jsx':
    case 'js':
      return <FileCode size={16} className="text-blue-400" />;
    case 'css':
    case 'scss':
      return <FileText size={16} className="text-pink-400" />;
    case 'json':
      return <FileText size={16} className="text-yellow-400" />;
    case 'md':
      return <FileText size={16} className="text-gray-400" />;
    default:
      return <File size={16} className="text-white" />;
  }
};

// File tree item component - renders an individual file or folder
const FileTreeItem: React.FC<{
  item: FileItem;
  level: number;
  onFileSelect?: (file: FileItem) => void;
  selectedFileId?: string;
}> = ({ item, level, onFileSelect, selectedFileId }) => {
  const [isOpen, setIsOpen] = useState(level < 1); // Auto-open first level
  const hasChildren = item.children && item.children.length > 0;
  const isFolder = item.type === 'folder';
  const extension = item.name.split('.').pop();
  
  const toggleFolder = () => {
    if (isFolder) {
      setIsOpen(!isOpen);
    }
  };

  const handleItemClick = () => {
    if (isFolder) {
      toggleFolder();
    } else if (onFileSelect) {
      onFileSelect(item);
    }
  };

  return (
    <div>
      <div 
        className={cn(
          "flex items-center py-1 px-2 rounded-md cursor-pointer hover:bg-black/20 text-sm",
          selectedFileId === item.id ? "bg-black/30 text-white" : "text-white/70",
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleItemClick}
      >
        {isFolder ? (
          <span className="flex items-center">
            {isOpen ? (
              <ChevronDown size={16} className="mr-1 text-white/50" />
            ) : (
              <ChevronRight size={16} className="mr-1 text-white/50" />
            )}
            {isOpen ? (
              <FolderOpen size={16} className="mr-2 text-yellow-400" />
            ) : (
              <Folder size={16} className="mr-2 text-yellow-400" />
            )}
          </span>
        ) : (
          <span className="flex items-center ml-4">
            {getFileIcon(extension)}
            <span className="ml-2">{item.name}</span>
          </span>
        )}
        {isFolder && <span className="ml-2">{item.name}</span>}
      </div>
      
      {isFolder && isOpen && item.children && (
        <div className="ml-2">
          {item.children.map((child) => (
            <FileTreeItem
              key={child.id}
              item={child}
              level={level + 1}
              onFileSelect={onFileSelect}
              selectedFileId={selectedFileId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Empty state component when no files are generated
const EmptyFileTree: React.FC = () => (
  <div className="py-6 px-4 text-center text-sm text-white/60">
    <div className="flex flex-col items-center justify-center gap-3">
      <Bot size={24} className="text-white/40" />
      <p>AI generated files will automatically appear here</p>
    </div>
  </div>
);

// Main file tree component
export const FileTree: React.FC<FileTreeProps> = ({
  data,
  onFileSelect,
  selectedFileId,
  className,
  hasGeneratedFiles
}) => {
  if (!hasGeneratedFiles) {
    return <EmptyFileTree />;
  }
  
  return (
    <div className={cn("text-sm text-white/80", className)}>
      {data.map((item) => (
        <FileTreeItem
          key={item.id}
          item={item}
          level={0}
          onFileSelect={onFileSelect}
          selectedFileId={selectedFileId}
        />
      ))}
    </div>
  );
};

// The sidebar component that uses the file tree
const FileTreeSidebar: React.FC<{
  onFileSelect?: (file: FileItem) => void;
  selectedFileId?: string;
  className?: string;
}> = ({ onFileSelect, selectedFileId, className }) => {
  const { getAllFiles } = useCodeState();
  const [fileTreeData, setFileTreeData] = useState<FileItem[]>([]);
  const [hasGeneratedFiles, setHasGeneratedFiles] = useState(false);
  
  // Convert flat file list to tree structure
  useEffect(() => {
    const currentFiles = getAllFiles();
    console.log("Current files in state:", currentFiles.length, currentFiles.map(f => f.name));
    
    // Check if we have user-generated files
    setHasGeneratedFiles(currentFiles.length > 0);
    console.log("Has generated files:", currentFiles.length > 0);
    
    if (currentFiles.length === 0) {
      setFileTreeData([]);
      return;
    }
    
    // Create the root folder (will contain all files)
    const srcFolder: FileItem = {
      id: 'src-folder',
      name: 'src',
      type: 'folder',
      children: []
    };
    
    // Add all files directly to src folder (simplified approach)
    currentFiles.forEach(file => {
      // Create a file item for each file
      const fileName = file.name.includes('/') ? file.name.split('/').pop()! : file.name;
      
      const fileItem: FileItem = {
        id: file.id,
        name: fileName,
        type: 'file',
        extension: fileName.split('.').pop()
      };
      
      // Add to src folder
      srcFolder.children?.push(fileItem);
    });
    
    // Only add folder if it has children
    if (srcFolder.children && srcFolder.children.length > 0) {
      setFileTreeData([srcFolder]);
    } else {
      setFileTreeData([]);
    }
    
  }, [getAllFiles]);

  const handleFileSelectWrapper = (file: FileItem) => {
    console.log("Selected file:", file.name, "with ID:", file.id);
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  return (
    <div className={cn("h-full bg-black/20 glass-morphism border-r border-white/10", className)}>
      <div className="p-3 border-b border-white/10 bg-black/10">
        <h3 className="text-sm font-medium text-white">Explorer</h3>
      </div>
      <ScrollArea className="h-[calc(100%-40px)]">
        <div className="p-2">
          <FileTree 
            data={fileTreeData} 
            onFileSelect={handleFileSelectWrapper}
            selectedFileId={selectedFileId}
            hasGeneratedFiles={hasGeneratedFiles}
          />
        </div>
      </ScrollArea>
    </div>
  );
};

export default FileTreeSidebar;
