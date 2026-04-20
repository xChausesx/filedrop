import { User, FileMetadata, Folder, AuditEntry, Tag } from '../types';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    username: 'admin',
    email: 'admin@company.com',
    role: 'admin',
    quotaBytes: 10737418240, // 10 GB
    usedBytes: 3221225472, // 3 GB
    createdAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'user-2',
    username: 'john.doe',
    email: 'john@company.com',
    role: 'user',
    quotaBytes: 5368709120, // 5 GB
    usedBytes: 1073741824, // 1 GB
    createdAt: '2025-03-01T09:00:00Z',
  },
  {
    id: 'user-3',
    username: 'jane.smith',
    email: 'jane@company.com',
    role: 'user',
    quotaBytes: 5368709120,
    usedBytes: 2147483648, // 2 GB
    createdAt: '2025-04-10T14:30:00Z',
  },
];

export const mockFolders: Folder[] = [
  { id: 'folder-1', name: 'Documents', parentId: null, createdAt: '2025-01-20T10:00:00Z', createdBy: 'user-1' },
  { id: 'folder-2', name: 'Images', parentId: null, createdAt: '2025-02-05T11:00:00Z', createdBy: 'user-1' },
  { id: 'folder-3', name: 'Projects', parentId: null, createdAt: '2025-02-10T09:00:00Z', createdBy: 'user-2' },
  { id: 'folder-4', name: 'Reports', parentId: 'folder-1', createdAt: '2025-03-01T08:00:00Z', createdBy: 'user-1' },
  { id: 'folder-5', name: 'Invoices', parentId: 'folder-1', createdAt: '2025-03-15T12:00:00Z', createdBy: 'user-2' },
  { id: 'folder-6', name: 'Logos', parentId: 'folder-2', createdAt: '2025-04-01T10:00:00Z', createdBy: 'user-3' },
  { id: 'folder-7', name: 'Frontend', parentId: 'folder-3', createdAt: '2025-04-05T15:00:00Z', createdBy: 'user-2' },
  { id: 'folder-8', name: 'Backend', parentId: 'folder-3', createdAt: '2025-04-05T15:30:00Z', createdBy: 'user-2' },
  { id: 'folder-9', name: 'Archive', parentId: null, createdAt: '2025-05-01T08:00:00Z', createdBy: 'user-1' },
];

