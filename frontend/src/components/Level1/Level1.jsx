import "./Level1.scss";
import React, {useState} from "react";
import cn from 'classnames';
import axios from "axios";
import Clock from "../Clock/Clock";


function Level1({state, dispatch}) {

    const [isActive, setIsActive] = useState(true);
    const [isPaused, setIsPaused] = useState(false);

    const [question1Answer, setQuestion1Answer] = useState("")
    const [question2Answer, setQuestion2Answer] = useState("")
    const [question3Answer, setQuestion3Answer] = useState("")


    //Send answer to a specific question/level
    function sendAnswer() {
        console.log("Sending answer: " + question1Answer + " to level id: " + state.currentLevelId)

        //@TODO: If we want to send the Clock data to the function: https://www.pluralsight.com/guides/how-to-pass-data-between-react-components
        setIsPaused(true)
        axios({
            method: "post",
            url: '/game/' + state.sessionID + '/level-' + state.currentLevelId + '/answer',
            data: {
                question1: question1Answer,
                question2: question2Answer,
                question3: question3Answer,
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
            ["Level1"]: true,
        })}>
            <h3> Welcome to Level 1</h3>
            <h4> Time: <Clock isActive={isActive} isPaused={isPaused}/> </h4>
            <div>
                <h4>Question 1: What is the meaning of life? </h4>
                <h4>Answer:  <input id="answer1" value={question1Answer}
                           onChange={e => setQuestion1Answer(e.target.value)}/>
                </h4>
                <h4>Question 2: What is the meaning of life+? </h4>
                <h4>Answer:  <input id="answer2" value={question2Answer}
                           onChange={e => setQuestion2Answer(e.target.value)}/>
                </h4>
                <h4>Question 3: What is the meaning of life++? </h4>
                <h4>Answer:  <input id="answer3" value={question3Answer}
                           onChange={e => setQuestion3Answer(e.target.value)}/>
                </h4>
                <button onClick={sendAnswer}>Send</button>
            </div>

        </div>
    );

}

export default Level1;

