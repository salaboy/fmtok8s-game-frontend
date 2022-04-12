import "./Clock.scss";
import React, {useEffect, useState} from "react";
import cn from 'classnames';
import Timer from "./Timer"

function Clock({isActive, isPaused}) {


    const [time, setTime] = useState(0);

    useEffect(() => {
        let interval = null;
        if (isActive && isPaused === false) {
            interval = setInterval(() => {
                setTime((time) => time + 10);
            }, 10);
        } else {
            clearInterval(interval);
        }
        return () => {
            clearInterval(interval);
        };
    }, [isActive, isPaused]);

    return (
        <div className={cn({
            ["Clock"]: true,
        })}>

            <Timer time={time} />

        </div>
    );

}

export default Clock;

