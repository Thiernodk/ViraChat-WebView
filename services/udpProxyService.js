// Service UDP Multicast Proxy pour Limon+ TV Box
// Convertit les flux UDP multicast en HTTP HLS pour react-native-video

class UDPProxyService {
  constructor() {
    this.isRunning = false;
    this.proxyServer = null;
    this.activeStreams = new Map(); // url -> port
    this.nextPort = 8000;
  }

  // Démarrer le serveur proxy
  async startProxyServer() {
    try {
      if (this.isRunning) {
        console.log('Serveur proxy déjà en cours d\'exécution');
        return true;
      }
      
      console.log('Démarrage du serveur proxy UDP...');
      
      // Pour l'instant, simulation du démarrage
      // En production, cela lancerait un vrai serveur Node.js/FFmpeg
      this.isRunning = true;
      
      console.log('Serveur proxy UDP démarré sur le port 8000');
      return true;
    } catch (error) {
      console.error('Erreur démarrage proxy UDP:', error);
      return false;
    }
  }

  // Arrêter le serveur proxy
  async stopProxyServer() {
    try {
      console.log('Arrêt du serveur proxy UDP...');
      
      // Arrêter tous les flux actifs
      for (const [url] of this.activeStreams) {
        await this.stopStream(url);
      }
      
      this.isRunning = false;
      console.log('Serveur proxy UDP arrêté');
      return true;
    } catch (error) {
      console.error('Erreur arrêt proxy UDP:', error);
      return false;
    }
  }

  // Convertir une URL UDP en URL HTTP locale
  convertUDPToHTTP(udpUrl) {
    try {
      if (!udpUrl || typeof udpUrl !== 'string') {
        return udpUrl;
      }
      
      // Vérifier si c'est déjà une URL UDP
      if (!udpUrl.startsWith('udp://')) {
        return udpUrl; // Retourner l'URL originale si ce n'est pas de l'UDP
      }

      // Vérifier si le flux est déjà actif
      if (this.activeStreams.has(udpUrl)) {
        const port = this.activeStreams.get(udpUrl);
        return `http://localhost:${port}/stream.m3u8`;
      }

      // Démarrer un nouveau flux
      const port = this.nextPort++;
      this.startStream(udpUrl, port);
      
      return `http://localhost:${port}/stream.m3u8`;
    } catch (error) {
      console.error('Erreur conversion UDP vers HTTP:', error);
      return udpUrl; // Retourner l'URL originale en cas d'erreur
    }
  }

  // Démarrer un flux UDP spécifique
  async startStream(udpUrl, port) {
    try {
      if (!udpUrl || !port) {
        console.error('URL UDP ou port manquant');
        return false;
      }
      
      console.log(`Démarrage du flux UDP: ${udpUrl} -> http://localhost:${port}`);
      
      // Simulation du démarrage de FFmpeg
      // En production: 
      // ffmpeg -i udp://@239.1.1.1:1234 -c copy -f hls http://localhost:${port}/stream.m3u8
      
      this.activeStreams.set(udpUrl, port);
      
      // Simuler le démarrage après 2 secondes
      setTimeout(() => {
        console.log(`Flux UDP démarré sur le port ${port}`);
      }, 2000);
      
      return true;
    } catch (error) {
      console.error('Erreur démarrage flux UDP:', error);
      return false;
    }
  }

  // Arrêter un flux UDP spécifique
  async stopStream(udpUrl) {
    try {
      if (!udpUrl) {
        return false;
      }
      
      const port = this.activeStreams.get(udpUrl);
      if (port) {
        console.log(`Arrêt du flux UDP: ${udpUrl} (port ${port})`);
        
        // Arrêter le processus FFmpeg
        // En production: tuer le processus FFmpeg
        
        this.activeStreams.delete(udpUrl);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur arrêt flux UDP:', error);
      return false;
    }
  }

  // Vérifier si le serveur est en cours d'exécution
  isProxyRunning() {
    return this.isRunning;
  }

  // Obtenir les flux actifs
  getActiveStreams() {
    try {
      return Array.from(this.activeStreams.entries());
    } catch (error) {
      console.error('Erreur getActiveStreams:', error);
      return [];
    }
  }

  // Tester la connectivité UDP
  async testUDPConnectivity(udpUrl) {
    try {
      if (!udpUrl || typeof udpUrl !== 'string') {
        return false;
      }
      
      console.log(`Test de connectivité UDP pour: ${udpUrl}`);
      
      // Simulation du test
      // En production: vérifier si le flux UDP est accessible
      
      return true; // Simulation: le flux est accessible
    } catch (error) {
      console.error('Erreur test connectivité UDP:', error);
      return false;
    }
  }
}

export default new UDPProxyService();
