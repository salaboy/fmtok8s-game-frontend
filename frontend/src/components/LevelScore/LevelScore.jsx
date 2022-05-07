import "./LevelScore.scss";
import React, {useState} from "react";
import cn from 'classnames';

import {Link} from "react-router-dom";
import confetti from "canvas-confetti";
import useInterval from "../../hooks/useInterval";

function LevelScore({score, final}) {


    return (
        <div className={cn({
            ["LevelScore"]: true,
            ["LevelScore__final"]: final == true,
        })}>

            <div className="Scores">
                <span className="ScoreNumber">
                  {final !== true && (
                    <>
                    +
                    </>
                  )}
                  {score}
                 </span>
                <br/>
                {final !== true && (
                  <>
                    Your Score for this level is: {score}
                  </>
                )}
                {final == true && (
                  <>
                    Your final Score is: {score}
                  </>
                )}
            </div>

        </div>
    );

}

export default LevelScore;
