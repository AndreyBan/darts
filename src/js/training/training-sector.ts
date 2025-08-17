interface ITrainingData {
    sector: number,
    total: number,
    totalValue: number,
    attempt: number,
    history: IHistory[]
}

interface IHistory {
    value: number,
    total: number
}

type TrainingDataField = 'sector' | 'total' | 'attempt'

export class TrainingSector {
    private trainingData: ITrainingData = {
        sector: 20,
        total: 0,
        totalValue: 0,
        attempt: 1,
        history: []
    }

    private elTotalResult: HTMLElement | null = document.getElementById('js-total-result')
    private elTotalValue: HTMLElement | null = document.getElementById('js-total-value')
    private elSector: HTMLElement | null = document.getElementById('js-sector-value')
    private elAttempt: HTMLElement | null = document.getElementById('js-attempt')
    private elChangeSector: HTMLElement | null = document.getElementById('js-change-sector')
    private elReset: HTMLElement | null = document.getElementById('js-reset')
    private elStepBack: HTMLElement | null = document.getElementById('js-step-back')
    private elHint: HTMLElement | null = document.getElementById('js-hint')


    private proxyTrainingData = new Proxy(this.trainingData, {
        set: (obj: ITrainingData, prop, value) => {
            const p = prop as TrainingDataField

            obj[p] = value

            switch (p) {
                case 'total':
                    this.updateTrainingData('total')
                    break
                case 'attempt':
                    if (value > 10) {
                        setTimeout(this.cancelSet)
                    }
                    this.updateTrainingData('attempt')

                    break
                case 'sector':
                    this.updateTrainingData('sector')
                    break
            }

            return true
        }
    })

    private actionReset = () => {
        this.elReset?.addEventListener('click', this.resetTraining)
    }
    private resetTraining = () => {
        this.proxyTrainingData.totalValue = 0
        this.proxyTrainingData.total = 0
        this.proxyTrainingData.attempt = 1
        this.proxyTrainingData.history = []
        this.elStepBack?.classList.add('disabled')
    }

    private actionChangeSector = () => {
        if (!this.elChangeSector) return

        this.elChangeSector.addEventListener('click', () => {
            let valueSector: number = Number(prompt('Выберите сектор (0 - центр мишени)', '20'))

            if (valueSector < 0 || valueSector > 20) {
                alert('Сектор возможен от 0 до 20')
            } else if (isNaN(valueSector)) {
                alert('Сектор должен быть числом')
            } else {
                this.proxyTrainingData.sector = valueSector || 25
            }
        })
    }

    private cancelSet = () => {
        const repeatQuestion = confirm(`Результат: ${ this.proxyTrainingData.total } (${ this.proxyTrainingData.totalValue })\nПовторить игру?`)

        repeatQuestion ? this.resetTraining() : location.href = '/'
    }

    private updateTrainingData = (field: TrainingDataField) => {
        if (field === 'total') {
            if (!this.elTotalResult || !this.elTotalValue) return

            this.elTotalResult.innerText = String(this.proxyTrainingData.total)
            this.elTotalValue.innerText = String(this.proxyTrainingData.totalValue)
        } else if (field === 'attempt') {
            if (!this.elAttempt) return

            this.elAttempt.innerText = String(this.proxyTrainingData.attempt)
        } else {
            if (!this.elSector || !this.elHint) return

            const isBull = this.proxyTrainingData.sector === 25
            this.elSector.innerText = String(this.proxyTrainingData.sector)

            this.elHint.innerText = isBull
                ? '* Красная зона - 2 очка, зеленая зона - 1 очко'
                : '* Количество попаданий в сектор с учетом х2 (+2 очка) и x3(+3 очка)'
        }
    }

    private actionStepBack = () => {
        const lengthHistory = this.proxyTrainingData.history.length
        const historyLast = this.proxyTrainingData.history[lengthHistory - 1]

        this.proxyTrainingData.totalValue -= historyLast.value
        this.proxyTrainingData.total -= historyLast.total
        this.proxyTrainingData.attempt--
        this.proxyTrainingData.history.pop()

        if (lengthHistory !== 1) return

        this.elStepBack?.classList.add('disabled')
    }

    private actionAttempt = (value: string) => {
        const numValue = Number(value)
        const total = numValue * this.proxyTrainingData.sector

        this.proxyTrainingData.totalValue += numValue
        this.proxyTrainingData.total += total

        this.proxyTrainingData.history.push({
            value: numValue,
            total: total
        })

        this.elStepBack?.classList.remove('disabled')
        if (this.proxyTrainingData.attempt > 10) return
        this.proxyTrainingData.attempt++
    }
    private initAttempt = () => {
        const elementsValue: NodeListOf<HTMLDivElement> = document.querySelectorAll('.training-table-value')

        if (!elementsValue.length) return

        elementsValue.forEach((el: HTMLDivElement) => {
            el.addEventListener('click', () => this.actionAttempt(el.innerText))
        })
    }

    private initStepBack = () => {
        if (!this.elStepBack) return

        this.elStepBack.addEventListener('click', this.actionStepBack)
    }

    public initTrainingSector = () => {
        this.initAttempt()
        this.actionChangeSector()
        this.actionReset()
        this.initStepBack()
    }
}