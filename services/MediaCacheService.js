import * as FileSystem from 'expo-file-system';
import StorageService from './StorageService';

class MediaCacheService {
  static CACHE_DIR = `${FileSystem.documentDirectory}virachat_media/`;

  // Initialiser le répertoire de cache
  static async initCacheDir() {
    try {
      const dirInfo = await FileSystem.getInfoAsync(this.CACHE_DIR);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(this.CACHE_DIR, { intermediates: true });
      }
      return true;
    } catch (error) {
      console.error('Error initializing cache directory:', error);
      return false;
    }
  }

  // Télécharger et mettre en cache un média
  static async cacheMedia(url, mediaId, mediaType = 'image') {
    try {
      await this.initCacheDir();
      
      const extension = this.getExtensionFromUrl(url, mediaType);
      const localPath = `${this.CACHE_DIR}${mediaId}.${extension}`;
      
      // Télécharger le fichier
      const downloadResult = await FileSystem.downloadAsync(url, localPath);
      
      if (downloadResult.status === 200) {
        // Sauvegarder les métadonnées
        await StorageService.cacheMedia(mediaId, {
          localPath: downloadResult.uri,
          originalUrl: url,
          mediaType,
          size: downloadResult.headers['Content-Length'] || 0,
          cachedAt: Date.now(),
        });
        
        return downloadResult.uri;
      }
      
      return null;
    } catch (error) {
      console.error('Error caching media:', error);
      return null;
    }
  }

  // Obtenir un média depuis le cache
  static async getCachedMedia(mediaId) {
    try {
      const cached = await StorageService.getCachedMedia(mediaId);
      if (cached) {
        const fileInfo = await FileSystem.getInfoAsync(cached.localPath);
        if (fileInfo.exists) {
          return cached.localPath;
        }
      }
      return null;
    } catch (error) {
      console.error('Error getting cached media:', error);
      return null;
    }
  }

  // Vérifier si un média est en cache
  static async isMediaCached(mediaId) {
    const cachedPath = await this.getCachedMedia(mediaId);
    return cachedPath !== null;
  }

  // Supprimer un média du cache
  static async removeCachedMedia(mediaId) {
    try {
      const cached = await StorageService.getCachedMedia(mediaId);
      if (cached) {
        await FileSystem.deleteAsync(cached.localPath);
        // Supprimer les métadonnées
        const cache = await StorageService.getMediaCache();
        delete cache[mediaId];
        await AsyncStorage.setItem(StorageService.KEYS.MEDIA_CACHE, JSON.stringify(cache));
      }
      return true;
    } catch (error) {
      console.error('Error removing cached media:', error);
      return false;
    }
  }

  // Nettoyer le cache (supprimer les anciens fichiers)
  static async clearOldCache(maxAge = 7 * 24 * 60 * 60 * 1000) { // 7 jours par défaut
    try {
      const cache = await StorageService.getMediaCache();
      const now = Date.now();
      const toDelete = [];

      for (const [mediaId, mediaData] of Object.entries(cache)) {
        if (now - mediaData.cachedAt > maxAge) {
          toDelete.push(mediaId);
        }
      }

      for (const mediaId of toDelete) {
        await this.removeCachedMedia(mediaId);
      }

      console.log(`Cleared ${toDelete.length} old media files`);
      return toDelete.length;
    } catch (error) {
      console.error('Error clearing old cache:', error);
      return 0;
    }
  }

  // Obtenir la taille totale du cache
  static async getCacheSize() {
    try {
      const cache = await StorageService.getMediaCache();
      let totalSize = 0;

      for (const mediaData of Object.values(cache)) {
        totalSize += mediaData.size || 0;
      }

      return totalSize;
    } catch (error) {
      console.error('Error getting cache size:', error);
      return 0;
    }
  }

  // Vider tout le cache
  static async clearAllCache() {
    try {
      const cache = await StorageService.getMediaCache();
      
      for (const mediaData of Object.values(cache)) {
        try {
          await FileSystem.deleteAsync(mediaData.localPath);
        } catch (error) {
          console.error('Error deleting media file:', error);
        }
      }

      await StorageService.clearCache();
      console.log('Cleared all media cache');
      return true;
    } catch (error) {
      console.error('Error clearing all cache:', error);
      return false;
    }
  }

  // Obtenir l'extension de fichier depuis l'URL
  static getExtensionFromUrl(url, mediaType) {
    const extensions = {
      image: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      video: ['mp4', 'mov', 'avi', 'webm'],
      audio: ['mp3', 'wav', 'ogg', 'm4a'],
      document: ['pdf', 'doc', 'docx', 'xls', 'xlsx'],
    };

    const urlParts = url.split('.');
    const urlExtension = urlParts[urlParts.length - 1].toLowerCase().split('?')[0];

    if (extensions[mediaType]?.includes(urlExtension)) {
      return urlExtension;
    }

    // Extension par défaut selon le type
    const defaults = {
      image: 'jpg',
      video: 'mp4',
      audio: 'mp3',
      document: 'pdf',
    };

    return defaults[mediaType] || 'bin';
  }

  // Précharger des médias pour consultation offline
  static async preloadMedia(urls) {
    const results = [];
    
    for (const { url, mediaId, mediaType } of urls) {
      const isCached = await this.isMediaCached(mediaId);
      if (!isCached) {
        const cachedPath = await this.cacheMedia(url, mediaId, mediaType);
        results.push({ mediaId, success: cachedPath !== null });
      } else {
        results.push({ mediaId, success: true, cached: true });
      }
    }

    return results;
  }
}

export default MediaCacheService;
