// Simple encryption utility for diary entries
// This converts text to encoded format before saving to Google Drive

class DiaryEncryption {
  constructor() {
    this.key = 'DIARY_SECRET_2025'; // You can make this more complex
  }

  // Encrypt text to codes
  encrypt(text, userId) {
    try {
      // Create a more complex encoding using user ID as additional salt
      const userSalt = userId.slice(-8); // Last 8 chars of user ID
      const combined = text + '|' + userSalt;
      
      // Convert to Base64 with additional transformations
      const encoded = btoa(combined);
      
      // Add some character shuffling for obfuscation
      const shuffled = this.shuffleString(encoded);
      
      // Add timestamp marker
      const timestamp = Date.now().toString(36);
      const final = `DRY_${timestamp}_${shuffled}_END`;
      
      return final;
    } catch (error) {
      console.error('Encryption failed:', error);
      return null;
    }
  }

  // Decrypt codes back to text
  decrypt(encryptedText, userId) {
    try {
      // Remove markers
      if (!encryptedText.startsWith('DRY_') || !encryptedText.endsWith('_END')) {
        throw new Error('Invalid encrypted format');
      }
      
      const content = encryptedText.slice(4, -4); // Remove DRY_ and _END
      const parts = content.split('_');

      if (parts.length < 2) {
        throw new Error('Invalid encrypted structure');
      }

      // Remove timestamp (first part) and get the shuffled content (join the rest)
      const shuffled = parts.slice(1).join('_');
      
      // Unshuffle
      const encoded = this.unshuffleString(shuffled);
      
      // Decode from Base64
      const decoded = atob(encoded);
      
      // Split by separator and verify user
      const [originalText, userSalt] = decoded.split('|');
      const expectedUserSalt = userId.slice(-8);
      
      if (userSalt !== expectedUserSalt) {
        throw new Error('User verification failed');
      }
      
      return originalText;
    } catch (error) {
      console.error('Decryption failed:', error);
      return null;
    }
  }

  // Simple string shuffling for obfuscation
  shuffleString(str) {
    const chars = str.split('');
    const shuffled = [];
    
    // Reverse every 3 characters
    for (let i = 0; i < chars.length; i += 3) {
      const chunk = chars.slice(i, i + 3);
      shuffled.push(...chunk.reverse());
    }
    
    return shuffled.join('');
  }

  // Reverse the shuffling
  unshuffleString(str) {
    const chars = str.split('');
    const unshuffled = [];
    
    // Reverse every 3 characters back
    for (let i = 0; i < chars.length; i += 3) {
      const chunk = chars.slice(i, i + 3);
      unshuffled.push(...chunk.reverse());
    }
    
    return unshuffled.join('');
  }

  // Generate unique filename for diary entry
  generateFileName(date, theme, userId) {
    const dateStr = date.replace(/[/:-]/g, '');
    const userHash = userId.slice(-6);
    return `diary_${dateStr}_t${theme}_${userHash}.drycode`;
  }

  // Create diary entry object
  createDiaryEntry(title, content, date, images, audio, theme, userId) {
    return {
      id: `${Date.now()}_${userId.slice(-4)}`,
      title: this.encrypt(title, userId),
      content: this.encrypt(content, userId),
      date: date,
      images: images || [],
      audio: audio || [],
      theme: theme,
  // prompt is the 8th argument (index 7) when provided
  prompt: arguments.length >= 8 ? arguments[7] || '' : '',
      userId: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0'
    };
  }

  // Decrypt diary entry object
  decryptDiaryEntry(encryptedEntry, userId) {
    return {
      ...encryptedEntry,
      title: this.decrypt(encryptedEntry.title, userId),
      content: this.decrypt(encryptedEntry.content, userId),
      prompt: encryptedEntry.prompt || ''
    };
  }
}

// Export singleton instance
const diaryEncryption = new DiaryEncryption();
export default diaryEncryption;