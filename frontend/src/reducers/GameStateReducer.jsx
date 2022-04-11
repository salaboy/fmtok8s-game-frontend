//https://stackoverflow.com/questions/55301495/issues-with-usereducer-not-synchronously-updating-the-state
export const gameStateReducer = (currentState, action) => {
    if (action.type === 'reset') {
        console.log("ACTION rest")
        return {
            landed: true,
            sessionID: "",
            nickname: "",
            currentLevelId: 0,
        }
    }

    if (action.type === 'gameSessionIdCreated') {

        console.log("ACTION gameSessionIdCreated")
        return {
            landed: currentState.landed,
            sessionID: action.payload.SessionId,
            currentLevelId: 1,
            nickname: action.payload.Player,
            currentLevelStarted: false
        }
    }


    if (action.type === 'levelStartedTriggered') {
        console.log("ACTION levelStartedTriggered")
        return {
            landed: currentState.landed,
            sessionID: currentState.sessionID,
            currentLevelId: currentState.currentLevelId,
            currentLevelExists: currentState.currentLevelExists,
            nickname: currentState.nickname,
            currentLevelStarted: true
        }
    }

    if (action.type === 'levelCompletedTriggered') {

        console.log("ACTION levelCompletedTriggered")
        return {
            landed: currentState.landed,
            sessionID: currentState.sessionID,
            currentLevelId: currentState.currentLevelId,
            nickname: currentState.nickname,
            currentLevelExists: currentState.currentLevelExists,
            currentLevelStarted: currentState.currentLevelStarted,
            currentLevelCompleted: action.payload.completed,
            nextLevelId:  action.payload.nextLevelId
        }
    }

    if (action.type === 'nextLevelTriggered') {

        console.log("ACTION nextLevelTriggered")
        return {
            landed: currentState.landed,
            sessionID: currentState.sessionID,
            nickname: currentState.nickname,
            currentLevelId: action.payload,
        }
    }




    return currentState
}



