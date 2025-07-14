import { countPlayers } from './count-players.ts'

document.addEventListener('DOMContentLoaded', () => {
    localStorage.setItem('game-setting', '')
    document.querySelector('body')
        ?.classList
        .add('loaded')


    countPlayers()
})