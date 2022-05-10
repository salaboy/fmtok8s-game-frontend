import "./DemoLevel2.scss";
import React, {useEffect, useState} from "react";
import cn from 'classnames';
import axios from "axios";
import Button from "../../components/Button/Button";
import {CountdownCircleTimer} from "react-countdown-circle-timer";

function DemoLevel2({levelNumber, levelName, functionName, state, dispatch}) {

    const [remainingTime, setRemainingTime] = useState(0)

    const [counter, setCounter] = useState(0);
    const [optionA, setOptionA] = useState(false);
    const [optionB, setOptionB] = useState(false);
    const [optionC, setOptionC] = useState(false);
    const [optionD, setOptionD] = useState(false);

    function clickA() {
        setOptionA(true);
    }

    function clickB() {
        setOptionB(true);
    }

    function clickC() {
        setOptionC(true);
    }

    function clickD() {
        setOptionD(true);
    }


    function sendAnswer() {
        if (state.currentLevelLoading) {
            return;
        }
        state.currentLevelLoading = true
        axios({
            method: "post",
            url: '/game/' + functionName + '/answer',
            data: {
                player: state.nickname,
                sessionId: state.sessionID,
                optionA: optionA,
                optionB: optionB,
                optionC: optionC,
                optionD: optionD,

            },
        }).then(res => {
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

            {!state.currentLevelLoading && (
                <div className="Questionnaire">
                    <div className="Timer">
                        <CountdownCircleTimer
                            onComplete={sendAnswer}
                            onUpdate={remainingTime => setRemainingTime(remainingTime)}
                            isPlaying={!state.currentLevelLoading}
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
                            <div className="Question__Number">{levelNumber}</div>
                            Make sure that all the buttons are pressed before the time runs out!
                        </div>
                        <div className="Answer">
                            <Button inline disabled={optionA} clickHandler={clickA}>Press A</Button>
                            <Button inline disabled={optionB} clickHandler={clickB}>Press B</Button>
                            <Button inline disabled={optionC} clickHandler={clickC}>Press C</Button>
                            <Button inline disabled={optionD} clickHandler={clickD}>Press D</Button>
                        </div>

                    </div>

                </div>
            )}

        </div>
    );

}

export default DemoLevel2;
