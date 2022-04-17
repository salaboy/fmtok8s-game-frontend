import "./Level1.scss";
import React, {useState} from "react";
import cn from 'classnames';
import axios from "axios";
import Clock from "../Clock/Clock";
import Button from "../../components/Button/Button";
import TextField from "../../components/Form/TextField/TextField";



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
            ["Level"]: true,
        })}>
            <Clock isActive={isActive} isPaused={isPaused}/>
            <h2>Level 1</h2>

            <div className="Questionnaire">
                <div className="Question">
                  <div className="Question__Number">1</div>
                  <div className="Question__Body">What is the meaning of life?</div>

                  <TextField placeholder="Write your answer" name="answer1" value={question1Answer} changeHandler={e => setQuestion1Answer(e.target.value)}></TextField>
                </div>

                <div className="Question">
                  <div className="Question__Number">2</div>
                  <div className="Question__Body">What is the meaning of life +?</div>

                  <TextField placeholder="Write your answer" name="answer2" value={question2Answer} changeHandler={e => setQuestion2Answer(e.target.value)}></TextField>
                </div>
                <div className="Question">
                  <div className="Question__Number">3</div>
                  <div className="Question__Body">What is the meaning of life ++?</div>

                  <TextField placeholder="Write your answer" name="answer3" value={question3Answer} changeHandler={e => setQuestion3Answer(e.target.value)}></TextField>
                </div>
            
                <Button main clickHandler={sendAnswer}>Send</Button>
            </div>

        </div>
    );

}

export default Level1;
