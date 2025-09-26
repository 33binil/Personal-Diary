// Google Drive service for saving/retrieving encrypted diary entries
import diaryEncryption from '../utils/encryption.js';

class GoogleDriveService {
  constructor() {
    this.gapi = null;
    this.isInitialized = false;
    this.accessToken = null;
    this.DIARY_FOLDER_NAME = 'Personal_Diary_Encrypted';
    this.diaryFolderId = null;
  }

  // Initialize Google Drive API
  async initialize(accessToken) {
    try {
      this.accessToken = accessToken;
      this.isInitialized = true;
      
      // Find or create diary folder
      await this.ensureDiaryFolder();
      
      return true;
    } catch (error) {
      console.error('Failed to initialize Google Drive:', error);
      return false;
    }
  }

  // Find or create the diary folder in Google Drive
  async ensureDiaryFolder() {
    try {
      // Search for existing diary folder
      const searchResponse = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=name='${this.DIARY_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          },
        }
      );

      const searchData = await searchResponse.json();
      
      if (searchData.files && searchData.files.length > 0) {
        // Folder exists
        this.diaryFolderId = searchData.files[0].id;
      } else {
        // Create new folder
        const createResponse = await fetch(
          'https://www.googleapis.com/drive/v3/files',
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: this.DIARY_FOLDER_NAME,
              mimeType: 'application/vnd.google-apps.folder',
              description: 'Encrypted diary entries from Personal Diary app',
            }),
          }
        );

        const createData = await createResponse.json();
        this.diaryFolderId = createData.id;
      }

      console.log('Diary folder ready:', this.diaryFolderId);
      return this.diaryFolderId;
    } catch (error) {
      console.error('Error ensuring diary folder:', error);
      throw error;
    }
  }

  // Ensure a subfolder for a specific date (YYYY-MM-DD) exists under the diary folder
  async ensureDateFolder(dateStr) {
    try {
      if (!this.diaryFolderId) {
        await this.ensureDiaryFolder();
      }

      // Search for date folder within diary folder
      const q = encodeURIComponent(`name='${dateStr}' and mimeType='application/vnd.google-apps.folder' and trashed=false and '${this.diaryFolderId}' in parents`);
      const searchResponse = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${q}`,
        {
          headers: { 'Authorization': `Bearer ${this.accessToken}` }
        }
      );
      const searchData = await searchResponse.json();
      if (searchData.files && searchData.files.length > 0) {
        return searchData.files[0].id;
      }

      // Create if not found
      const createResponse = await fetch(
        'https://www.googleapis.com/drive/v3/files',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: dateStr,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [this.diaryFolderId],
            description: `Diary entries for ${dateStr}`,
          }),
        }
      );
      const createData = await createResponse.json();
      return createData.id;
    } catch (error) {
      console.error('Error ensuring date folder:', error);
      throw error;
    }
  }

  // Save encrypted diary entry to Google Drive
  async saveDiaryEntry(title, content, date, images = [], audio = [], theme, userId) {
    try {
      if (!this.isInitialized) {
        throw new Error('Google Drive service not initialized');
      }

      // Create encrypted diary entry
      // support prompt as the 8th argument (optional)
      const prompt = arguments.length >= 8 ? arguments[7] : ''
      const encryptedEntry = diaryEncryption.createDiaryEntry(
        title, content, date, images, audio, theme, userId, prompt
      );

      // Generate filename
      const fileName = diaryEncryption.generateFileName(date, theme, userId);

      // Ensure date folder exists
      const dateFolderId = await this.ensureDateFolder(date);

      // Convert entry to JSON string
      const entryJson = JSON.stringify(encryptedEntry, null, 2);

      // Create file metadata
      const metadata = {
        name: fileName,
        parents: [dateFolderId],
        description: `Encrypted diary entry from ${date}`,
      };

      // Upload file to Google Drive
      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', new Blob([entryJson], { type: 'application/json' }));

      const response = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          },
          body: form,
        }
      );

      const result = await response.json();
      
      if (response.ok) {
        console.log('Diary entry saved to Google Drive:', result.id);
        return {
          success: true,
          fileId: result.id,
          fileName: fileName,
          entry: encryptedEntry
        };
      } else {
        throw new Error(`Failed to save: ${result.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving diary entry:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get all diary entries from Google Drive
  async getAllDiaryEntries(userId) {
    try {
      if (!this.isInitialized) {
        throw new Error('Google Drive service not initialized');
      }

      // Helper to list files in a folder
      const listFilesInFolder = async (folderId) => {
        const q = encodeURIComponent(`'${folderId}' in parents and trashed=false and name contains '.drycode'`);
        const resp = await fetch(
          `https://www.googleapis.com/drive/v3/files?q=${q}&orderBy=createdTime desc`,
          { headers: { 'Authorization': `Bearer ${this.accessToken}` } }
        );
        const data = await resp.json();
        return data.files || [];
      };

      // List top-level files (backward compatibility)
      const topLevelFiles = await listFilesInFolder(this.diaryFolderId);

      // List date subfolders
      const qFolders = encodeURIComponent(`'${this.diaryFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`);
      const foldersResp = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${qFolders}`,
        { headers: { 'Authorization': `Bearer ${this.accessToken}` } }
      );
      const foldersData = await foldersResp.json();
      const dateFolders = foldersData.files || [];

      // Collect files from each date folder
      let allFiles = [...topLevelFiles];
      for (const folder of dateFolders) {
        try {
          const files = await listFilesInFolder(folder.id);
          allFiles = allFiles.concat(files);
        } catch (e) {
          console.error('Error listing files in folder', folder.name, e);
        }
      }

      if (allFiles.length === 0) return [];

      // Download and decrypt
      const entries = [];
      for (const file of allFiles) {
        try {
          const entry = await this.getDiaryEntry(file.id, userId);
          if (entry) {
            // Attach the Drive file id so callers can reference/delete the remote file
            entry.fileId = file.id
            entries.push(entry)
          }
        } catch (error) {
          console.error(`Error loading entry ${file.name}:`, error);
        }
      }
      return entries;
    } catch (error) {
      console.error('Error getting diary entries:', error);
      return [];
    }
  }

  // Get single diary entry by file ID
  async getDiaryEntry(fileId, userId) {
    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.statusText}`);
      }

      const encryptedData = await response.text();
      const encryptedEntry = JSON.parse(encryptedData);

      // Decrypt the entry
      const decryptedEntry = diaryEncryption.decryptDiaryEntry(encryptedEntry, userId);

      // If decryption failed for title/content (likely file belongs to another user), skip it
      if (decryptedEntry == null) return null
      const badTitle = decryptedEntry.title === null || decryptedEntry.title === undefined
      const badContent = decryptedEntry.content === null || decryptedEntry.content === undefined
      if (badTitle || badContent) {
        // treat as inaccessible to this user
        return null
      }

      return decryptedEntry;
    } catch (error) {
      console.error('Error getting diary entry:', error);
      return null;
    }
  }

  // Delete diary entry from Google Drive
  async deleteDiaryEntry(fileId) {
    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          },
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Error deleting diary entry:', error);
      return false;
    }
  }

  // Get storage info
  async getStorageInfo() {
    try {
      const response = await fetch(
        'https://www.googleapis.com/drive/v3/about?fields=storageQuota',
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          },
        }
      );

      const data = await response.json();
      return data.storageQuota;
    } catch (error) {
      console.error('Error getting storage info:', error);
      return null;
    }
  }

  // Debug helper to verify token/folder access
  async debugCheck() {
    try {
      if (!this.isInitialized) {
        throw new Error('Service not initialized');
      }
      const folderId = await this.ensureDiaryFolder();
      const q = encodeURIComponent(`'${folderId}' in parents and trashed=false`);
      const resp = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${q}&pageSize=10&fields=files(id,name,mimeType)`,
        { headers: { 'Authorization': `Bearer ${this.accessToken}` } }
      );
      const data = await resp.json();
      return { ok: resp.ok, folderId, files: data.files || [], error: data.error };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }
}

// Export singleton instance
const googleDriveService = new GoogleDriveService();
export default googleDriveService;