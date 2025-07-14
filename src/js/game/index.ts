import { paintTarget, paintTable } from './game-paint.ts'
import type { IDataGame, IDataPlayer, IDataUpdate } from '../types.ts'

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('body')
        ?.classList
        .add('loaded')

    paintTarget()
    paintTable()
    initGame()
})


const initGame = () => {
    const jsonGame: string | null = localStorage.getItem('game-setting')

    if (!jsonGame) {
        console.warn('localStorage с ключом game-setting пуст')
        return
    }

    const dataGames: IDataGame = JSON.parse(jsonGame)
    const dataPlayers: IDataPlayer[] = dataGames.players.map((el: string, i: number) => {
        return {
            id: i,
            name: el,
            winLag: 0,
            total: 501
        }
    })

    const countPlayers: number = dataGames.players.length
    const target: NodeListOf<HTMLElement> = document.querySelectorAll('.js-shot')

    if (!target.length) {
        console.warn('Отсутствуют элементы с классом js-shot')
        return
    }

    const rows: NodeListOf<Element> = document.querySelectorAll(`[data-player]`)

    if (!rows.length) {
        console.warn('Отсутствуют элементы с аттрибутом data-player')
        return
    }

    const updateData: IDataUpdate = {
        dataPlayers,
        countPlayers,
        rows,
        throwAttempt: 0,
        player: 0
    }

    target.forEach((el: HTMLElement) => {
        el.addEventListener('click', () => {
            updatePlayerData(updateData, Number(el.dataset.value))
        })
    })
}

const updatePlayerData = (updateData: IDataUpdate, value: number) => {
    const {dataPlayers, rows, countPlayers} = updateData
    const totalPlayer: HTMLSpanElement | null | undefined = rows?.[updateData.player]?.querySelector('.js-total') as HTMLSpanElement

    if (!totalPlayer) {
        console.warn('Отсутствуют элементы с классом js-total')
        return
    }

    dataPlayers[updateData.player].total -= value
    totalPlayer.innerText = String(dataPlayers[updateData.player].total)
    updateData.throwAttempt++

    if (updateData.throwAttempt === 3) {
        updateData.throwAttempt = 0
        rows[updateData.player].classList.remove('active')
        updateData.player = (updateData.player + 1) < countPlayers ? ++updateData.player : 0
        rows[updateData.player].classList.add('active')
    }
}