import "./Level3.scss";
import React, {useState} from "react";
import cn from 'classnames';
import axios from "axios";
import Clock from "../Clock/Clock";
import Button from "../../components/Button/Button";

import {CountdownCircleTimer} from 'react-countdown-circle-timer'


function Level3({state, dispatch}) {

    const [loading, setLoading] = useState(false);
    const [counter, setCounter] = useState(0);
    const [isSent, setIsSent] = useState(false);
    const [score, setScore] = useState()

    function clickMe() {
        setCounter(counter + 1)
    }

    function nextLevel() {
        dispatch({type: "nextLevelTriggered", payload: state.currentLevelId + 1})
    }

//Send answer to a specific question/level
    function sendAnswer() {
        if (loading) {
            return;
        }
        setLoading(true);
        setIsSent(true);
        console.log("Sending answers: [" + counter +  " ] to level id: " + state.currentLevelId)
        axios({
            method: "post",
            url: '/game/' + state.sessionID + '/level-' + state.currentLevelId + '/answer',
            data: {
                sessionId: state.sessionID,
                optionA: counter,
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
            <h2>Level 3</h2>
            {score && (
                <div className="Scores">

                    Your Score for this level is: {score.LevelScore}
                    {/*<Button main clickHandler={nextLevel}>Play Next Level</Button>
                    */}
                    Game Completed!
                </div>

            )}
            {!isSent && (
                <div className="Questionnaire">
                    <CountdownCircleTimer
                        onComplete={sendAnswer}
                        isPlaying
                        duration={10}
                        colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                        colorsTime={[7, 5, 2, 0]}>
                        {({remainingTime}) => remainingTime}
                    </CountdownCircleTimer>
                    <div className="Question">
                        <div className="Question__Body">
                            <div className="Question__Number">1</div>
                            How many times can you click the following button in 10 seconds?
                        </div>
                        <Button main clickHandler={clickMe}>Click Me!</Button>
                        <h4>{counter}</h4>

                    </div>
                </div>
            )}


        </div>
    );

}

export default Level3;
