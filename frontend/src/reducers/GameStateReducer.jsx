//https://stackoverflow.com/questions/55301495/issues-with-usereducer-not-synchronously-updating-the-state
export const gameStateReducer = (currentState, action) => {
    if (action.type === 'reset') {
        console.log("ACTION rest")
        return {
            landed: true,
            sessionID: "",
            currentLevelId: 0,
        }
    }

    if (action.type === 'gameSessionIdCreated') {

        console.log("ACTION gameSessionIdCreated")
        return {
            landed: currentState.landed,
            sessionID: action.payload.gameSessionId,
            currentLevelId: action.payload.levelId
        }
    }
    if (action.type === 'levelCheckTriggered') {

        console.log("ACTION levelCheckTriggered")
        return {
            landed: currentState.landed,
            sessionID: currentState.sessionID,
            currentLevelId: currentState.currentLevelId,
            currentLevelStarted: currentState.currentLevelStarted,
            currentLevelCompleted: currentState.currentLevelCompleted,
            currentLevelExists: action.payload
        }
    }



    if (action.type === 'levelStartedTriggered') {
        console.log("ACTION levelStartedTriggered")
        return {
            landed: currentState.landed,
            sessionID: currentState.sessionID,
            currentLevelId: currentState.currentLevelId,
            currentLevelExists: currentState.currentLevelExists,
            currentLevelStarted: true
        }
    }

    if (action.type === 'levelCompletedTriggered') {

        console.log("ACTION levelCompletedTriggered")
        return {
            landed: currentState.landed,
            sessionID: currentState.sessionID,
            currentLevelId: currentState.currentLevelId,
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
            currentLevelId: action.payload,
        }
    }


    // if (action.type === 'reservationIdCreated') {
    //
    //     console.log("ACTION reservationIdCreated")
    //
    //     return {
    //         landed: currentState.landed,
    //         sessionID: currentState.sessionID,
    //         reservationID: action.payload,
    //         inQueue: currentState.inQueue,
    //         outQueue: currentState.outQueue,
    //         reservingTickets: currentState.reservingTickets,
    //         checkingOut: currentState.checkingOut,
    //
    //     }
    // }
    // if (action.type === 'joinedQueue') {
    //
    //     console.log("ACTION joinedQueue")
    //     return {
    //         sessionID: currentState.sessionID,
    //         reservationID: currentState.reservationID,
    //         landed: false,
    //         inQueue: true
    //     }
    // }

    return currentState
}



