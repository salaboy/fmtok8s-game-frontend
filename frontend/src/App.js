import React, {useState, useRef} from "react";
import {Switch, Route, useLocation} from "react-router-dom";
import {LocomotiveScrollProvider} from 'react-locomotive-scroll';
import {AnimatePresence} from "framer-motion";
import Game from './pages/Game/Game';
import BackOffice from './pages/BackOffice/BackOffice';
import Nav from './components/Nav/Nav';
import AppContext from './contexts/AppContext';
import cn from 'classnames';


function App() {
    const location = useLocation();
    const containerRef = useRef(null);

    //contexts
    const [currentSection, setCurrentSection] = useState("home");
    const [user, setUser] = useState(null);
    const [gameState, setGameState] = useState("active");

    //
    return (


        <AppContext.Provider value={{
            setCurrentSection: setCurrentSection,
            currentSection: currentSection,
            user: user,
            setUser: setUser,
            gameState: gameState,
            setGameState: setGameState
        }}>
            <LocomotiveScrollProvider
                options={{
                    smooth: true,
                    reloadOnContextChange: false,
                }}
                watch={[]}
                containerRef={containerRef}
            >
                <div className={cn({
                    ["App"]: true,
                })}>
                    
                    <main data-scroll-container ref={containerRef}>
                        <AnimatePresence exitBeforeEnter>
                            <Switch location={location} key={location.pathname}>

                                <Route path="/" exact>
                                    <Game/>
                                </Route>
                                <Route path="/leaderboard/:nickname">
                                    <BackOffice/>
                                </Route>
                                <Route path="/leaderboard" exact>
                                    <BackOffice/>
                                </Route>


                            </Switch>
                        </AnimatePresence>
                    </main>
                </div>
            </LocomotiveScrollProvider>
        </AppContext.Provider>

    );
}

export default App;
