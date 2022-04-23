import "./Level2.scss";
import React, {useState} from "react";
import cn from 'classnames';
import axios from "axios";
import Clock from "../Clock/Clock";
import Button from "../../components/Button/Button";
import TextField from "../../components/Form/TextField/TextField";
import {CountdownCircleTimer} from "react-countdown-circle-timer";


function Level2({state, dispatch}) {

    const [loading, setLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const [remainingTime, setRemainingTime] = useState(0)

    const [score, setScore] = useState()

    function nextLevel(){
        dispatch({type: "nextLevelTriggered", payload: state.currentLevelId + 1})
    }

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
            url: '/game/' + state.sessionID + '/level-' + state.currentLevelId + '/answer',
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
            <h2>Level 2</h2>
            {score && (
                <div className="Scores">
                    Your Score for this level is: {score.LevelScore}
                    <Button main clickHandler={nextLevel}>Play Next Level</Button>
                </div>

            )}
            {!isSent && (
                <div className="Questionnaire">
                    <CountdownCircleTimer
                        onComplete={sendAnswer}
                        onUpdate={remainingTime => setRemainingTime(remainingTime)}
                        isPlaying={!isSent}
                        duration={10}
                        colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                        colorsTime={[7, 5, 2, 0]}>
                        {({remainingTime}) => remainingTime}
                    </CountdownCircleTimer>
                    <div className="Question">
                        <div className="Question__Body">
                            <div className="Question__Number">1</div>
                            Insert HERE Generic Question?
                        </div>
                        <Button clickHandler={e => sendAnswer(true, false, false, false)}>OptionA: Answer A</Button><br/>
                        <Button clickHandler={e => sendAnswer(false, true, false, false)}>OptionB: Answer B</Button><br/>
                        <Button clickHandler={e => sendAnswer(false, false, true, false)}>OptionC: Answer C</Button><br/>
                        <Button clickHandler={e => sendAnswer(false, false, false, true)}>OptionD: Other</Button><br/>
                    </div>


                </div>
            )}

        </div>
    );

}

export default Level2;
