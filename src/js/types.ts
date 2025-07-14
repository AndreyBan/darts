interface IDataPlayer {
    id: number
    name: string
    total: number
    winLag: number
}

interface IDataGame {
    countLags: string,
    players: string[]
}

interface IDataUpdate {
    dataPlayers: IDataPlayer[],
    countPlayers: number,
    rows: NodeListOf<Element>,
    throwAttempt: number,
    player: number
}
export type {
    IDataGame,
    IDataPlayer,
    IDataUpdate
}