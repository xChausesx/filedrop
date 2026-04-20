/**
 * API Service - abstraction layer for backend integration.
 * Currently uses mock data. Replace implementations with real HTTP calls
 * when Java backend is ready.
 *
 * TODO: Replace mock implementations with axios calls to Java backend
 * Base URL will be configured via environment variable: REACT_APP_API_BASE_URL
 */

import { FileMetadata, Folder, AuditEntry, Tag, User, FileVersion } from '../types';
import { mockFiles, mockFolders, mockAuditLog, mockTags, mockUsers } from '../data/mockData';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

// Simulate network delay
const delay = (ms: number = 300) => new Promise(res => setTimeout(res, ms));

// --- In-memory state (mock) ---
let files = [...mockFiles];
let folders = [...mockFolders];
let auditLog = [...mockAuditLog];
let tags = [...mockTags];
let users = [...mockUsers];
let nextId = 100;
const genId = (prefix: string) => `${prefix}-${nextId++}`;

function addAudit(userId: string, action: AuditEntry['action'], targetType: AuditEntry['targetType'], targetId: string, targetName: string, details: string) {
  const user = users.find(u => u.id === userId) || users[0];
  auditLog.unshift({
    id: genId('audit'),
    userId,
    username: user.username,
    action,
    targetType,
    targetId,
    targetName,
    details,
    timestamp: new Date().toISOString(),
  });
}

// ==================== FILES ====================

export async function getFiles(folderId?: string | null): Promise<FileMetadata[]> {
  await delay();
  // TODO: return (await axios.get(`${API_BASE_URL}/files`, { params: { folderId } })).data;
  if (folderId === undefined) return [...files];
  return files.filter(f => f.folderId === folderId);
}

export async function getFileById(id: string): Promise<FileMetadata | undefined> {
  await delay();
  // TODO: return (await axios.get(`${API_BASE_URL}/files/${id}`)).data;
  return files.find(f => f.id === id);
}

export async function uploadFile(name: string, size: number, mimeType: string, folderId: string | null, tagsList: string[], userId: string): Promise<FileMetadata> {
  await delay();
  // TODO: const formData = new FormData(); ... return (await axios.post(`${API_BASE_URL}/files`, formData)).data;
  const id = genId('file');
  const now = new Date().toISOString();
  const file: FileMetadata = {
    id, name, size, mimeType, folderId,
    tags: tagsList,
    createdAt: now, updatedAt: now, createdBy: userId,
    currentVersion: 1,
    versions: [{ id: genId('v'), fileId: id, versionNumber: 1, size, uploadedAt: now, uploadedBy: userId, comment: 'Initial upload' }],
  };
  files.unshift(file);
  addAudit(userId, 'UPLOAD', 'FILE', id, name, `Uploaded ${name}`);
  return file;
}

export async function deleteFile(id: string, userId: string): Promise<void> {
  await delay();
  // TODO: await axios.delete(`${API_BASE_URL}/files/${id}`);
  const file = files.find(f => f.id === id);
  files = files.filter(f => f.id !== id);
  if (file) addAudit(userId, 'DELETE', 'FILE', id, file.name, `Deleted ${file.name}`);
}

export async function renameFile(id: string, newName: string, userId: string): Promise<FileMetadata | undefined> {
  await delay();
  // TODO: return (await axios.put(`${API_BASE_URL}/files/${id}/rename`, { name: newName })).data;
  const file = files.find(f => f.id === id);
  if (file) {
    const oldName = file.name;
    file.name = newName;
    file.updatedAt = new Date().toISOString();
    addAudit(userId, 'RENAME', 'FILE', id, newName, `Renamed from ${oldName} to ${newName}`);
  }
  return file;
}

export async function moveFile(id: string, newFolderId: string | null, userId: string): Promise<FileMetadata | undefined> {
  await delay();
  // TODO: return (await axios.put(`${API_BASE_URL}/files/${id}/move`, { folderId: newFolderId })).data;
  const file = files.find(f => f.id === id);
  if (file) {
    file.folderId = newFolderId;
    file.updatedAt = new Date().toISOString();
    const folderName = newFolderId ? folders.find(f => f.id === newFolderId)?.name || 'Unknown' : 'Root';
    addAudit(userId, 'MOVE', 'FILE', id, file.name, `Moved to ${folderName}`);
  }
  return file;
}

