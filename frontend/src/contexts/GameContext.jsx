import {createContext} from 'react';

const GameContext = createContext(
    {
        gameState: {
            sessionID: "",
            landed: true,
            level: ""
        },
      dispatch: null
    },
);

export default GameContext;