import { useEffect, useRef } from 'react';
import { BackHandler, TVEventHandler } from 'react-native';

const useTVRemoteControl = ({
  onOK,
  onBack,
  onMenu,
  onChannelUp,
  onChannelDown,
  onUp,
  onDown,
  onLeft,
  onRight,
  onInfo,
  onExit,
  enabled = true,
}) => {
  const tvEventHandler = useRef(null);

  useEffect(() => {
    if (!enabled || typeof TVEventHandler === 'undefined') {
      return;
    }

    tvEventHandler.current = new TVEventHandler();
    tvEventHandler.current.enable(null, (cmp, evt) => {
      console.log('[useTVRemoteControl] Event:', evt);
      
      if (!evt) return;

      switch (evt.eventType) {
        case 'select':
        case 'dpadCenter':
          if (onOK) onOK();
          break;
        case 'back':
          if (onBack) onBack();
          break;
        case 'menu':
          if (onMenu) onMenu();
          break;
        case 'channelUp':
          if (onChannelUp) onChannelUp();
          break;
        case 'channelDown':
          if (onChannelDown) onChannelDown();
          break;
        case 'up':
          if (onUp) onUp();
          break;
        case 'down':
          if (onDown) onDown();
          break;
        case 'left':
          if (onLeft) onLeft();
          break;
        case 'right':
          if (onRight) onRight();
          break;
        case 'info':
          if (onInfo) onInfo();
          break;
        case 'exit':
          if (onExit) onExit();
          break;
        default:
          if (evt.eventKey === 'CHANNEL_UP' && onChannelUp) onChannelUp();
          if (evt.eventKey === 'CHANNEL_DOWN' && onChannelDown) onChannelDown();
          if (evt.eventKey === 'MENU' && onMenu) onMenu();
          if (evt.eventKey === 'INFO' && onInfo) onInfo();
          if (evt.eventKey === 'EXIT' && onExit) onExit();
          break;
      }
    });

    return () => {
      if (tvEventHandler.current) {
        tvEventHandler.current.disable();
      }
    };
  }, [enabled, onOK, onBack, onMenu, onChannelUp, onChannelDown, onUp, onDown, onLeft, onRight, onInfo, onExit]);

  // Handle back button with BackHandler
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (onBack) {
        onBack();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [onBack]);
};

export default useTVRemoteControl;
