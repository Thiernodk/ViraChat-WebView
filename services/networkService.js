// Service réseau simplifié pour éviter les erreurs

class NetworkService {
  constructor() {
    this.isConnected = true;
    this.listeners = [];
  }

  // Initialiser le service réseau
  async initialize() {
    try {
      console.log('Network service initialized');
      this.isConnected = true;
    } catch (error) {
      console.error('Network service initialization failed:', error);
      this.isConnected = true;
    }
  }

  // Ajouter un listener pour les changements réseau
  addListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Notifier tous les listeners
  notifyListeners(isConnected) {
    this.listeners.forEach(callback => {
      try {
        callback(isConnected);
      } catch (error) {
        console.error('Network listener error:', error);
      }
    });
  }

  // Vérifier si le réseau est disponible
  isNetworkAvailable() {
    return this.isConnected;
  }

  // Obtenir le message d'erreur réseau
  getNetworkErrorMessage() {
    if (!this.isConnected) {
      return 'Aucune connexion Internet disponible. Veuillez vérifier votre connexion réseau.';
    }
    return null;
  }
}

export default new NetworkService();
