import "./GameComplete.scss";
import React, {useState} from "react";
import cn from 'classnames';

import {Link} from "react-router-dom";
import confetti from "canvas-confetti";
import useInterval from "../../hooks/useInterval";

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
                 <p>
                  <strong>{state.nickname}</strong> you finished the game!
                  Check the leaderboard to see your final score.
                 </p>

            </div>

        </div>
    );

}

export default GameComplete;
