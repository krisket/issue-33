import React, { useEffect, useRef, useContext, useState } from 'react';
import { Player, PlayerEvent } from 'bitmovin-player';
import { AppContext } from '../../App';

export default ({ src }) => {
  const playerRef = useRef(null);
  const bitmovin = useRef(null);

  const { state, dispatch } = useContext(AppContext);

  const [buffers, updateBuffers] = useState(undefined);

  useEffect(() => {
    const cfg = { 
      key: 'local',
      ui: false
    };
    const player = new Player(playerRef.current, cfg);

    player.on(PlayerEvent.TimeChanged, () => {
      const videoBuffer = player.buffer.getLevel('forwardduration','video').level;
      const audioBuffer = player.buffer.getLevel('forwardduration','audio').level;
      updateBuffers({ videoBuffer, audioBuffer });
    });

    bitmovin.current = player;
    return () => {
      player.destroy();
    };
  }, []);

  useEffect(() => {
    if (src) {
      const srcCfg = {
        hls: src
      };
      bitmovin.current.load(srcCfg)
        .then(() => {
          console.log('--ready-- ', src);
        });

    }
  }, [src]);

  useEffect(() => {
    if (state.playbackAction) {
      const player = bitmovin.current;
      switch (state.playbackAction) {
        case 'toggle-playback':
          if (player) {
            if (!player.isPlaying()) {
              player.play();
            } else {
              player.pause();
            }
          }
          dispatch({ type: 'after-toggle-playback' });
          break;      
        default:
          break;
      }
    }
  }, [dispatch, state.playbackAction]);

  const style = {
    width: '100%',
    display: 'block'
  };

  return (
    <div style={style} >
      <div ref={playerRef} />
      <div className="info">
        <h2>DEBUG Info</h2>
        <pre>{JSON.stringify(buffers, null, 2)}</pre>
      </div>
    </div>
  );
};