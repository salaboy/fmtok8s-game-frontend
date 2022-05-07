import "./GameComplete.scss";
import React, {useState} from "react";
import cn from 'classnames';
import LevelScore from "../../components/LevelScore/LevelScore";
import {Link} from "react-router-dom";
import confetti from "canvas-confetti";
import useInterval from "../../hooks/useInterval";

import knativeLogo from "../../images/knative.png"

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
                <div className="GameOver__Image">
                  <img src={knativeLogo} alt="Knative" width="100"/>
                </div>

                <LevelScore final score={state.accumulatedScore}/>


            </div>

        </div>
    );

}

export default GameComplete;
