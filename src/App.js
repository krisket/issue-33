import React, { createContext, useReducer } from 'react';

import Player from './components/player';

import './App.css';

export const AppContext = createContext({});
const reducer = (state, action) => {
  const { type, ...params } = action;

  switch (type) {
    case 'toggle-playback':      
      return { ...state, playbackAction: 'toggle-playback' };  
    case 'after-toggle-playback':
      return { ...state, playbackAction: undefined };  
    default:
      return state;
  }
};

const SAMPLES = [
  'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8',
  'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8'
];

function App() {
  const [state, dispatch] = useReducer(reducer, {});

  return (
    <div className="App">
      <AppContext.Provider value={{ state, dispatch }}>
      <div id="players">
        <Player src={SAMPLES[0]} />
        <Player src={SAMPLES[1]} />
      </div>
      <div style={{ position: 'absolute', bottom: '1em', left: 0, right: 0, margin: 'auto' }} >
        <div onClick={() => { dispatch({ type: 'toggle-playback' }); }}>Play/Pause</div>
      </div>
      </AppContext.Provider>
    </div>
  );
}

export default App;
