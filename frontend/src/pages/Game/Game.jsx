import "./Game.scss";
import React, {useEffect, useState, useContext, useRef, useReducer} from "react";
import ReactDOM from "react-dom";
import {motion} from "framer-motion"
import {useLocomotiveScroll} from 'react-locomotive-scroll';
import AppContext from '../../contexts/AppContext';
import Header from '../../components/Header/Header'
import cn from 'classnames';
import {CloudEvent, HTTP} from "cloudevents";
import axios from "axios";
import useEventListener from '../../hooks/useEventListener';

import {gameStateReducer} from "../../reducers/GameStateReducer";
import GameContext from "../../contexts/GameContext";
import Button from "../../components/Button/Button";
import useInterval from "../../hooks/useInterval";
import Level1 from "../../components/Level1/Level1";
import Level2 from "../../components/Level2/Level2";
import Clock from "../../components/Clock/Clock";

// Short logic description
// 1) Create a game session: call POST /game/ to create a new session
// 2) Add the session to the gameStateReducer, check if there is a session always in state
// 3) If there is a session, check if the current level exist by querying the health endpoints of the function using the gameInfo levelId
// 4) If the level is available enable the start level button
// 5) wait for the state of the level change to completed
// 6) Show move to next level button, move to 3, where first we need to check if the level exists or not

// function loadRemoteComponent(url){
//     return fetch(url)
//         .then(res=>res.text())
//         .then(source=>{
//             var exports = {}
//             function require(name){
//                 if(name == 'react') return React
//                 else throw `You can't use modules other than "react" in remote component.`
//             }
//             const transformedSource = Babel.transform(source, {
//                 presets: ['react', 'es2015']
//             }).code
//             eval(transformedSource)
//             return exports.__esModule ? exports.default : exports
//         })
// }
//


