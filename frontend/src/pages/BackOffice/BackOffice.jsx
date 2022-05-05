import React, {useEffect, useContext, useState} from "react";
import {motion} from "framer-motion"
import {useLocomotiveScroll} from 'react-locomotive-scroll';
import AppContext from '../../contexts/AppContext';
import Footer from '../../components/Footer/Footer'
import cn from 'classnames';
import Button from "../../components/Button/Button";
import SectionHero from '../../components/SectionHero/SectionHero'
import {useParams} from "react-router-dom";
import Leaderboard from "../../components/Leaderboard/Leaderboard";
import useInterval from "../../hooks/useInterval";
import axios from "axios";
import confetti from "canvas-confetti"
import {
    RSocketClient,
    JsonSerializer,
    IdentitySerializer
} from 'rsocket-core';
import RSocketWebSocketClient from 'rsocket-websocket-client';

function BackOffice() {
    const {currentSection, setCurrentSection, gameState, setGameState} = useContext(AppContext);
    let {nickname} = useParams();
    //scroll
    const {scroll} = useLocomotiveScroll();
    var rsocketClient
    const [score, setScore] = useState("")

    function route(value) {
        return String.fromCharCode(value.length) + value;
    }

    function rsocketConnect() {
        let host = location.host;
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
                url: 'ws://' + host +'/ws/'
            }),
        });

        // Open an RSocket connection to the server
        rsocketClient.connect().subscribe({
            onComplete: socket => {
                socket
                    .requestStream({
                        metadata: route('game-scores')
                    }).subscribe({
                    onComplete: () => console.log('complete'),
                    onError: error => {
                        console.log("Connection has been closed due to: " + error);
                    },
                    onNext: payload => {
                        console.log(payload);
                        let cloudEvent = payload.data;
                        setScore(score + "-> " + JSON.stringify(cloudEvent.data));
                        confetti();
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


    useEffect(() => {
        setCurrentSection("back-office");
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
        let url = '/game/leaderboard/'
        if(nickname !== ""){
            url = url + "?nickname=" + nickname
        }
        console.log("URL for leaderboard is: " + url)
        axios.get(url).then(res => {
            console.log(" --- Leaderboard ---")
            console.log(res.data)
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

    function confettiNow(){
        confetti()
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
                ["back-office"]: true,
                ["back-office--freeze"]: gameState != "active"
            })}
            >
                
                <SectionHero title="Leaderboard" center>
                  {gameState === "active" && (
                    <Button main clickHandler={freeze}> Freeze</Button>
                  )}
                  {gameState === "freeze" && (
                    <Button  clickHandler={restart}> Restart</Button>
                  )}
                </SectionHero>
                <section >

                    <div >

                            <div>
                                {leaderboard && leaderboard.Sessions && ((
                                    <Leaderboard leaderboard={leaderboard}></Leaderboard>
                                ))}
                            </div>

                        <h3>Score Events</h3>
                        <h4>{score}</h4>
                        <button onClick={rsocketConnect}>Listen to score events</button>


                    </div>
                </section>

                <Footer/>
            </div>
        </motion.div>
    )
}

export default BackOffice;
