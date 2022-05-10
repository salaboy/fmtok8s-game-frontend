import "./Game.scss";
import React, {useEffect, useState, useContext, useReducer} from "react";
import {motion} from "framer-motion"
import {useLocomotiveScroll} from 'react-locomotive-scroll';
import AppContext from '../../contexts/AppContext';
import cn from 'classnames';

import axios from "axios";

import dockerNames from "docker-names"
import {gameStateReducer} from "../../reducers/GameStateReducer";
import GameContext from "../../contexts/GameContext";
import Button from "../../components/Button/Button";
import TextField from "../../components/Form/TextField/TextField";
import {TwitterShareButton} from "react-twitter-embed";

import Level1 from "../../components/Level1/Level1";
import Level2 from "../../components/Level2/Level2";
import Level3 from "../../components/Level3/Level3";
import Level4 from "../../components/Level4/Level4";
import GameComplete from "../../components/GameComplete/GameComplete";
import KubeconEULevel1 from "../../components/KubeconEULevel1/KubeconEULevel1";
import KubeconEULevel2 from "../../components/KubeconEULevel2/KubeconEULevel2";
import LevelScore from "../../components/LevelScore/LevelScore";
import PacmanLoader from "react-spinners/PacmanLoader";
import KubeconEULevel3 from "../../components/KubeconEULevel3/KubeconEULevel3";
import KubeconEULevel4 from "../../components/KubeconEULevel4/KubeconEULevel4";
import KubeconEULevel5 from "../../components/KubeconEULevel5/KubeconEULevel5";
import DevoxxLevel1 from "../../components/DevoxxLevel1/DevoxxLevel1";
import DevoxxLevel2 from "../../components/DevoxxLevel2/DevoxxLevel2";
import DevoxxLevel4 from "../../components/DevoxxLevel4/DevoxxLevel4";
import DevoxxLevel3 from "../../components/DevoxxLevel3/DevoxxLevel3";
import DevoxxLevel5 from "../../components/DevoxxLevel5/DevoxxLevel5";
import DemoLevel1 from "../../components/DemoLevel1/DemoLevel1";
import DemoLevel2 from "../../components/DemoLevel2/DemoLevel2";

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

    const [nickname, setNickname] = useState("")
    const [gameLevels, setGameLevels] = useState()
    // use lowercase on level keys to support env variables
    const levelsMap = new Map([["Level1", Level1], ["Level2", Level2], ["Level3", Level3],
        ["Level4", Level4], ["KubeconEULevel1", KubeconEULevel1], ["KubeconEULevel2", KubeconEULevel2],
        ["KubeconEULevel3", KubeconEULevel3], ["KubeconEULevel4", KubeconEULevel4], ["KubeconEULevel5", KubeconEULevel5],
        ["DevoxxLevel1", DevoxxLevel1], ["DevoxxLevel2", DevoxxLevel2], ["DevoxxLevel3", DevoxxLevel3],
        ["DevoxxLevel4", DevoxxLevel4], ["DevoxxLevel5", DevoxxLevel5], ["DemoLevel1", DemoLevel1],["DemoLevel2", DemoLevel2],
        ["End", GameComplete]]);


    function DynamicLevel(props) {
        const SpecificLevel = levelsMap.get(gameLevels[props.level].componentName)
        return <SpecificLevel levelName={gameLevels[props.level].name} levelNumber={props.level}
                              functionName={gameLevels[props.level].functionName} state={props.state}
                              dispatch={props.dispatch}/>
    }

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


    function newGame() {
        if (loading) {
            return;
        }
        setLoading(true);
        if (nickname === "") {
            console.log("nickname cannot be empty")
        }
        if (state.sessionID === "") {
            axios.post('/game/' + nickname).then(res => {
                console.log(res.data)
                dispatch({type: "gameSessionIdCreated", payload: res.data})
                setUser(nickname);
                axios.get('/game/config').then(res => {
                    console.log("Config loaded")
                    console.log(res.data.levels)
                    setGameLevels(res.data.levels);
                    setLoading(false)
                }).catch(err => {
                    console.log(err)
                });

            }).catch(err => {
                console.log(err)
            });
        }

    }


    const startLevel = () => {
        dispatch({type: "levelStartedTriggered", payload: {}})
    }

    const moveToNextLevel = () => {
        // console.log("Checking if next level is available: " + state.nextLevelId)
        dispatch({type: "nextLevelTriggered", payload: state.currentLevelId + 1})
    }


    function generatePlayerName() {
        setNickname(dockerNames.getRandomName(true))
    }


    function notNickname() {
        return nickname == "";
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

                <section>

                    <h2 className="mainH1">#Knative Functions <br/> Quiz Game</h2>


                    {state.landed && (
                        <div>
                            {!state.sessionID && (
                                <div className="Card">
                                    <div className="Card__Header">
                                        Generate your nickname to start
                                    </div>
                                    <div className="Card__Body">
                                        <TextField inputProps={
                                            {readOnly: true,}
                                        } label={""} placeholder="Click the button to generate a nickname"
                                                   value={nickname}></TextField>
                                        <Button inverted clickHandler={generatePlayerName}>Generate Player Name</Button>
                                    </div>
                                    <div className="Card__Actions">
                                        <Button main block clickHandler={newGame}
                                                disabled={loading || notNickname()}>{loading ? 'Loading...' : 'Let\'s Play!'}</Button>
                                    </div>
                                </div>
                            )}
                            {state.sessionID && (
                                <div className="Card">
                                    <div className="Card__Header">
                                        {!state.currentLevelStarted && (gameLevels && gameLevels[state.currentLevelId].name != "End") && (
                                            <>
                                                {state.nickname} <br/>
                                                Ready to play?

                                            </>
                                        )}
                                        {state.currentLevelStarted && (
                                            <>
                                                {gameLevels[state.currentLevelId].name}

                                            </>
                                        )}
                                        {gameLevels && gameLevels[state.currentLevelId].name == "End" && (
                                            <>
                                              {state.nickname} Congratulations!
                                            </>
                                        )
                                        }

                                    </div>
                                    <div className="Card__Body">

                                        {gameLevels && gameLevels[state.currentLevelId].name == "End" && (
                                            <GameComplete state={state}/>
                                        )
                                        }
                                        {!state.currentLevelStarted && (gameLevels && gameLevels[state.currentLevelId].name != "End") && (
                                            <>
                                                When you click start you will have 10 seconds to answer. Hurry up, as the time you save gives you points!

                                            </>
                                        )}
                                        {state.currentLevelStarted && !state.currentLevelLoading && !state.currentLevelCompleted && (
                                            <>
                                                <DynamicLevel level={state.currentLevelId} state={state}
                                                              dispatch={dispatch}/>
                                            </>
                                        )}

                                        {state.currentLevelLoading && !state.currentLevelCompleted && (
                                            <>
                                                <div className="Loader">
                                                    <PacmanLoader color={"#1c0528"} loading={true} size={30}/>
                                                </div>
                                            </>
                                        )}

                                        {state.currentLevelCompleted && (
                                            <>
                                                <LevelScore score={state.currentLevelScore}/>
                                            </>
                                        )}


                                    </div>
                                    <div className="Card__Actions">
                                        {!state.currentLevelStarted && gameLevels && gameLevels[state.currentLevelId].name != "End" && (
                                            <>
                                                <Button block main clickHandler={startLevel}
                                                        disabled={loading}>{loading ? 'Loading...' : 'Start ' + gameLevels[state.currentLevelId].name}</Button>
                                            </>
                                        )}
                                        {state.currentLevelCompleted && (
                                            <>
                                                <Button block main clickHandler={moveToNextLevel}
                                                        disabled={loading}>{loading ? 'Loading...' : 'Next Level'}</Button>
                                            </>
                                        )}

                                        {state.currentLevelLoading && !state.currentLevelCompleted && (
                                          <>
                                              <Button block main disabled={true}>Loading...</Button>
                                          </>
                                        )}

                                        {/*{gameLevels && gameLevels[state.currentLevelId].name == "End" && (*/}
                                        {/*  <Button main block link={`back-office/${state.nickname}`}>Go to the Leaderboard</Button>*/}
                                        {/*)*/}
                                        {/*}*/}

                                        {gameLevels && gameLevels[state.currentLevelId].name == "End" && (
                                            <>
                                              <p className="p-s">

                                                  Tweet your score to participate on the <strong>#Knative</strong> raffle for some swag and books!


                                                  <br/><br/>
                                                  <TwitterShareButton
                                                      url={'https://knative.dev'}
                                                      options={{
                                                          text: 'My Quiz Game Score (as ' + state.nickname + ') was ' + state.accumulatedScore + ' 🥳 #devoxxuk #knative  #bringbackthefunc',
                                                          via: 'KnativeProject',
                                                          size: "large",
                                                          height: 80
                                                      }}
                                                  />


                                              </p>
                                            </>
                                        )
                                        }



                                    </div>


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
