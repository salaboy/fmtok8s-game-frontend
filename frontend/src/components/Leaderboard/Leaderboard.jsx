import "./Leaderboard.scss";
import React, {useState} from "react";
import cn from 'classnames';
import Element from '../../components/Element/Element'


function Leaderboard({leaderboard, nickname}) {

    function formatDate(time) {
        var currentDate = new Date(time)
        return currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear() + " " + currentDate.getHours() + ":" + currentDate.getMinutes();
    }

    const listStyle = {
      height:  leaderboard.Sessions.length * 100 + "px"
    }

    return (
        <div className={cn({
            ["Leaderboard"]: true,
        })}>
          <div className="Leaderboard__List" style={listStyle}>
                <div className="Leaderboard__Positions" style={listStyle}>
                {
                    Object.entries(leaderboard.Sessions).map(([key, sessionScore]) => {

                      return (
                        <div key={key} className={cn({
                            ["Leaderboard__Position"]: true,
                            ["Leaderboard__Position--first"]: key == 0,
                            ["Leaderboard__Position--second"]: key == 1,
                            ["Leaderboard__Position--third"]: key == 2,
                            ["Leaderboard__Position--selected"]: sessionScore.Selected == true
                        })}

                        >
                            <span>{parseInt(key) + 1 } </span>
                        </div>

                    )}
                )
              }
                </div>
                <div className="Leaderboard__Players" style={listStyle}>

                    {
                        Object.entries(leaderboard.Sessions).map(([key, sessionScore]) => {

                          const itemStyle = {
                            top:  key * 100 + "px"
                          }

                          return (
                            <div  className={cn({
                                ["Leaderboard__Item-Container"]: true,
                                ["Leaderboard__Item-Container--first"]: key == 0,
                                ["Leaderboard__Item-Container--second"]: key == 1,
                                ["Leaderboard__Item-Container--third"]: key == 2,
                                ["Leaderboard__Item-Container--topten"]: key < 10 && key > 2,
                                ["Leaderboard__Item-Container--selected"]: sessionScore.Selected == true
                            })}

                            style={itemStyle}>

                              <Element key={key} customClass={"Leaderboard__Item"} >
                                  <div className="Leaderboard__Item__Player">{sessionScore.Nickname}</div>
                                  <div className="Leaderboard__Item__Level">{sessionScore.LastLevel}</div>
                                  <div className="Leaderboard__Item__Score">{sessionScore.AccumulatedScore}</div>

                              </Element>
                            </div>

                        )}
                    )
                  }
                  </div>

            </div>

        </div>
    );

}

export default Leaderboard;
