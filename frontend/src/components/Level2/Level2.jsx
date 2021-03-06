import "./Level2.scss";
import React, {useState} from "react";
import cn from 'classnames';
import axios from "axios";
import Button from "../../components/Button/Button";
import {CountdownCircleTimer} from "react-countdown-circle-timer";
import PacmanLoader from "react-spinners/PacmanLoader";


function Level2({levelName, functionName, state, dispatch}) {

    const [loading, setLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const [remainingTime, setRemainingTime] = useState(0)

    const [score, setScore] = useState()


    //Send answer to a specific question/level
    function sendAnswer(optionA, optionB, optionC, optionD) {
        if (loading) {
            return;
        }
        console.log("Sending answers: [" + optionA + ", " + optionB + ", " + optionC + ", " + optionD + " ] with remaining time: " + remainingTime + "'s to level id: " + state.currentLevelId)
        setLoading(true);
        setIsSent(true)

        axios({
            method: "post",
            url: '/game/'  + functionName + '/answer',
            data: {
                sessionId: state.sessionID,
                optionA: optionA,
                optionB: optionB,
                optionC: optionC,
                optionD: optionD,
                remainingTime: remainingTime,
            },
        }).then(res => {
            console.log("Answer response:")
            console.log(res.headers)
            console.log(res.data)
            setScore(res.data)
            setLoading(false);
            dispatch({type: "levelCompletedTriggered", payload: res.data})
        }).catch(err => {

            console.log(err)
            console.log(err.response.data.message)
            console.log(err.response.data)
        });
    }

    return (
        <div className={cn({
            ["Level"]: true,
        })}>

            {isSent && !score && (
                <>
                <div className="Loader">
                    <PacmanLoader color={"#1c0528"} loading={loading} size={30}/>
                </div>
                </>
            )}

            {!isSent && (
                <div className="Questionnaire">
                    <div className="Timer">
                        <CountdownCircleTimer
                            onComplete={sendAnswer}
                            onUpdate={remainingTime => setRemainingTime(remainingTime)}
                            isPlaying={!isSent}
                            duration={10}
                            colors={['#ce5fff', '#FFC17D', '#FFDA7D', '#FF907D']}
                            colorsTime={[7, 5, 2, 0]}
                            size={60}
                        >
                            {({remainingTime}) => remainingTime}
                        </CountdownCircleTimer>
                    </div>
                    <div className="Question">
                        <div className="Question__Body">
                            <div className="Question__Number">1</div>
                            Insert HERE Generic Question?
                        </div>
                        <div className="Answer">
                            <Button small block clickHandler={e => sendAnswer(true, false, false, false)}><span
                                className="option">A.</span> Answer A</Button>
                            <Button small block clickHandler={e => sendAnswer(false, true, false, false)}><span
                                className="option">B.</span> Answer B</Button>
                            <Button small block clickHandler={e => sendAnswer(false, false, true, false)}><span
                                className="option">C.</span> Answer C</Button>
                            <Button small block clickHandler={e => sendAnswer(false, false, false, true)}><span
                                className="option">D.</span> Other</Button>
                        </div>
                    </div>


                </div>
            )}

        </div>
    );

}

export default Level2;
