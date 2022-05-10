import "./DevoxxLevel4.scss";
import React, {useEffect, useState} from "react";
import cn from 'classnames';
import axios from "axios";
import Button from "../../components/Button/Button";
import {CountdownCircleTimer} from "react-countdown-circle-timer";
import TextField from "../Form/TextField/TextField";

function DevoxxLevel4({levelNumber, levelName, functionName, state, dispatch}) {
    const [remainingTime, setRemainingTime] = useState(0)
    const [passcode, setPasscode] = useState("")

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
                textual: passcode,
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
                            Type
                            <br/>
                            <strong>00112233445566778899</strong><br/>
                            <strong>x</strong><br/>
                            <strong>99887766554433221100</strong>
                            <br/>
                            in the following text box.
                        </div>
                        <div className="Answer">
                            <TextField onPaste={(e)=>{
                                e.preventDefault()
                                return false;
                            }} onCopy={(e)=>{
                                e.preventDefault()
                                return false;
                            }} changeHandler={e => setPasscode(e.target.value)}></TextField>
                            <Button small inline clickHandler={e => sendAnswer(passcode)}>Send Answer</Button>
                        </div>

                    </div>

                </div>
            )}

        </div>
    );

}

export default DevoxxLevel4;
