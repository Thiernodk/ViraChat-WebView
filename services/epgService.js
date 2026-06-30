class EPGService {
  constructor() {
    this.epgData = {};
    this.listeners = [];
  }

  loadEPGData(data) {
    this.epgData = data;
    this.notifyListeners('epgDataLoaded', data);
  }

  getEPGForChannel(channelId) {
    return this.epgData[channelId] || null;
  }

  getCurrentProgram(channelId) {
    const channelData = this.epgData[channelId];
    if (!channelData || !channelData.current) {
      return null;
    }
    return channelData.current;
  }

  getNextProgram(channelId) {
    const channelData = this.epgData[channelId];
    if (!channelData || !channelData.next) {
      return null;
    }
    return channelData.next;
  }

  getTimeline(channelId) {
    const channelData = this.epgData[channelId];
    if (!channelData || !channelData.timeline) {
      return [];
    }
    return channelData.timeline;
  }

  getProgramProgress(program) {
    if (!program || !program.startTime || !program.endTime) {
      return 0;
    }

    const start = new Date(program.startTime).getTime();
    const end = new Date(program.endTime).getTime();
    const now = Date.now();

    if (now < start) return 0;
    if (now > end) return 100;

    return ((now - start) / (end - start)) * 100;
  }

  addListener(event, callback) {
    this.listeners.push({ event, callback });
  }

  removeListener(event, callback) {
    this.listeners = this.listeners.filter(
      (listener) => listener.event !== event || listener.callback !== callback
    );
  }

  notifyListeners(event, data) {
    this.listeners
      .filter((listener) => listener.event === event)
      .forEach((listener) => listener.callback(data));
  }

  formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  }
}

export default new EPGService();