export const mockFiles: FileMetadata[] = [
  {
    id: 'file-1',
    name: 'annual-report-2025.pdf',
    size: 2457600,
    mimeType: 'application/pdf',
    folderId: 'folder-4',
    tags: ['report', 'finance', '2025'],
    createdAt: '2025-06-01T10:00:00Z',
    updatedAt: '2025-06-15T14:00:00Z',
    createdBy: 'user-1',
    currentVersion: 3,
    versions: [
      { id: 'v1-1', fileId: 'file-1', versionNumber: 1, size: 2200000, uploadedAt: '2025-06-01T10:00:00Z', uploadedBy: 'user-1', comment: 'Initial draft' },
      { id: 'v1-2', fileId: 'file-1', versionNumber: 2, size: 2350000, uploadedAt: '2025-06-10T09:00:00Z', uploadedBy: 'user-2', comment: 'Added Q2 data' },
      { id: 'v1-3', fileId: 'file-1', versionNumber: 3, size: 2457600, uploadedAt: '2025-06-15T14:00:00Z', uploadedBy: 'user-1', comment: 'Final version' },
    ],
  },
  {
    id: 'file-2',
    name: 'logo-dark.png',
    size: 153600,
    mimeType: 'image/png',
    folderId: 'folder-6',
    tags: ['branding', 'logo'],
    createdAt: '2025-04-02T11:00:00Z',
    updatedAt: '2025-04-02T11:00:00Z',
    createdBy: 'user-3',
    currentVersion: 1,
    versions: [
      { id: 'v2-1', fileId: 'file-2', versionNumber: 1, size: 153600, uploadedAt: '2025-04-02T11:00:00Z', uploadedBy: 'user-3', comment: 'Initial upload' },
    ],
  },
  {
    id: 'file-3',
    name: 'invoice-march-2025.pdf',
    size: 512000,
    mimeType: 'application/pdf',
    folderId: 'folder-5',
    tags: ['invoice', 'finance', 'march'],
    createdAt: '2025-03-20T16:00:00Z',
    updatedAt: '2025-03-22T10:00:00Z',
    createdBy: 'user-2',
    currentVersion: 2,
    versions: [
      { id: 'v3-1', fileId: 'file-3', versionNumber: 1, size: 500000, uploadedAt: '2025-03-20T16:00:00Z', uploadedBy: 'user-2', comment: 'Draft' },
      { id: 'v3-2', fileId: 'file-3', versionNumber: 2, size: 512000, uploadedAt: '2025-03-22T10:00:00Z', uploadedBy: 'user-2', comment: 'Corrected totals' },
    ],
  },
  {
    id: 'file-4',
    name: 'architecture-diagram.svg',
    size: 89000,
    mimeType: 'image/svg+xml',
    folderId: 'folder-8',
    tags: ['architecture', 'diagram'],
    createdAt: '2025-04-10T09:00:00Z',
    updatedAt: '2025-04-10T09:00:00Z',
    createdBy: 'user-2',
    currentVersion: 1,
    versions: [
      { id: 'v4-1', fileId: 'file-4', versionNumber: 1, size: 89000, uploadedAt: '2025-04-10T09:00:00Z', uploadedBy: 'user-2', comment: 'System architecture v1' },
    ],
  },
  {
    id: 'file-5',
    name: 'meeting-notes.docx',
    size: 45000,
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    folderId: 'folder-1',
    tags: ['meeting', 'notes'],
    createdAt: '2025-05-12T13:00:00Z',
    updatedAt: '2025-05-12T13:00:00Z',
    createdBy: 'user-3',
    currentVersion: 1,
    versions: [
      { id: 'v5-1', fileId: 'file-5', versionNumber: 1, size: 45000, uploadedAt: '2025-05-12T13:00:00Z', uploadedBy: 'user-3', comment: 'Weekly standup notes' },
    ],
  },
  {
    id: 'file-6',
    name: 'app-bundle.js',
    size: 3145728,
    mimeType: 'application/javascript',
    folderId: 'folder-7',
    tags: ['build', 'frontend', 'production'],
    createdAt: '2025-05-20T17:00:00Z',
    updatedAt: '2025-06-01T09:00:00Z',
    createdBy: 'user-2',
    currentVersion: 4,
    versions: [
      { id: 'v6-1', fileId: 'file-6', versionNumber: 1, size: 2800000, uploadedAt: '2025-05-20T17:00:00Z', uploadedBy: 'user-2', comment: 'v1.0.0' },
      { id: 'v6-2', fileId: 'file-6', versionNumber: 2, size: 2900000, uploadedAt: '2025-05-25T10:00:00Z', uploadedBy: 'user-2', comment: 'v1.1.0 hotfix' },
      { id: 'v6-3', fileId: 'file-6', versionNumber: 3, size: 3000000, uploadedAt: '2025-05-28T14:00:00Z', uploadedBy: 'user-2', comment: 'v1.2.0' },
      { id: 'v6-4', fileId: 'file-6', versionNumber: 4, size: 3145728, uploadedAt: '2025-06-01T09:00:00Z', uploadedBy: 'user-2', comment: 'v2.0.0 major refactor' },
    ],
  },
];

