import "./KubeconEULevel4.scss";
import React, {useState} from "react";
import cn from 'classnames';
import axios from "axios";
import Button from "../../components/Button/Button";
import {CountdownCircleTimer} from "react-countdown-circle-timer";

function KubeconEULevel4({levelNumber, levelName, functionName, state, dispatch}) {

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
            console.log("Answer response:")
            console.log(res.headers)
            console.log(res.data)
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
                            What is the “Camino de Santiago”?
                        </div>
                        <div className="Answer">
                        <Button small block clickHandler={e => sendAnswer(true, false, false, false)}><span className="option">A.</span> Secret underground tunnels that wealthy only get to use</Button>
                        <Button small block clickHandler={e => sendAnswer(false, true, false, false)}><span className="option">B.</span> Large network of ancient pilgrim routes in Europe</Button>
                        <Button small block clickHandler={e => sendAnswer(false, false, true, false)}><span className="option">C.</span> Ancient ruins built out of old Spanish gold</Button>
                        <Button small block clickHandler={e => sendAnswer(false, false, false, true)}><span className="option">D.</span> A CICD pipeline running on a compromised public runner</Button>
                        </div>

                    </div>

                </div>
            )}

        </div>
    );

}

export default KubeconEULevel4;
