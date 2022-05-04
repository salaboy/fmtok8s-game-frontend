import "./Level3.scss";
import React, {useState} from "react";
import cn from 'classnames';
import axios from "axios";
import Button from "../../components/Button/Button";

import {CountdownCircleTimer} from 'react-countdown-circle-timer'
import PacmanLoader from "react-spinners/PacmanLoader";


function Level3({levelName, functionName, state, dispatch}) {

    const [loading, setLoading] = useState(false);
    const [counter, setCounter] = useState(0);
    const [isSent, setIsSent] = useState(false);
    const [score, setScore] = useState()

    function clickMe() {
        setCounter(counter + 1)
    }



//Send answer to a specific question/level
    function sendAnswer() {
        if (loading) {
            return;
        }
        setLoading(true);
        setIsSent(true);
        console.log("Sending answers: [" + counter + " ] to level id: " + state.currentLevelId)
        axios({
            method: "post",
            url: '/game/' + functionName + '/answer',
            data: {
                sessionId: state.sessionID,
                counter: counter,
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
                            How many times can you click the following button in 10 seconds?
                        </div>
                        <div className="Answer">
                            <Button inline clickHandler={clickMe}>Click Me!</Button>
                            <div className="Counter">{counter}</div>
                        </div>

                    </div>
                </div>
            )}


        </div>
    );

}

export default Level3;
