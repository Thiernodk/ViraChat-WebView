import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { Video, AVPlaybackStatus, Audio } from 'expo-av';

const VideoPlayer = ({ source, onReady, onError, onProgress, onEnd }) => {
  const videoRef = useRef(null);
  const [status, setStatus] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  useEffect(() => {
    console.log('[VideoPlayer] Component mounted, source:', source?.uri);
    
    // Set audio mode for TV
    Audio.setAudioModeAsync({
      staysActiveInBackground: false,
      playsInSilentModeIOS: true,
      allowsRecordingIOS: false,
    }).catch(console.error);
    
    return () => {
      console.log('[VideoPlayer] Component unmounting');
      if (videoRef.current) {
        videoRef.current.unloadAsync().catch(console.error);
      }
    };
  }, []);

  useEffect(() => {
    const loadVideo = async () => {
      if (!videoRef.current || !source?.uri) return;
      
      try {
        console.log('[VideoPlayer] Loading video:', source.uri);
        await videoRef.current.loadAsync(source, {}, false);
        await videoRef.current.playAsync();
        retryCountRef.current = 0;
      } catch (error) {
        console.error('[VideoPlayer] Load error:', error);
        retryCountRef.current++;
        
        if (retryCountRef.current <= maxRetries) {
          console.log(`[VideoPlayer] Retrying (${retryCountRef.current}/${maxRetries})...`);
          setTimeout(() => loadVideo(), 2000);
        } else {
          if (onError) {
            onError(error);
          }
        }
      }
    };

    loadVideo();
  }, [source?.uri]);

  const handlePlaybackStatusUpdate = (playbackStatus) => {
    setStatus(playbackStatus);

    if (playbackStatus.isLoaded) {
      if (!isInitialized) {
        console.log('[VideoPlayer] Video loaded successfully');
        setIsInitialized(true);
        if (onReady) {
          onReady();
        }
      }

      if (onProgress) {
        onProgress({
          currentTime: playbackStatus.positionMillis / 1000,
          duration: playbackStatus.durationMillis / 1000,
        });
      }

      if (playbackStatus.didJustFinish && onEnd) {
        console.log('[VideoPlayer] Video finished');
        onEnd();
      }
    }
    
    if (playbackStatus.error) {
      console.error('[VideoPlayer] Playback error:', playbackStatus.error);
      if (onError) {
        onError(playbackStatus.error);
      }
    }
  };

  const handleLoad = (response) => {
    console.log('[VideoPlayer] Video loaded, duration:', response.durationMillis);
  };

  const handleReadyForDisplay = () => {
    console.log('[VideoPlayer] Video ready for display');
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={source}
        style={styles.video}
        useNativeControls={false}
        resizeMode="contain"
        isLooping={false}
        shouldPlay={true}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        onLoad={handleLoad}
        onReadyForDisplay={handleReadyForDisplay}
        progressUpdateInterval={500}
        positionUpdateInterval={500}
        isMuted={false}
        volume={1.0}
        playInBackground={false}
        playWhenInactive={false}
        preventsDisplaySleepDuringVideoPlayback={true}
        posterSource={null}
        rate={1.0}
        shouldCorrectPitch={true}
      />
    </View>
  );
};

VideoPlayer.propTypes = {
  source: PropTypes.object.isRequired,
  onReady: PropTypes.func,
  onError: PropTypes.func,
  onProgress: PropTypes.func,
  onEnd: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    flex: 1,
  },
});

export default VideoPlayer;
