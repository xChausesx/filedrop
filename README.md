# Cloud File Manager (FileDrop)

Автоматизація процесів корпоративного та персонального збереження даних, документообігу та аудиту дій користувачів у розподіленому хмарному середовищі.

## Features

- **Multi-level folder hierarchy** — nested folders with tree navigation
- **File management** — upload (drag & drop), rename, move, delete
- **Extended metadata** — MIME type, size, creation/update dates, owner
- **File versioning** — full version history with comments
- **Tag system** — flexible tagging with instant search/filter
- **Audit log** — complete history of all user actions
- **User management & quotas** — roles (admin/user), disk space quotas with progress bars

## Quick Start

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command | Description |
|---|---|
| `npm start` | Run dev server on port 3000 |
| `npm test` | Run tests in watch mode |
| `npm run build` | Production build to `build/` |

---

## Backend Integration Guide

The app currently runs with **mock data** (`src/data/mockData.ts`). All API calls are isolated in a single file:

📄 **`src/services/api.ts`** — the only file that needs changes to connect a real backend.

### Step 1: Configure the Backend URL

Create a `.env` file in the project root:

```env
REACT_APP_API_BASE_URL=http://localhost:8080/api
```

The variable is already referenced in `src/services/api.ts`:

```ts
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';
```

Restart the dev server after changing `.env`.

### Step 2: Replace Mock Implementations with Real HTTP Calls

Every function in `src/services/api.ts` has a `// TODO:` comment showing the exact axios call to uncomment. The library `axios` is already installed.

Below is the full list of endpoints the backend must implement, and where each is used:

#### Files

| Method | Endpoint | Used in `api.ts` function | Called from |
|---|---|---|---|
| `GET` | `/api/files?folderId={id}` | `getFiles()` | `FileExplorer.tsx` — list files in folder |
| `GET` | `/api/files/{id}` | `getFileById()` | `FileExplorer.tsx` — file detail |
| `POST` | `/api/files` (multipart/form-data) | `uploadFile()` | `App.tsx` → `FileDropZone.tsx` — drag & drop upload |
| `DELETE` | `/api/files/{id}` | `deleteFile()` | `FileExplorer.tsx` — delete button |
| `PUT` | `/api/files/{id}/rename` | `renameFile()` | `FileExplorer.tsx` — inline rename |
| `PUT` | `/api/files/{id}/move` | `moveFile()` | `FileExplorer.tsx` — move-to dropdown |
| `GET` | `/api/files/search?q={query}&tag={tag}` | `searchFiles()` | `FileExplorer.tsx` — search bar |

#### File Tags

| Method | Endpoint | Used in `api.ts` function | Called from |
|---|---|---|---|
| `POST` | `/api/files/{id}/tags` | `addTagToFile()` | `FileExplorer.tsx` — add tag input |
| `DELETE` | `/api/files/{id}/tags/{tag}` | `removeTagFromFile()` | `FileExplorer.tsx` — remove tag (×) button |

#### File Versions

| Method | Endpoint | Used in `api.ts` function | Called from |
|---|---|---|---|
| `POST` | `/api/files/{id}/versions` | `createFileVersion()` | `FileExplorer.tsx` — "+ New Version" button |

#### Folders

| Method | Endpoint | Used in `api.ts` function | Called from |
|---|---|---|---|
| `GET` | `/api/folders` | `getFolders()` | `FolderTree.tsx`, `FileExplorer.tsx` |
| `POST` | `/api/folders` | `createFolder()` | `FolderTree.tsx` — "+ Root" / "+" buttons |
| `DELETE` | `/api/folders/{id}` | `deleteFolder()` | `FolderTree.tsx` — "×" button |

#### Tags

| Method | Endpoint | Used in `api.ts` function | Called from |
|---|---|---|---|
| `GET` | `/api/tags` | `getTags()` | `TagsPage.tsx` |

#### Audit

| Method | Endpoint | Used in `api.ts` function | Called from |
|---|---|---|---|
| `GET` | `/api/audit` | `getAuditLog()` | `AuditPage.tsx` |

#### Users

| Method | Endpoint | Used in `api.ts` function | Called from |
|---|---|---|---|
| `GET` | `/api/users/me` | `getCurrentUser()` | (reserved for future auth) |
| `GET` | `/api/users` | `getUsers()` | `UsersPage.tsx` |

### Step 3: Example — Converting a Mock Function to a Real Call

Before (mock):
```ts
export async function getFiles(folderId?: string | null): Promise<FileMetadata[]> {
  await delay();
  if (folderId === undefined) return [...files];
  return files.filter(f => f.folderId === folderId);
}
```

After (real backend):
```ts
import axios from 'axios';

export async function getFiles(folderId?: string | null): Promise<FileMetadata[]> {
  const response = await axios.get(`${API_BASE_URL}/files`, {
    params: { folderId },
  });
  return response.data;
}
```

### Step 4: Remove Mock Data

Once all functions are converted, you can safely delete:
- `src/data/mockData.ts`
- All mock-related imports and in-memory state at the top of `src/services/api.ts`

### CORS Configuration (Java Backend)

If the backend runs on a different port (e.g. `8080`), enable CORS in Spring Boot:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE");
    }
}
```

## Project Structure

```
src/
├── services/api.ts        # ← API layer (single integration point)
├── data/mockData.ts        # ← Mock data (remove after backend integration)
├── types/index.ts          # ← TypeScript interfaces (shared with backend DTOs)
├── components/
│   ├── Header.tsx          # Navigation
│   ├── Footer.tsx          # Footer
│   ├── FileDropZone.tsx    # Drag & drop upload
│   ├── FolderTree.tsx      # Folder hierarchy tree
│   ├── FileExplorer.tsx    # File list, detail panel, versions, tags
│   ├── TagsPage.tsx        # Tag overview
│   ├── AuditPage.tsx       # Audit log viewer
│   └── UsersPage.tsx       # Users & quotas
└── App.tsx                 # Main layout & routing
```
