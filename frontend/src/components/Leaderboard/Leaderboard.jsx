import "./Leaderboard.scss";
import React, {useState} from "react";
import cn from 'classnames';
import Element from '../../components/Element/Element'


function Leaderboard({leaderboard}) {

    function formatDate(time) {
        var currentDate = new Date(time)
        return currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear() + " " + currentDate.getHours() + ":" + currentDate.getMinutes();
    }

    const listStyle = {
      height:  leaderboard.Sessions.length * 60 + "px"
    }

    return (
        <div className={cn({
            ["Leaderboard"]: true,
        })}>
          <div className="Leaderboard__List" style={listStyle}>

            {
                Object.entries(leaderboard.Sessions).map(([key, sessionScore]) => {

                  const itemStyle = {
                    top:  key * 60 + "px"
                  }

                  return (
                    <div  className={cn({
                        ["Leaderboard__Item-Container"]: true,
                        ["Leaderboard__Item-Container--first"]: key == 0,
                    })}

                    style={itemStyle}>

                      <Element key={key} customClass={"Leaderboard__Item"} >
                          <div className="Leaderboard__Item__Player">{sessionScore.Nickname}</div>
                          <div className="Leaderboard__Item__Score">{sessionScore.AccumulatedScore}</div>
                          <div className="Leaderboard__Item__Meta">{formatDate(sessionScore.Time)}. <strong> Level: </strong> {sessionScore.LastLevel}. <strong>Time</strong> {new Date(sessionScore.AccumulatedTimeInSeconds).toISOString().substr(14, 5)} </div>




                      </Element>
                    </div>

                )}
            )
          }

            </div>

        </div>
    );

}

export default Leaderboard;
