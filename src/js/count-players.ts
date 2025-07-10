export const countPlayers = () => {
    const radioCount: NodeListOf<HTMLInputElement> = document.querySelectorAll('[name=radio-group]')

    if (!radioCount.length) return

    radioCount.forEach((el: HTMLInputElement) => {
        el.addEventListener('change', () => {
            insertInputNames(Number(el.value))
        })
    })

    saveFormNames()
    changeTypeGame()
}

const changeTypeGame = () => {
    const selectTypeGame: HTMLSelectElement = document.getElementById('game-type') as HTMLSelectElement
    const sectionPlayers: HTMLElement | null = document.getElementById('count-player')

    selectTypeGame.addEventListener('change', () => {
        sectionPlayers?.setAttribute('data-type-game', selectTypeGame.value)
    })
}

const getTemplateInputHTML = (idx: number) => {
    return `<input type="text" name="name-${ idx }" class="input-name" autocomplete="off" placeholder="Игрок ${ idx }" />`
}
const insertInputNames = (count: number) => {
    const blockInputs: HTMLDivElement | null = document.querySelector('.js-input-name-group')

    if (!blockInputs) return

    let resultHTML = ''

    for (let i = 1; i <= count; i++) {
        resultHTML += getTemplateInputHTML(i)
    }

    blockInputs.innerHTML = resultHTML
}

const saveFormNames = () => {
    const formNames: HTMLFormElement | null = document.querySelector('.js-form-names')

    if (!formNames) return

    formNames.addEventListener('submit', (e: SubmitEvent) => {
        e.preventDefault()

        const fd = new FormData(formNames)
        const dataNames: { [kye: string]: FormDataEntryValue } = Object.fromEntries(fd)
        const valueNames = Object.values(dataNames) as string[]
        const players: string[] = valueNames.map((el: string, i: number) => el || `Игрок ${i + 1}`)

        localStorage.setItem('players', JSON.stringify(players))
        location.href = '/game.html'
    })
}