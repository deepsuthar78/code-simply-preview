
import React, { useState } from 'react';
import { 
  Folder, 
  FolderOpen, 
  File, 
  FileText, 
  ChevronRight, 
  ChevronDown 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

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
}

// Helper to get the appropriate icon based on file extension
const getFileIcon = (extension?: string) => {
  switch(extension) {
    case 'tsx':
    case 'ts':
    case 'jsx':
    case 'js':
      return <FileText size={16} className="text-blue-400" />;
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
  const [isOpen, setIsOpen] = useState(false);
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
          `pl-${level + 2}`
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

// Main file tree component
export const FileTree: React.FC<FileTreeProps> = ({
  data,
  onFileSelect,
  selectedFileId,
  className
}) => {
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
  // Demo file structure data
  const fileTreeData: FileItem[] = [
    {
      id: 'src',
      name: 'src',
      type: 'folder',
      children: [
        {
          id: 'components',
          name: 'components',
          type: 'folder',
          children: [
            { id: 'app-tsx', name: 'App.tsx', type: 'file' },
            { id: 'button-tsx', name: 'Button.tsx', type: 'file' },
            { id: 'editor-tsx', name: 'Editor.tsx', type: 'file' },
            { id: 'navbar-tsx', name: 'Navbar.tsx', type: 'file' },
            {
              id: 'ui',
              name: 'ui',
              type: 'folder',
              children: [
                { id: 'button-ui-tsx', name: 'button.tsx', type: 'file' },
                { id: 'card-tsx', name: 'card.tsx', type: 'file' },
                { id: 'dialog-tsx', name: 'dialog.tsx', type: 'file' },
              ]
            }
          ]
        },
        {
          id: 'pages',
          name: 'pages',
          type: 'folder',
          children: [
            { id: 'index-tsx', name: 'Index.tsx', type: 'file' },
            { id: 'not-found-tsx', name: 'NotFound.tsx', type: 'file' },
          ]
        },
        {
          id: 'hooks',
          name: 'hooks',
          type: 'folder',
          children: [
            { id: 'use-code-state-tsx', name: 'useCodeState.tsx', type: 'file' },
            { id: 'use-mobile-tsx', name: 'use-mobile.tsx', type: 'file' },
          ]
        },
        { id: 'main-tsx', name: 'main.tsx', type: 'file' },
        { id: 'index-css', name: 'index.css', type: 'file' },
      ]
    },
    {
      id: 'public',
      name: 'public',
      type: 'folder',
      children: [
        { id: 'favicon-ico', name: 'favicon.ico', type: 'file' },
        { id: 'og-image-png', name: 'og-image.png', type: 'file' },
      ]
    },
    { id: 'package-json', name: 'package.json', type: 'file' },
    { id: 'tsconfig-json', name: 'tsconfig.json', type: 'file' },
    { id: 'vite-config-ts', name: 'vite.config.ts', type: 'file' },
  ];

  return (
    <div className={cn("h-full bg-black/20 glass-morphism border-r border-white/10", className)}>
      <div className="p-3 border-b border-white/10 bg-black/10">
        <h3 className="text-sm font-medium text-white">Explorer</h3>
      </div>
      <ScrollArea className="h-[calc(100%-40px)]">
        <div className="p-2">
          <FileTree 
            data={fileTreeData} 
            onFileSelect={onFileSelect}
            selectedFileId={selectedFileId}
          />
        </div>
      </ScrollArea>
    </div>
  );
};

export default FileTreeSidebar;
