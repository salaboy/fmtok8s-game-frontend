import "./Level2.scss";
import React, {useState} from "react";
import cn from 'classnames';
import axios from "axios";
import Clock from "../Clock/Clock";


function Level2({state, dispatch}) {

    const [question1Answer, setQuestion1Answer] = useState("")


    //Send answer to a specific question/level
    function sendAnswer() {
        console.log("Sending answer: " + question1Answer + " to level id: " + state.currentLevelId)


        axios({
            method: "post",
            url: '/game/' + state.sessionID + '/level-' + state.currentLevelId + '/answer',
            data: {
                question1: question1Answer,
            },
        }).then(res => {
            console.log("Answer response:")
            console.log(res.headers)
            console.log(res.data)
            dispatch({type: "nextLevelTriggered", payload: state.currentLevelId + 1})
        }).catch(err => {

            console.log(err)
            console.log(err.response.data.message)
            console.log(err.response.data)
        });
    }

    return (
        <div className={cn({
            ["Level2"]: true,
        })}>
            <h3> Welcome to Level 2</h3>
            <h4> Time: <Clock/> </h4>
            <div>
                <h4>Question 1:Is this a very difficult question? </h4><br/>
                <h4>Answer:
                <input id="answer1" value={question1Answer}
                       onChange={e => setQuestion1Answer(e.target.value)}/>
                </h4>
                <button onClick={sendAnswer}>Send</button>
            </div>

        </div>
    );

}

export default Level2;

