import "./GameSessions.scss";
import React, {useState} from "react";
import cn from 'classnames';


function GameSessions({gameSessions}) {


    return (
        <div className={cn({
            ["GameSessions"]: true,
        })}>

            {Object.entries(gameSessions).map(([key, session]) =>
                <div key={key}>
                    <h4>{session.gameSessionId} -> Level: {session.levelId} -> Status: {(String(session.completed) == "true") ? "completed" : "playing"}</h4>
                </div>
            )}

        </div>
    );

}

export default GameSessions;

