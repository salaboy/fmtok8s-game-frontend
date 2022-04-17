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
import {
    RSocketClient,
    JsonSerializer,
    IdentitySerializer
} from 'rsocket-core';
import RSocketWebSocketClient from 'rsocket-websocket-client';

import {gameStateReducer} from "../../reducers/GameStateReducer";
import GameContext from "../../contexts/GameContext";
import Button from "../../components/Button/Button";
import TextField from "../../components/Form/TextField/TextField";

import Level1 from "../../components/Level1/Level1";
import Level2 from "../../components/Level2/Level2";

// Short logic description
// 1) Create a game session: call POST /game/ to create a new session
// 2) Add the session to the gameStateReducer, check if there is a session always in state
// 3) If there is a session, check if the current level exist by querying the health endpoints of the function using the gameInfo levelId
// 4) If the level is available enable the start level button
// 5) wait for the state of the level change to completed
// 6) Show move to next level button, move to 3, where first we need to check if the level exists or not


function Game() {
    const {currentSection, setCurrentSection, setUser, user} = useContext(AppContext);

    const {gameState} = useContext(GameContext)
    const [state, dispatch] = useReducer(gameStateReducer, gameState)
    const [loading, setLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    let [delay, setDelay] = useState(4000);
    var rsocketClient

    const [nickname, setNickname] = useState("")
    const [message, setMessage] = useState("")

    let externalIP = window._env_.EXTERNAL_IP

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


    function createMyGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function rsocketConnect(){
        // Creates an RSocket client based on the WebSocket network protocol
        if(externalIP == ""){
            externalIP = "localhost"
        }
        rsocketClient = new RSocketClient({
            serializers: {
                data: JsonSerializer,
                metadata: IdentitySerializer
            },
            setup: {
                keepAlive: 60000,
                lifetime: 180000,
                dataMimeType: 'application/json',
                metadataMimeType: 'message/x.rsocket.routing.v0',
            },
            transport: new RSocketWebSocketClient({
                url: 'ws://'+externalIP+':9000'
            }),
        });

        // Open an RSocket connection to the server
        rsocketClient.connect().subscribe({
            onComplete: socket => {
                socket
                    .requestStream({
                        metadata: route('infinite-stream')
                    }).subscribe({
                    onComplete: () => console.log('complete'),
                    onError: error => {
                        console.log("Connection has been closed due to: " + error);
                    },
                    onNext: payload => {
                        console.log(payload);
                       setMessage(message + "-> " + JSON.stringify(payload));
                    },
                    onSubscribe: subscription => {
                        subscription.request(1000000);
                    },
                });
            },
            onError: error => {
                console.log("RSocket connection refused due to: " + error);
            },
            onSubscribe: cancel => {
                /* call cancel() to abort */
            }
        });
    }

    function route(value) {
        return String.fromCharCode(value.length) + value;
    }

    function newGame() {
        if (state.sessionID === "") {
            axios.post('/game/' + nickname).then(res => {
                console.log(res.data)
                dispatch({type: "gameSessionIdCreated", payload: res.data})
                setUser(nickname);
            }).catch(err => {
                console.log(err)
            });
        }

    }


    const startLevel = () => {
        setLoading(true);
        axios.post('/game/' + state.sessionID + '/level-' + state.currentLevelId + '/start').then(res => {
            console.log(res.data)
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
                                <div className="Card">

                                    <TextField label={"Enter your nickname:"} changeHandler={(e) => setNickname(e.target.value)}></TextField>

                                    <Button clickHandler={newGame}>Let's Play</Button>
                                </div>
                            )}
                            {state.sessionID && (
                                <div className="Card">
                                    {/*<h4>SessionId: {state.sessionID} </h4>*/}
                                    {!state.currentLevelStarted && (
                                      <>
                                      <h4>Welcome <strong> {state.nickname} </strong> </h4>
                                      <br/>
                                      </>
                                    )}




                                        {!state.currentLevelStarted && (
                                            <div>
                                                <Button main clickHandler={startLevel}
                                                        disabled={loading}>{loading ? 'Loading...' : 'Start Level ' + state.currentLevelId}</Button>
                                            </div>
                                        )}
                                        {state.currentLevelStarted && !state.currentLevelCompleted && state.currentLevelId == 1 && (
                                            <>

                                                <Level1 state={state} dispatch={dispatch}/>
                                            </>
                                        )}
                                        {state.currentLevelStarted && !state.currentLevelCompleted && state.currentLevelId == 2 && (
                                            <>

                                                <Level2 state={state} dispatch={dispatch}/>
                                            </>
                                        )}

                                        {state.currentLevelCompleted && (
                                            <>
                                                Congratulations you completed the level!
                                                <Button main clickHandler={moveToNextLevel}
                                                        disabled={loading}>{loading ? 'Loading...' : 'Next Level'}</Button>
                                            </>
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
