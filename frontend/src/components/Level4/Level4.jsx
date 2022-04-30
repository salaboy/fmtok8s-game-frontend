import "./Level4.scss";
import React, {useState} from "react";
import cn from 'classnames';
import axios from "axios";
import Button from "../../components/Button/Button";
import {CountdownCircleTimer} from "react-countdown-circle-timer";
import PacmanLoader from "react-spinners/PacmanLoader";
import TextField from "../Form/TextField/TextField";
import {Link} from "react-router-dom";

function Level4({state, dispatch}) {
    const [loading, setLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const [passcode, setPasscode] = useState("")
    const [remainingTime, setRemainingTime] = useState(0)
    const [score, setScore] = useState()

    function nextLevel() {
        dispatch({type: "nextLevelTriggered", payload: state.currentLevelId + 1})
    }

    //Send answer to a specific question/level
    function sendAnswer(passcode) {
        if (loading) {
            return;
        }
        console.log("Sending answers: [" + passcode + " ] with remaining time: " + remainingTime + "'s to level id: " + state.currentLevelId)
        setLoading(true);
        setIsSent(true)
        axios({
            method: "post",
            url: '/game/' + state.sessionID + '/level-' + state.currentLevelId + '/answer',
            data: {
                sessionId: state.sessionID,
                textual: passcode,
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
            <h2>Level 4</h2>
            {isSent && !score && (
                <>
                    <div className="Loader">
                        <PacmanLoader color={"#1c0528"} loading={loading} size={30}/>
                    </div>
                </>
            )}
            {isSent && score && (
                <>
                    <div className="Scores">
                        Your Score for this level is: <span className="ScoreNumber"> {score.LevelScore}</span>
                    </div>
                    <div className="GameOver">
                        <h4>Congratulations</h4>
                        <h3>Game Completed! </h3>
                        <Link to={`back-office/${state.nickname}`}>Check the leaderboard.</Link>
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
                            <h3>Enter the following passcode. Hurry!</h3>
                            <h3>"1234567890998877665544332211"</h3>
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

export default Level4;
