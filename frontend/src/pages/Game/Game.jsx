import React, {useEffect, useState, useContext, useRef, useReducer} from "react";
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


// Short logic description
// 1) Create a game session: call POST /game/ to create a new session
// 2) Add the session to the gameStateReducer, check if there is a session always in state
// 3) If there is a session, check if the current level exist by querying the health endpoints of the function using the gameInfo levelId
// 4) If the level is available enable the start level button
// 5) wait for the state of the level change to completed
// 6) Show move to next level button, move to 3, where first we need to check if the level exists or not


function Game() {
    const {currentSection, setCurrentSection} = useContext(AppContext);

    const {gameState} = useContext(GameContext)
    const [state, dispatch] = useReducer(gameStateReducer, gameState)
    const [loading, setLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    let [delay, setDelay] = useState(4000);


    function handleDelayChange(e) {
        setDelay(Number(e.target.value));
    }

    const [question, setQuestion] = useState("");
    const [currentAnswer, setCurrentAnswer] = useState("");

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

    useEventListener('keyup', handleEvents)

    function createMyGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }


    useInterval(() => {
        if (state.sessionID != "" && state.currentLevelStarted && !state.currentLevelCompleted) {
            axios.get('level-' + state.currentLevelId + '/answerBySession/'+ state.sessionID).then(res => {
                //console.log(res.data)
                setCurrentAnswer(res.data)
            }).catch(err => {
                console.log(err)
            });
            axios.get('/game/sessions/' + state.sessionID).then(res => {
                console.log(" --- Game Session Data ---")
                console.log(res.data)
                if (res.data.completed) {
                    dispatch({type: "levelCompletedTriggered", payload: res.data})
                }

            }).catch(err => {
                console.log(err)
            });
        }

    }, delay);

    useEffect(() => {
        if (state.sessionID === "" ) {

            axios.post('/game').then(res => {
                //console.log(res.data)
                dispatch({type: "gameSessionIdCreated", payload: res.data})

            }).catch(err => {
                console.log(err)
            });
        }
        if(state.sessionID != "" && !state.currentLevelStarted && !state.currentLevelCompleted && !state.currentLevelExists){
            checkLevel()
        }
        if(state.sessionID != "" && state.currentLevelStarted && question == "" && state.currentLevelExists && !state.currentLevelCompleted){
            axios.get('level-' + state.currentLevelId + '/question').then(res => {
                //console.log(res.data)
                setQuestion(res.data)
            }).catch(err => {
                console.log(err)
            });
        }

    }, [state, question])


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

    const checkLevel = () => {
        console.log("Checking if current level "+state.currentLevelId + " exists")
        axios.get('level-' + state.currentLevelId + '/actuator/health').then(res => {
            console.log(res.data)
            dispatch({type: "levelCheckTriggered", payload: true})

        }).catch(err => {
            console.log(err)
            dispatch({type: "levelCheckTriggered", payload: false})
        });
    }

    //Add listener for keys
    function handleEvents(event) {
        console.log(event.key);
        if(event.key != 'null' && event.key != "Alt" && event.key !="Meta" && event.key !="Shift" && event.key != "Backspace") {
            const cloudEvent = new CloudEvent({
                id: createMyGuid(),
                type: "KeyPressedEvent",
                source: "website",
                subject: "keypressed",
                data: {
                    key: String(event.key),
                    position: String(event.target.selectionStart),
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
                // console.log("Broker response")
                // console.log(res.headers)
                // console.log(res.data)

            }).catch(err => {

                console.log(err)
                console.log(err.response.data.message)
                console.log(err.response.data)
            });
        }
    }

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
                    <p></p>

                    {state.landed && (
                        <div>
                            <h4>SessionId: {state.sessionID} </h4>
                            <h4>Level: {state.currentLevelId}</h4>
                            <h4>Level Exists: {String(state.currentLevelExists)} </h4>
                            {!state.currentLevelExists && (
                                <Button main clickHandler={checkLevel}
                                        disabled={loading}>{loading ? 'Loading...' : 'Check for new Level'}</Button>
                            )}
                            {state.currentLevelExists && (
                                <div>
                                    <h4>Started: {String(state.currentLevelStarted)}</h4>
                                    {!state.currentLevelStarted && state.currentLevelExists && (
                                        <div>
                                            <Button main clickHandler={startLevel}
                                                    disabled={loading}>{loading ? 'Loading...' : 'Start Level'}</Button>
                                        </div>
                                    )}
                                    {state.currentLevelStarted && (
                                        <div>
                                            <h4>Completed: {String(state.currentLevelCompleted)}</h4>
                                            <h4>Question: {question}</h4>
                                            Answer: <input id="inputText"/>
                                            <h4>Current Answer in the server: {currentAnswer}</h4>
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
