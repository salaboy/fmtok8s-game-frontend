import "./Level3.scss";
import React, {useState} from "react";
import cn from 'classnames';
import axios from "axios";
import Clock from "../Clock/Clock";
import Button from "../../components/Button/Button";

import {CountdownCircleTimer} from 'react-countdown-circle-timer'
import {Link} from "react-router-dom";
import PacmanLoader from "react-spinners/PacmanLoader";


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
                counter: counter,
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
            {isSent && !score && (
                <>
                    <div className="Scores">
                        <PacmanLoader loading={loading} size={50}/>
                    </div>
                </>
            )}
            {isSent && score && (
                <>
                  <div className="Scores">

                      Your Score for this level is: <span className="ScoreNumber"> {score.LevelScore}</span>
                      {/*<Button main clickHandler={nextLevel}>Play Next Level</Button>
                      */}

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