export const mockTags: Tag[] = [
  { id: 'tag-1', name: 'report', color: '#e74c3c', fileCount: 1 },
  { id: 'tag-2', name: 'finance', color: '#2ecc71', fileCount: 2 },
  { id: 'tag-3', name: '2025', color: '#3498db', fileCount: 1 },
  { id: 'tag-4', name: 'branding', color: '#9b59b6', fileCount: 1 },
  { id: 'tag-5', name: 'logo', color: '#f39c12', fileCount: 1 },
  { id: 'tag-6', name: 'invoice', color: '#1abc9c', fileCount: 1 },
  { id: 'tag-7', name: 'march', color: '#e67e22', fileCount: 1 },
  { id: 'tag-8', name: 'architecture', color: '#34495e', fileCount: 1 },
  { id: 'tag-9', name: 'diagram', color: '#7f8c8d', fileCount: 1 },
  { id: 'tag-10', name: 'meeting', color: '#c0392b', fileCount: 1 },
  { id: 'tag-11', name: 'notes', color: '#27ae60', fileCount: 1 },
  { id: 'tag-12', name: 'build', color: '#2980b9', fileCount: 1 },
  { id: 'tag-13', name: 'frontend', color: '#8e44ad', fileCount: 1 },
  { id: 'tag-14', name: 'production', color: '#d35400', fileCount: 1 },
];

export const mockAuditLog: AuditEntry[] = [
  { id: 'audit-1', userId: 'user-1', username: 'admin', action: 'LOGIN', targetType: 'USER', targetId: 'user-1', targetName: 'admin', details: 'Logged in from 192.168.1.10', timestamp: '2026-04-20T08:00:00Z' },
  { id: 'audit-2', userId: 'user-1', username: 'admin', action: 'FOLDER_CREATE', targetType: 'FOLDER', targetId: 'folder-1', targetName: 'Documents', details: 'Created root folder', timestamp: '2025-01-20T10:00:00Z' },
  { id: 'audit-3', userId: 'user-1', username: 'admin', action: 'UPLOAD', targetType: 'FILE', targetId: 'file-1', targetName: 'annual-report-2025.pdf', details: 'Uploaded version 1', timestamp: '2025-06-01T10:00:00Z' },
  { id: 'audit-4', userId: 'user-2', username: 'john.doe', action: 'VERSION_CREATE', targetType: 'FILE', targetId: 'file-1', targetName: 'annual-report-2025.pdf', details: 'Created version 2 - Added Q2 data', timestamp: '2025-06-10T09:00:00Z' },
  { id: 'audit-5', userId: 'user-2', username: 'john.doe', action: 'TAG_ADD', targetType: 'FILE', targetId: 'file-3', targetName: 'invoice-march-2025.pdf', details: 'Added tag: finance', timestamp: '2025-03-21T11:00:00Z' },
  { id: 'audit-6', userId: 'user-3', username: 'jane.smith', action: 'UPLOAD', targetType: 'FILE', targetId: 'file-2', targetName: 'logo-dark.png', details: 'Initial upload', timestamp: '2025-04-02T11:00:00Z' },
  { id: 'audit-7', userId: 'user-2', username: 'john.doe', action: 'MOVE', targetType: 'FILE', targetId: 'file-4', targetName: 'architecture-diagram.svg', details: 'Moved from Projects to Backend', timestamp: '2025-04-12T16:00:00Z' },
  { id: 'audit-8', userId: 'user-1', username: 'admin', action: 'DELETE', targetType: 'FILE', targetId: 'file-old', targetName: 'old-report.pdf', details: 'Removed outdated file', timestamp: '2025-05-05T09:00:00Z' },
  { id: 'audit-9', userId: 'user-3', username: 'jane.smith', action: 'DOWNLOAD', targetType: 'FILE', targetId: 'file-1', targetName: 'annual-report-2025.pdf', details: 'Downloaded version 3', timestamp: '2025-06-16T10:00:00Z' },
  { id: 'audit-10', userId: 'user-2', username: 'john.doe', action: 'RENAME', targetType: 'FILE', targetId: 'file-6', targetName: 'app-bundle.js', details: 'Renamed from bundle.min.js', timestamp: '2025-05-22T11:00:00Z' },
];

