import "./Leaderboard.scss";
import React, {useState} from "react";
import cn from 'classnames';


function Leaderboard({leaderboard}) {

    function formatDate(time) {
        var currentDate = new Date(time)
        return currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear() + " " + currentDate.getHours() + ":" + currentDate.getMinutes();
    }

    return (
        <div className={cn({
            ["Leaderboard"]: true,
        })}>

            {
                Object.entries(leaderboard.Sessions).map(([key, sessionScore]) =>
                    <div key={key}>
                        <h4>Time: {formatDate(sessionScore.Time)} -> Player: {sessionScore.Nickname} ->
                            Score: {sessionScore.AccumulatedScore} -> Last Level Played: {sessionScore.LastLevel} ->
                        Time Used: {new Date(sessionScore.AccumulatedTimeInSeconds).toISOString().substr(14, 5)}</h4>
                    </div>
                )
            }

        </div>
    );

}

export default Leaderboard;

