import "./LevelScore.scss";
import React, {useState} from "react";
import cn from 'classnames';

import {Link} from "react-router-dom";
import confetti from "canvas-confetti";
import useInterval from "../../hooks/useInterval";

function LevelScore({score}) {


    return (
        <div className={cn({
            ["LevelScore"]: true,
        })}>

            <div className="Scores">
                Your Score for this level is: <span className="ScoreNumber"> {score}</span>
            </div>

        </div>
    );

}

export default LevelScore;
