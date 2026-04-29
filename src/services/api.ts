/**
 * API Service - abstraction layer for backend integration.
 * Connected to ASP.NET Core / RavenDB backend.
 */

import axios from 'axios';
import { FileMetadata, Folder, AuditEntry, Tag, User } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// ==================== FILES ====================

export async function getFiles(folderId?: string | null): Promise<FileMetadata[]> {
  const response = await axios.get(`${API_BASE_URL}/files`, {
    params: { folderId }
  });
  return response.data;
}

export async function getFileById(id: string): Promise<FileMetadata | undefined> {
  const response = await axios.get(`${API_BASE_URL}/files/${id}`);
  return response.data;
}

export async function uploadFile(file: File, folderId: string | null, tagsList: string[], userId: string): Promise<FileMetadata> {
  const formData = new FormData();
  
  formData.append('File', file); 
  
  if (folderId && folderId !== 'null') {
    formData.append('FolderId', folderId);
  }
  
  if (tagsList && tagsList.length > 0) {
    formData.append('Tags', tagsList.join(','));
  }
  
  formData.append('UserId', userId);

  const response = await axios.post(`${API_BASE_URL}/files`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data;
}

export async function deleteFile(id: string, userId: string): Promise<void> {
  await axios.delete(`${API_BASE_URL}/files/${id}`, {
    params: { userId }
  });
}

export async function renameFile(id: string, newName: string, userId: string): Promise<FileMetadata | undefined> {
  const response = await axios.put(`${API_BASE_URL}/files/${id}/rename`, 
    { name: newName }, 
    { params: { userId } }
  );
  return response.data;
}

export async function moveFile(id: string, newFolderId: string | null, userId: string): Promise<FileMetadata | undefined> {
  const response = await axios.put(`${API_BASE_URL}/files/${id}/move`, 
    { folderId: newFolderId },
    { params: { userId } }
  );
  return response.data;
}

export async function addTagToFile(fileId: string, tag: string, userId: string): Promise<FileMetadata | undefined> {
  const response = await axios.post(`${API_BASE_URL}/files/${fileId}/tags`, 
    { tag },
    { params: { userId } }
  );
  return response.data;
}

export async function removeTagFromFile(fileId: string, tag: string, userId: string): Promise<FileMetadata | undefined> {
  const response = await axios.delete(`${API_BASE_URL}/files/${fileId}/tags/${tag}`, {
    params: { userId }
  });
  return response.data;
}

export async function createFileVersion(fileId: string, size: number, comment: string, userId: string): Promise<FileMetadata | undefined> {
  const response = await axios.post(`${API_BASE_URL}/files/${fileId}/versions`, 
    { size, comment },
    { params: { userId } }
  );
  return response.data;
}

// ==================== FOLDERS ====================

export async function getFolders(): Promise<Folder[]> {
  const response = await axios.get(`${API_BASE_URL}/folders`);
  return response.data;
}

export async function createFolder(name: string, parentId: string | null, userId: string): Promise<Folder> {
  const response = await axios.post(`${API_BASE_URL}/folders`, 
    { name, parentId },
    { params: { userId } }
  );
  return response.data;
}

export async function deleteFolder(id: string, userId: string): Promise<void> {
  await axios.delete(`${API_BASE_URL}/folders/${id}`, {
    params: { userId }
  });
}

// ==================== TAGS ====================

export async function getTags(): Promise<Tag[]> {
  const response = await axios.get(`${API_BASE_URL}/tags`);
  return response.data;
}

// ==================== AUDIT ====================

export async function getAuditLog(): Promise<AuditEntry[]> {
  const response = await axios.get(`${API_BASE_URL}/audit`);
  return response.data;
}

// ==================== USERS ====================

export async function getCurrentUser(): Promise<User> {
  const response = await axios.get(`${API_BASE_URL}/users/me`);
  return response.data;
}

export async function getUsers(): Promise<User[]> {
  const response = await axios.get(`${API_BASE_URL}/users`);
  return response.data;
}

// ==================== SEARCH ====================

export async function searchFiles(query: string, tagFilter?: string): Promise<FileMetadata[]> {
  const response = await axios.get(`${API_BASE_URL}/files/search`, { 
    params: { q: query, tag: tagFilter } 
  });
  return response.data;
}