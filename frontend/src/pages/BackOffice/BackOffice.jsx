import React, {useEffect, useContext, useState} from "react";
import {motion} from "framer-motion"
import {useLocomotiveScroll} from 'react-locomotive-scroll';
import AppContext from '../../contexts/AppContext';
import Footer from '../../components/Footer/Footer'
import cn from 'classnames';
import SectionHero from '../../components/SectionHero/SectionHero'
import {useParams} from "react-router-dom";
import Leaderboard from "../../components/Leaderboard/Leaderboard";
import useInterval from "../../hooks/useInterval";
import axios from "axios";
import confetti from "canvas-confetti"
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import {rsocketClientInstance} from "../../hooks/rsocket";


function BackOffice() {
    const {currentSection, setCurrentSection, gameState, setGameState} = useContext(AppContext);
    let {nickname} = useParams();
    //scroll
    const {scroll} = useLocomotiveScroll();

    const [online, setOnline] = useState(false)
    const [connected, setConnected] = useState(false)

    let host = location.host;
    // let host = "game-frontend.default.34.116.208.197.sslip.io"

    function route(value) {
        return String.fromCharCode(value.length) + value;
    }


    function toastHardcoded() {
        toast(<div>
            🥳 <strong>amazing_snyder7</strong> <br/>
            Scored 14 points <br/>
            in level kubeconeu-question-3 !
        </div>, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        })
    }


    function rsocketConnect() {
        console.log("Connected: " + connected)
        if(!connected) {
            console.log("Connecting to Rsocket stream on host: " + host)
            // Open an RSocket connection to the server

            setConnected(true)
            rsocketClientInstance.socket
                .requestStream({
                    metadata: route('game-scores')
                }).subscribe({
                onComplete: (response) => {
                    console.log('complete: ' + response)
                },
                onError: error => {
                    console.log("Connection has been closed due to: " + error);
                },
                onNext: payload => {
                    let cloudEvent = payload.data;

                    console.log("Toasting CE NODE: " + JSON.stringify(cloudEvent.data.node))
                    toast(<div>
                        🥳 <strong>{cloudEvent.data.node.Player}</strong> <br/>
                        Scored {cloudEvent.data.node.LevelScore} points <br/>
                        in level {cloudEvent.data.node.Level} !
                    </div>, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                    confetti();
                },
                onSubscribe: subscription => {
                    subscription.request(2147483646);
                },
            });

        }
    }

    useEffect(() => {
        console.log("socket = " + rsocketClientInstance.socket)
        if (rsocketClientInstance.socket) {
            setOnline(true)
            rsocketConnect()
        }else{
            console.log("rsocket is still null")
        }
    }, rsocketClientInstance.socket);

    useEffect(() => {
        setCurrentSection("leaderboard");
        if (scroll) {
            scroll.destroy();
            scroll.init();
        }
    }, [scroll]);

    //Handle advanced page transitions
    const pageVariants = {
        visible: {opacity: 1},
        hidden: {opacity: 1},
        exit: {opacity: 1, transition: {duration: .2}}
    }
    const pageAnimationStart = e => {
    };
    const pageAnimationComplete = e => {
    };

    let [delay, setDelay] = useState(1000);
    const [leaderboard, setLeaderboard] = useState([]);

    useInterval(() => {
        let url = '/game/scores/'
        if (nickname && nickname !== "") {
            url = url + "?nickname=" + nickname
        }
        axios.get(url).then(res => {
            setLeaderboard(res.data);
        }).catch(err => {
            console.log(err)
        });
    }, delay);


    function freeze() {
        setGameState("freeze")
    }

    function restart() {
        setGameState("active")
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
                ["leaderboard"]: true,
                ["leaderboard--freeze"]: gameState != "active"
            })}
            >

                <SectionHero smaller title="Leaderboard" center>
                    {online && (
                        <h5>Online</h5>
                    )}
                    {!online && (
                        <h5>Offline</h5>
                    )}
                    {/*{gameState === "active" && (*/}
                    {/*  <Button main clickHandler={freeze}> Freeze</Button>*/}
                    {/*)}*/}
                    {/*{gameState === "freeze" && (*/}
                    {/*  <Button  clickHandler={restart}> Restart</Button>*/}
                    {/*)}*/}
                </SectionHero>
                <section className="--small">

                    <div>
                        <ToastContainer/>
                        {/*<Button main clickHandler={toastHardcoded}> Toast</Button>*/}
                        <div>
                            {leaderboard && leaderboard.Sessions && ((
                                <Leaderboard leaderboard={leaderboard}></Leaderboard>
                            ))}
                        </div>
                    </div>
                </section>

                <Footer/>
            </div>
        </motion.div>
    )
}

export default BackOffice;
