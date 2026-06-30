class PlayerService {
  constructor() {
    this.currentChannel = null;
    this.isPlaying = false;
    this.listeners = [];
  }

  setChannel(channel) {
    this.currentChannel = channel;
    this.notifyListeners('channelChanged', channel);
  }

  getChannel() {
    return this.currentChannel;
  }

  play() {
    this.isPlaying = true;
    this.notifyListeners('playbackStateChanged', true);
  }

  pause() {
    this.isPlaying = false;
    this.notifyListeners('playbackStateChanged', false);
  }

  isCurrentlyPlaying() {
    return this.isPlaying;
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

  getSupportedFormats() {
    return ['HLS', 'RTMP', 'UDP', 'Multicast', 'DASH'];
  }

  validateUrl(url) {
    if (!url || typeof url !== 'string') {
      return { valid: false, error: 'Invalid URL' };
    }

    const supportedProtocols = ['http://', 'https://', 'rtmp://', 'udp://', 'rtp://'];
    const hasValidProtocol = supportedProtocols.some((protocol) =>
      url.toLowerCase().startsWith(protocol)
    );

    if (!hasValidProtocol) {
      return { valid: false, error: 'Unsupported protocol' };
    }

    return { valid: true };
  }
}

export default new PlayerService();
