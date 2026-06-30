import StorageService from './StorageService';

class CookieService {
  // Les cookies sont gérés automatiquement par le WebView avec thirdPartyCookiesEnabled
  // Nous stockons simplement l'URL et les informations de session
  
  static async saveSession(url, sessionData = {}) {
    try {
      await StorageService.saveSession({
        url,
        ...sessionData,
        lastLogin: Date.now(),
      });
      return true;
    } catch (error) {
      console.error('Error saving session:', error);
      return false;
    }
  }

  static async getSession() {
    try {
      return await StorageService.getSession();
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  static async clearSession() {
    try {
      await StorageService.clearSession();
      return true;
    } catch (error) {
      console.error('Error clearing session:', error);
      return false;
    }
  }
}

export default CookieService;
