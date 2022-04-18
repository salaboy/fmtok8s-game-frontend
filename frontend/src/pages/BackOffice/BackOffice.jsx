import React, {useEffect, useContext, Suspense, lazy, useState} from "react";
import {motion} from "framer-motion"
import {useLocomotiveScroll} from 'react-locomotive-scroll';
import AppContext from '../../contexts/AppContext';
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import cn from 'classnames';
import Button from "../../components/Button/Button";
import SectionHero from '../../components/SectionHero/SectionHero'
import BackOfficeNav from "../../components/BackOfficeNav/BackOfficeNav";
import {useParams} from "react-router-dom";
import Leaderboard from "../../components/Leaderboard/Leaderboard";
import useInterval from "../../hooks/useInterval";
import axios from "axios";
import {
    RSocketClient,
    JsonSerializer,
    IdentitySerializer
} from 'rsocket-core';
import RSocketWebSocketClient from 'rsocket-websocket-client';

function BackOffice() {
    const {currentSection, setCurrentSection, gameState, setGameState} = useContext(AppContext);
    let {subSection} = useParams();
    //scroll
    const {scroll} = useLocomotiveScroll();
    var rsocketClient
    const [message, setMessage] = useState("")
    let externalIP = window._env_.EXTERNAL_IP

    // let ticketsEnabled = window._env_.FEATURE_TICKETS_ENABLED
    // let c4pEnabled = window._env_.FEATURE_C4P_ENABLED
    //
    // const TicketsFeature = React.useMemo( () => lazy(() => import('../../components/TicketsQueue/TicketsQueue')), []);


    function route(value) {
        return String.fromCharCode(value.length) + value;
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


    useEffect(() => {
        setCurrentSection("back-office");
        if (scroll) {
            scroll.destroy();
            scroll.init();
            if (subSection) {
                scroll.scrollTo(".back-office__Layout", {duration: 0, disableLerp: true})
            }
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
        axios.get('/game/leaderboard/').then(res => {
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
                <Header/>
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

                        <h3>Messages</h3>
                        <h4>{message}</h4>
                        <button onClick={rsocketConnect}>Rsocketing!</button>


                    </div>
                </section>

                <Footer/>
            </div>
        </motion.div>
    )
}

export default BackOffice;
