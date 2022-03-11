import React, {useEffect, useState, useContext, useRef} from "react";
import {Switch, Route, useLocation, useHistory} from "react-router-dom";
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
    //
    return (


        <AppContext.Provider value={{
            setCurrentSection: setCurrentSection,
            currentSection: currentSection,
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
                    <Nav/>
                    <main data-scroll-container ref={containerRef}>
                        <AnimatePresence exitBeforeEnter>
                            <Switch location={location} key={location.pathname}>

                                <Route path="/" exact>
                                    <Game/>
                                </Route>
                                <Route path="/back-office/:subSection" >
                                    <BackOffice/>
                                </Route>
                                <Route path="/back-office" exact >
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
