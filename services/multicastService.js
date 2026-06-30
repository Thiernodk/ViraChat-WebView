class MulticastService {
  constructor() {
    this.enabled = false;
    this.proxyUrl = null;
    this.listeners = [];
    this.activeStreams = new Map();
  }

  enable(proxyUrl) {
    this.enabled = true;
    this.proxyUrl = proxyUrl;
    this.notifyListeners('multicastEnabled', { enabled: true, proxyUrl });
  }

  disable() {
    this.enabled = false;
    this.proxyUrl = null;
    this.activeStreams.clear();
    this.notifyListeners('multicastDisabled', { enabled: false });
  }

  isEnabled() {
    return this.enabled;
  }

  getProxyUrl() {
    return this.proxyUrl;
  }

  convertToProxyUrl(originalUrl) {
    if (!this.enabled || !this.proxyUrl) {
      return originalUrl;
    }

    if (originalUrl.startsWith('udp://') || originalUrl.startsWith('rtp://')) {
      return `${this.proxyUrl}?url=${encodeURIComponent(originalUrl)}`;
    }

    return originalUrl;
  }

  addActiveStream(channelId, url) {
    this.activeStreams.set(channelId, {
      url,
      startTime: Date.now(),
    });
    this.notifyListeners('streamAdded', { channelId, url });
  }

  removeActiveStream(channelId) {
    this.activeStreams.delete(channelId);
    this.notifyListeners('streamRemoved', { channelId });
  }

  getActiveStreams() {
    return Array.from(this.activeStreams.entries()).map(([channelId, data]) => ({
      channelId,
      ...data,
    }));
  }

  getActiveStreamCount() {
    return this.activeStreams.size;
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

  validateMulticastUrl(url) {
    if (!url || typeof url !== 'string') {
      return { valid: false, error: 'Invalid URL' };
    }

    const multicastProtocols = ['udp://', 'rtp://', 'multicast://'];
    const isMulticast = multicastProtocols.some((protocol) =>
      url.toLowerCase().startsWith(protocol)
    );

    if (!isMulticast) {
      return { valid: false, error: 'Not a multicast URL' };
    }

    return { valid: true };
  }
}

export default new MulticastService();
