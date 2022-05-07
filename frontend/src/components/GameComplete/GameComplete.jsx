import "./GameComplete.scss";
import React, {useState} from "react";
import cn from 'classnames';

import {Link} from "react-router-dom";
import confetti from "canvas-confetti";
import useInterval from "../../hooks/useInterval";
import {TwitterShareButton} from "react-twitter-embed";

function GameComplete({state}) {

    let [delay, setDelay] = useState(4000);


    useInterval(() => {
        confetti()
    }, delay);

    return (
        <div className={cn({
            ["GameComplete"]: true,
        })}>

            <div className="GameOver">
                <h3>Tweet your score</h3>
                <p>
                    <strong>{state.nickname}</strong> you finished the game!
                    Tweet your score to participate on the <strong>#Knative</strong> raffle for some swag and books!
                    @TODO: add logo!
                    You final score is: {state.accumulatedScore}
                    <br/>
                    <TwitterShareButton
                        url={'https://knative.dev'}
                        options={{
                            text: 'My Quiz Game Score (as ' + state.nickname + ') was ' + state.accumulatedScore + ' 🥳 #kubecon #knative',
                            via: 'KnativeProject',
                            size: "large"
                        }}
                    />


                </p>

            </div>

        </div>
    );

}

export default GameComplete;
