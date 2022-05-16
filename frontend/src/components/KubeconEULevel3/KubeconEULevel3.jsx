import "./KubeconEULevel3.scss";
import React, {useState} from "react";
import cn from 'classnames';
import axios from "axios";
import Button from "../../components/Button/Button";
import {CountdownCircleTimer} from "react-countdown-circle-timer";

function KubeconEULevel3({levelNumber, levelName, functionName, state, dispatch}) {

    const [remainingTime, setRemainingTime] = useState(0)

    //Send answer to a specific question/level
    function sendAnswer(optionA, optionB, optionC, optionD) {
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
                remainingTime: remainingTime,
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
                            How do you say octopus in Spanish?
                        </div>
                        <div className="Answer">
                        <Button small block clickHandler={e => sendAnswer(true, false, false, false)}><span className="option">A.</span> Ostion</Button>
                        <Button small block clickHandler={e => sendAnswer(false, true, false, false)}><span className="option">B.</span> Pulpo</Button>
                        <Button small block clickHandler={e => sendAnswer(false, false, true, false)}><span className="option">C.</span> Informer</Button>
                        <Button small block clickHandler={e => sendAnswer(false, false, false, true)}><span className="option">D.</span> Almeja</Button>
                        </div>

                    </div>

                </div>
            )}

        </div>
    );

}

export default KubeconEULevel3;
