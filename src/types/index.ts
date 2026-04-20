export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  quotaBytes: number;
  usedBytes: number;
  createdAt: string;
}

export interface FileVersion {
  id: string;
  fileId: string;
  versionNumber: number;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
  comment: string;
}

export interface FileMetadata {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  folderId: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  versions: FileVersion[];
  currentVersion: number;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
  createdBy: string;
  children?: Folder[];
}

export interface AuditEntry {
  id: string;
  userId: string;
  username: string;
  action: 'UPLOAD' | 'DELETE' | 'RENAME' | 'MOVE' | 'TAG_ADD' | 'TAG_REMOVE' | 'VERSION_CREATE' | 'FOLDER_CREATE' | 'FOLDER_DELETE' | 'DOWNLOAD' | 'LOGIN';
  targetType: 'FILE' | 'FOLDER' | 'USER';
  targetId: string;
  targetName: string;
  details: string;
  timestamp: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  fileCount: number;
}

