import React, {useEffect, useContext, Suspense, lazy, useState} from "react";
import {motion} from "framer-motion"
import {useLocomotiveScroll} from 'react-locomotive-scroll';
import AppContext from '../../contexts/AppContext';
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import cn from 'classnames';
import SectionHero from '../../components/SectionHero/SectionHero'
import BackOfficeNav from "../../components/BackOfficeNav/BackOfficeNav";
import {useParams} from "react-router-dom";
import Leaderboard from "../../components/Leaderboard/Leaderboard";
import useInterval from "../../hooks/useInterval";
import axios from "axios";


function BackOffice() {
    const {currentSection, setCurrentSection} = useContext(AppContext);
    let {subSection} = useParams();
    //scroll
    const {scroll} = useLocomotiveScroll();

    // let ticketsEnabled = window._env_.FEATURE_TICKETS_ENABLED
    // let c4pEnabled = window._env_.FEATURE_C4P_ENABLED
    //
    // const TicketsFeature = React.useMemo( () => lazy(() => import('../../components/TicketsQueue/TicketsQueue')), []);


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
                ["back-office"]: true
            })}
            >
                <Header/>
                <SectionHero title="Welcome Conference Organizers"/>
                <section className="back-office__Layout">

                    <div className="back-office__Layout__Nav">
                        <BackOfficeNav currentSubSection={subSection}/>
                    </div>
                    <div className="back-office__Layout__Content">
                        {(subSection === "features" || subSection === undefined) && (
                            <div>

                                <h2>Leaderboard</h2>
                                {leaderboard && leaderboard.Sessions && ((
                                    <Leaderboard leaderboard={leaderboard}></Leaderboard>
                                ))}
                            </div>
                        )}
                        {/*{(subSection === "proposals" && c4pEnabled) &&*/}
                        {/*  <>*/}
                        {/*    <h2>Proposals to Review </h2>*/}
                        {/*    <Suspense fallback='<div>Loading...</div>'>*/}
                        {/*      <ProposalsFeature></ProposalsFeature>*/}
                        {/*    </Suspense>*/}
                        {/*  </>*/}
                        {/*}*/}


                    </div>
                </section>

                <Footer/>
            </div>
        </motion.div>
    )
}

export default BackOffice;
