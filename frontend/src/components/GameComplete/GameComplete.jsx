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
            <h2>Congratulations ${state.nickname}</h2>
            <div className="GameOver">
                <h3>Game Completed ! </h3>
                <Link to={`back-office/${state.nickname}`}>Check the leaderboard to see your final score!</Link>
            </div>

        </div>
    );

}

export default GameComplete;
