import { countPlayers } from './count-players.ts'

document.addEventListener('DOMContentLoaded', () => {
    localStorage.setItem('players', '')
    document.querySelector('body')
        ?.classList
        .add('loaded')

    countPlayers()
})