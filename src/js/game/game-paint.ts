import type { IDataGame } from '../types.ts'
const paintTable = () => {
    const elCountLags: HTMLElement | null = document.getElementById('count-lags')
    const jsonGame: string | null =  localStorage.getItem('game-setting')

    if (!jsonGame || !elCountLags) return

    const dataGame: IDataGame = JSON.parse(jsonGame)

    elCountLags.innerText = dataGame.countLags

    renderRowsTable(dataGame.players)
}

const paintTarget = () => {
    const numbers: number[] = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5]
    const sectionTarget: HTMLElement | null = document.getElementById('target')
    let htmlSectors = ''

    numbers.forEach((el: number) => {
        htmlSectors += ` <div class="target-total">
            <div class="js-shot target-total__x2" data-value="${el * 2}">x2</div>
            <div class="js-shot target-total__x1" data-value="${el}">${el}</div>
            <div class="js-shot target-total__x3" data-value="${el * 3}">x3</div>
        </div>`
    })

    sectionTarget?.insertAdjacentHTML('afterbegin', htmlSectors)
}

const renderRowsTable = (players: string[]) => {
    const table: HTMLElement | null = document.getElementById('table')

    let html = ''

    players.forEach((el: string, i: number)=> {
        html += ` <div class="table-row ${!i ? 'active' : ''}" data-player="${i}">
                <div class="table-cell">${el} - <span id="player-${i}">0</span></div>
                <div class="table-cell"><span class="js-total">501</span></div>
            </div>`
    })

    table?.insertAdjacentHTML('beforeend', html)
}

export {
    paintTable,
    paintTarget
}