function Game() {
    const {currentSection, setCurrentSection} = useContext(AppContext);

    const {gameState} = useContext(GameContext)
    const [state, dispatch] = useReducer(gameStateReducer, gameState)
    const [loading, setLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    let [delay, setDelay] = useState(4000);


    const [nickname, setNickname] = useState("")


    function handleDelayChange(e) {
        setDelay(Number(e.target.value));
    }

    //scroll
    const {scroll} = useLocomotiveScroll();
    useEffect(() => {
        setCurrentSection("game");
        if (scroll) {
            scroll.destroy();
            scroll.init();
        }
    }, [scroll]);
    //Handle advanced page transitions
    const pageVariants = {
        visible: {opacity: 1},
        hidden: {opacity: 0},
        exit: {opacity: 0, transition: {duration: .5}}
    }
    const pageAnimationStart = e => {
    };
    const pageAnimationComplete = e => {
    };

    // useEventListener('keyup', handleEvents)

    function createMyGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }


    function newGame() {
        if (state.sessionID === "") {
            axios.post('/game/' + nickname).then(res => {
                console.log(res.data)
                dispatch({type: "gameSessionIdCreated", payload: res.data})
            }).catch(err => {
                console.log(err)
            });
        }
    }

    //
    // useInterval(() => {
    //     if (state.sessionID != "" && state.currentLevelStarted && !state.currentLevelCompleted) {
    //         // axios.get('/game/level-' + state.currentLevelId + '/answerBySession/'+ state.sessionID).then(res => {
    //         //     //console.log(res.data)
    //         //     setCurrentAnswer(res.data)
    //         // }).catch(err => {
    //         //     console.log(err)
    //         // });
    //         // axios.get('/game/sessions/' + state.sessionID).then(res => {
    //         //     console.log(" --- Game Session Data ---")
    //         //     console.log(res.data)
    //         //     if (res.data.completed) {
    //         //         dispatch({type: "levelCompletedTriggered", payload: res.data})
    //         //     }
    //         //
    //         // }).catch(err => {
    //         //     console.log(err)
    //         // });
    //     }
    //
    // }, delay);

    // useEffect(() => {
    //     if (state.sessionID === "") {
    //         axios.post('/game/', nickname).then(res => {
    //             console.log(res.data)
    //             dispatch({type: "gameSessionIdCreated", payload: res.data})
    //         }).catch(err => {
    //             console.log(err)
    //         });
    //     }
    //     // if(state.sessionID != "" && !state.currentLevelStarted && !state.currentLevelCompleted && !state.currentLevelExists){
    //     //     checkLevel()
    //     // }
    //     // if(state.sessionID != "" && state.currentLevelStarted && state.currentLevelExists && !state.currentLevelCompleted){
    //     //     // loadRemoteComponent('/game/levels/level-'+ state.currentLevelId + '/ui').then((LevelContent) => {
    //     //     //     ReactDOM.render(<LevelContent state={state}/>, document.getElementById('levelContent'));
    //     //     // })
    //     // }
    //
    // }, [state])


    const startLevel = () => {
        setLoading(true);
        axios.post('/game/sessions/' + state.sessionID + '/start').then(res => {
            //console.log(res.data)
            dispatch({type: "levelStartedTriggered", payload: res.data})
            setLoading(false)
        }).catch(err => {
            console.log(err)
        });
    }

    const moveToNextLevel = () => {
        console.log("Checking if next level is available: " + state.nextLevelId)
        dispatch({type: "nextLevelTriggered", payload: state.nextLevelId})
    }

    // const checkLevel = () => {
    //     // This needs to go to the game controller to check which level are available to not depend on having the level exposed outside the cluster.
    //
    //     console.log("Checking if current level "+state.currentLevelId + " exists")
    //     axios.get('game/levels/level-' + state.currentLevelId).then(res => {
    //         console.log(res.data)
    //         dispatch({type: "levelCheckTriggered", payload: res.data})
    //
    //     }).catch(err => {
    //         console.log(err)
    //         dispatch({type: "levelCheckTriggered", payload: false})
    //     });
    // }

    function emitCloudEvent(button) {
        console.log("Button: " + button + " pressed! ")
        const cloudEvent = new CloudEvent({
            id: createMyGuid(),
            type: "GameEvent",
            source: "website",
            subject: "gameevent",
            data: {
                button: String(button),
                timestamp: Date.now().toString(),
                sessionId: state.sessionID
            },
        });
        console.log(" --- Cloud Event Data Sent ---")
        console.log(cloudEvent.data)

        const message = HTTP.binary(cloudEvent);
        //console.log("Sending Post to func!")
        // This needs to send to broker which needs to send to the right function level, based on the level which the user is
        axios.post('/default', message.body, {headers: message.headers}).then(res => {
            console.log("Broker response")
            console.log(res.headers)
            console.log(res.data)

        }).catch(err => {

            console.log(err)
            console.log(err.response.data.message)
            console.log(err.response.data)
        });

    }

    // //Add listener for keys
    // function handleEvents(event) {
    //     console.log(event.key);
    //     if(event.key != 'null' && event.key != "Alt" && event.key !="Meta" && event.key !="Shift" && event.key != "Backspace") {
    //         const cloudEvent = new CloudEvent({
    //             id: createMyGuid(),
    //             type: "KeyPressedEvent",
    //             source: "website",
    //             subject: "keypressed",
    //             data: {
    //                 key: String(event.key),
    //                 position: String(event.target.selectionStart),
    //                 timestamp: Date.now().toString(),
    //                 sessionId: state.sessionID
    //             },
    //         });
    //         console.log(" --- Cloud Event Data Sent ---")
    //         console.log(cloudEvent.data)
    //
    //         const message = HTTP.binary(cloudEvent);
    //         //console.log("Sending Post to func!")
    //         // This needs to send to broker which needs to send to the right function level, based on the level which the user is
    //         axios.post('/default', message.body, {headers: message.headers}).then(res => {
    //             // console.log("Broker response")
    //             // console.log(res.headers)
    //             // console.log(res.data)
    //
    //         }).catch(err => {
    //
    //             console.log(err)
    //             console.log(err.response.data.message)
    //             console.log(err.response.data)
    //         });
    //     }
    // }

    return (
        <motion.div
            exit="exit"
            animate="visible"
            initial="hidden"
            variants={pageVariants}
            onAnimationStart={pageAnimationStart}
            onAnimationComplete={pageAnimationComplete}
        >

            <div className={cn({
                ["page"]: true,
                ["game"]: true
            })}
            >
                <Header/>
                <section>

                    <h1>Play with us!</h1>

                    {state.landed && (
                        <div>
                            {!state.sessionID && (
                                <div>
                                    <h4>Enter your nickname:</h4> <input onChange={(e) => setNickname(e.target.value)}/><br/>
                                    <button onClick={newGame}>Let's Play</button>
                                </div>
                            )}
                            {state.sessionID && (
                                <div>
                                    <h4>SessionId: {state.sessionID} </h4>
                                    <h4>Player: {state.nickname} </h4>
                                    <h4>Level: {state.currentLevelId}</h4>



                                        {!state.currentLevelStarted && (
                                            <div>
                                                <Button main clickHandler={startLevel}
                                                        disabled={loading}>{loading ? 'Loading...' : 'Start Level'}</Button>
                                            </div>
                                        )}
                                        {state.currentLevelStarted && !state.currentLevelCompleted && state.currentLevelId == 1 && (
                                            <div>

                                                <Level1 state={state} dispatch={dispatch}/>
                                            </div>
                                        )}
                                        {state.currentLevelStarted && !state.currentLevelCompleted && state.currentLevelId == 2 && (
                                            <div>

                                                <Level2 state={state} dispatch={dispatch}/>
                                            </div>
                                        )}

                                        {state.currentLevelCompleted && (
                                            <div>
                                                Congratulations you completed the level!
                                                <Button main clickHandler={moveToNextLevel}
                                                        disabled={loading}>{loading ? 'Loading...' : 'Next Level'}</Button>
                                            </div>
                                        )}

                                </div>
                            )}

                        </div>

                    )}


                </section>
            </div>
        </motion.div>
    )
}

export default Game;