export async function addTagToFile(fileId: string, tag: string, userId: string): Promise<FileMetadata | undefined> {
  await delay();
  // TODO: return (await axios.post(`${API_BASE_URL}/files/${fileId}/tags`, { tag })).data;
  const file = files.find(f => f.id === fileId);
  if (file && !file.tags.includes(tag)) {
    file.tags.push(tag);
    file.updatedAt = new Date().toISOString();
    addAudit(userId, 'TAG_ADD', 'FILE', fileId, file.name, `Added tag: ${tag}`);
    // Update tag counts
    const existing = tags.find(t => t.name === tag);
    if (existing) { existing.fileCount++; }
    else { tags.push({ id: genId('tag'), name: tag, color: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'), fileCount: 1 }); }
  }
  return file;
}

export async function removeTagFromFile(fileId: string, tag: string, userId: string): Promise<FileMetadata | undefined> {
  await delay();
  // TODO: return (await axios.delete(`${API_BASE_URL}/files/${fileId}/tags/${tag}`)).data;
  const file = files.find(f => f.id === fileId);
  if (file) {
    file.tags = file.tags.filter(t => t !== tag);
    file.updatedAt = new Date().toISOString();
    addAudit(userId, 'TAG_REMOVE', 'FILE', fileId, file.name, `Removed tag: ${tag}`);
    const existing = tags.find(t => t.name === tag);
    if (existing) existing.fileCount = Math.max(0, existing.fileCount - 1);
  }
  return file;
}

export async function createFileVersion(fileId: string, size: number, comment: string, userId: string): Promise<FileMetadata | undefined> {
  await delay();
  // TODO: return (await axios.post(`${API_BASE_URL}/files/${fileId}/versions`, { size, comment })).data;
  const file = files.find(f => f.id === fileId);
  if (file) {
    const newVer = file.currentVersion + 1;
    file.versions.push({ id: genId('v'), fileId, versionNumber: newVer, size, uploadedAt: new Date().toISOString(), uploadedBy: userId, comment });
    file.currentVersion = newVer;
    file.size = size;
    file.updatedAt = new Date().toISOString();
    addAudit(userId, 'VERSION_CREATE', 'FILE', fileId, file.name, `Created version ${newVer}: ${comment}`);
  }
  return file;
}

// ==================== FOLDERS ====================

export async function getFolders(): Promise<Folder[]> {
  await delay();
  // TODO: return (await axios.get(`${API_BASE_URL}/folders`)).data;
  return [...folders];
}

export async function createFolder(name: string, parentId: string | null, userId: string): Promise<Folder> {
  await delay();
  // TODO: return (await axios.post(`${API_BASE_URL}/folders`, { name, parentId })).data;
  const folder: Folder = { id: genId('folder'), name, parentId, createdAt: new Date().toISOString(), createdBy: userId };
  folders.push(folder);
  addAudit(userId, 'FOLDER_CREATE', 'FOLDER', folder.id, name, `Created folder ${name}`);
  return folder;
}

export async function deleteFolder(id: string, userId: string): Promise<void> {
  await delay();
  // TODO: await axios.delete(`${API_BASE_URL}/folders/${id}`);
  const folder = folders.find(f => f.id === id);
  folders = folders.filter(f => f.id !== id);
  files = files.map(f => f.folderId === id ? { ...f, folderId: null } : f);
  if (folder) addAudit(userId, 'FOLDER_DELETE', 'FOLDER', id, folder.name, `Deleted folder ${folder.name}`);
}

// ==================== TAGS ====================

export async function getTags(): Promise<Tag[]> {
  await delay();
  // TODO: return (await axios.get(`${API_BASE_URL}/tags`)).data;
  return [...tags];
}

// ==================== AUDIT ====================

export async function getAuditLog(): Promise<AuditEntry[]> {
  await delay();
  // TODO: return (await axios.get(`${API_BASE_URL}/audit`)).data;
  return [...auditLog];
}

// ==================== USERS ====================

export async function getCurrentUser(): Promise<User> {
  await delay();
  // TODO: return (await axios.get(`${API_BASE_URL}/users/me`)).data;
  return { ...users[0] };
}

export async function getUsers(): Promise<User[]> {
  await delay();
  // TODO: return (await axios.get(`${API_BASE_URL}/users`)).data;
  return [...users];
}

// ==================== SEARCH ====================

export async function searchFiles(query: string, tagFilter?: string): Promise<FileMetadata[]> {
  await delay();
  // TODO: return (await axios.get(`${API_BASE_URL}/files/search`, { params: { q: query, tag: tagFilter } })).data;
  const q = query.toLowerCase();
  return files.filter(f => {
    const matchesQuery = !q || f.name.toLowerCase().includes(q) || f.tags.some(t => t.toLowerCase().includes(q));
    const matchesTag = !tagFilter || f.tags.includes(tagFilter);
    return matchesQuery && matchesTag;
  });
}

