import "./Level2.scss";
import React, {useState} from "react";
import cn from 'classnames';
import axios from "axios";
import Clock from "../Clock/Clock";
import Button from "../../components/Button/Button";
import TextField from "../../components/Form/TextField/TextField";


function Level2({state, dispatch}) {

    const [isActive, setIsActive] = useState(true);
    const [isPaused, setIsPaused] = useState(false);

    const [question1Answer, setQuestion1Answer] = useState("")
    const [loading, setLoading] = useState(false);

    //Send answer to a specific question/level
    function sendAnswer() {
        if (loading) {
            return;
        }
        setLoading(true);
        console.log("Sending answer: " + question1Answer + " to level id: " + state.currentLevelId)

        setIsPaused(true)
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
            setLoading(false);
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
            <h2>Level 2</h2>

            <div className="Questionnaire">
                <div className="Question">
                  <div className="Question__Number">1</div>
                  <div className="Question__Body">Is this a very difficult question?</div>

                  <TextField placeholder="Write your answer" name="answer1" value={question1Answer} changeHandler={e => setQuestion1Answer(e.target.value)}></TextField>
                </div>

                <Button main clickHandler={sendAnswer} disabled={loading}>{loading ? 'Sending...' : 'Send'}</Button>
            </div>

        </div>
    );

}

export default Level2;
