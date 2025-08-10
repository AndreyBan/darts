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
    const btnStepBack: HTMLElement | null = document.querySelector('.js-step-back')

    if (!btnStepBack) {
        console.warn('Отсутствует элемент с классом js-step-back')
        return
    }

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
        player: 0,
        historyGame: []
    }

    target.forEach((el: HTMLElement) => {
        el.addEventListener('click', (): void => {
            const isDouble = el.classList.contains('target-total__x2')

            updatePlayerData(updateData, Number(el.dataset.value), isDouble)
            disabledStateBtnStepBack(btnStepBack, updateData.historyGame.length)
        })
    })

    actionMiss(updateData)

    btnStepBack.addEventListener('click', () => {
        actionStepBack(updateData)
        disabledStateBtnStepBack(btnStepBack, updateData.historyGame.length)
    })
}

/**
 * Действие при попадании за пределы мишени
 * @param updateData
 */
const actionMiss = (updateData: IDataUpdate,) => {
    const missElement: HTMLDivElement | null = document.querySelector('.js-miss')

    if (!missElement) {
        console.warn('Отсутствуют элементы с классом js-miss')
        return
    }

    missElement.addEventListener('click', () => updatePlayerData(updateData, 0))
}

const updatePlayerData = (updateData: IDataUpdate, value: number, isDouble = false) => {
    const overTotal = setTotalPlayer(updateData, value, true, isDouble)

    updateData.throwAttempt++

    if (overTotal) {
        updateData.historyGame.push({
            numberPlayer: updateData.player,
            value
        })
    }

    if (updateData.throwAttempt !== 3) return

    setActivePlayer(updateData)
}


const setActivePlayer = (updateData: IDataUpdate) => {
    const { rows, countPlayers } = updateData

    rows[updateData.player].classList.remove('active')
    updateData.player = (updateData.player + 1) < countPlayers ? ++updateData.player : 0
    rows[updateData.player].classList.add('active')
    updateData.throwAttempt = 0
}
const setTotalPlayer = (updateData: IDataUpdate, value: number, showTotalAnimate = false, isDouble = false) => {
    const { dataPlayers, rows, player } = updateData
    const totalPlayer: HTMLSpanElement | null | undefined = rows?.[updateData.player]?.querySelector('.js-total') as HTMLSpanElement

    if (!totalPlayer) {
        console.warn('Отсутствуют элементы с классом js-total')
        return
    }
    const newValue = dataPlayers[player].total - value
    const hasOverTotal = overTotalGame(updateData, newValue, isDouble, totalPlayer)

    if (!hasOverTotal) return false

    if (showTotalAnimate) {
        showTotal(value)
    }

    actionThrowAttempt(updateData, newValue, totalPlayer)

    return true
}

const actionThrowAttempt = (updateData: IDataUpdate, value: number, totalPlayer: HTMLSpanElement) => {
    const { dataPlayers, player } = updateData

    if (!value) {
        updateData.throwAttempt = 0
        updateData.dataPlayers[updateData.player].winLag++

        const playerWinLag = updateData.dataPlayers[updateData.player].winLag

        updateData.dataPlayers.forEach((el: IDataPlayer, i: number) => {
            const total = updateData.rows[i].querySelector('.js-total') as HTMLSpanElement

            total.innerText = '501'
            el.total = 501
        })

        setNumberLag(updateData.player, playerWinLag)
        updateData.historyGame = []

        if (!cancelGame(playerWinLag)) return

        const restart = confirm(`${ updateData.dataPlayers[player].name } победил!\nХотите повторить игру?`)

        !restart ? location.href = '/' : location.reload()
    } else {
        dataPlayers[player].total = value
        totalPlayer.innerText = String(dataPlayers[player].total)
    }
}
const overTotalGame = (updateData: IDataUpdate, value: number, isDouble = false, totalPlayer: HTMLSpanElement) => {
    const { dataPlayers, player, historyGame } = updateData

    if (value !== 1 && value >= 0 && (!value || !isDouble)) return true

    if (updateData.throwAttempt) {
        let sumValues = 0

        for (let i = 0; i < updateData.throwAttempt; i++) {
            sumValues += historyGame[historyGame.length - (i + 1)].value
        }

        dataPlayers[player].total += sumValues
        historyGame.push({
            numberPlayer: player,
            value: -sumValues
        })
        totalPlayer.innerText = String(dataPlayers[player].total)
    }

    updateData.throwAttempt = 2

    return false
}

const cancelGame = (currentWinLag: number) => {
    const settingsJson = localStorage.getItem('game-setting')

    if (!settingsJson) return

    const { countLags } = JSON.parse(settingsJson)
    const needLagWin = Math.round(countLags / 2)

    return currentWinLag === needLagWin
}

const setNumberLag = (numPlayer: number, numLag: number) => {
    const numberLagElement: HTMLSpanElement | null = document.getElementById(`player-${ numPlayer }`)

    if (!numberLagElement) {
        console.warn(`Игрока с id ${ numPlayer } не существует!`)
        return
    }

    numberLagElement.innerText = String(numLag)
}

const disabledStateBtnStepBack = (btnStepBack: HTMLElement, lengthHistory: number) => {
    if (!lengthHistory) {
        btnStepBack.setAttribute('disabled', 'disabled')
    } else {
        btnStepBack.removeAttribute('disabled')
    }
}
const actionStepBack = (updateData: IDataUpdate) => {
    if (!updateData.historyGame.length) return

    const { rows, historyGame, player } = updateData
    let { length: lengthHistory } = historyGame
    const { value, numberPlayer } = historyGame[--lengthHistory]

    rows[player].classList.remove('active')
    updateData.player = numberPlayer
    rows[updateData.player].classList.add('active')

    setTotalPlayer(updateData, -value)

    updateData.historyGame.pop()
    updateData.throwAttempt = !updateData.throwAttempt ? 2 : --updateData.throwAttempt
    showTotal(value, updateData.dataPlayers[numberPlayer].name)
}


let timeoutId: number
const showTotal = (value: number, playerName = '') => {
    const target = playerName ? '.js-total-back' : '.js-total-animate'
    const totalValue: HTMLElement | null = document.querySelector(target)

    if (!totalValue) return

    const hasAnimate = totalValue.classList.contains('animate')

    if (hasAnimate) {
        totalValue.classList.remove('animate')
        clearTimeout(timeoutId)
    }

    setTimeout(() => {
        const textBefore = (value < 0) ? ': -' : ': +'

        totalValue.innerText = `${ playerName ? playerName + textBefore : '-' }${ Math.abs(value) }`
        totalValue.classList.add('animate')
        timeoutId = setTimeout(() => {
            totalValue?.classList.remove('animate')
        }, playerName ? 2000 : 850)
    })
}
