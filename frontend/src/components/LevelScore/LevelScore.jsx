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
                <span className="ScoreNumber"> +{score}</span>
                <br/>
                Your Score for this level is: {score}
            </div>

        </div>
    );

}

export default LevelScore;
