interface ITrainingData {
    sector: number,
    total: number,
    attempt: number
}

type TrainingDataField = 'sector' | 'total' | 'attempt'
export class TrainingSector {
    private trainingData: ITrainingData = {
        sector: 20,
        total: 0,
        attempt: 1
    }

    private elTotal: HTMLElement | null = document.getElementById('js-total')
    private elSector: HTMLElement | null = document.getElementById('js-sector-value')
    private elAttempt: HTMLElement | null = document.getElementById('js-attempt')
    private elChangeSector: HTMLElement | null = document.getElementById('js-change-sector')
    private elReset: HTMLElement | null = document.getElementById('js-reset')

    private proxyTrainingData = new Proxy(this.trainingData, {
        set: (obj: ITrainingData, prop, value) => {
            const p = prop as TrainingDataField

            obj[p] = value

            if (p === 'total') this.updateTrainingData('total')
            else if (p === 'attempt') {
                if (value > 10) {
                    this.cancelSet()
                }
                this.updateTrainingData('attempt')
            }
            else this.updateTrainingData('sector')
            return true
        }
    })

    private actionReset = () => {
        this.elReset?.addEventListener('click', () => this.resetTraining())
    }
    private resetTraining = () => {
        this.proxyTrainingData.total = 0
        this.proxyTrainingData.attempt = 1
    }

    private actionChangeSector = () => {
        if (!this.elChangeSector) return

        this.elChangeSector.addEventListener('click', () => {
            let valueSector: number = Number(prompt('Выберите сектор', '20'))

            if (valueSector < 1 || valueSector > 20) {
                alert('Сектор возможен от 1 до 20')
            } else if (isNaN(valueSector)) {
                alert('Сектор должен быть числом')
            } else {
                this.proxyTrainingData.sector = valueSector
            }
        })
    }

    private cancelSet = () => {
        const repeatQuestion = confirm(`Результат: ${this.proxyTrainingData.total}\nПовторить игру?`)

        repeatQuestion ? this.resetTraining() : location.href = '/'
    }

    private updateTrainingData = (field: TrainingDataField) => {
        if (field === 'total') {
            if (!this.elTotal) return

            this.elTotal.innerText = String(this.proxyTrainingData.total)
        } else if (field === 'attempt') {
            if (!this.elAttempt) return

            this.elAttempt.innerText = String(this.proxyTrainingData.attempt)
        } else {
            if (!this.elSector) return

            this.elSector.innerText = String(this.proxyTrainingData.sector)
        }
    }

    private actionAttempt = (value: string) => {
        const numValue = Number(value)

        this.proxyTrainingData.total += numValue * this.proxyTrainingData.sector
        this.proxyTrainingData.attempt++
    }
    private initAttempt = () => {
        const elementsValue: NodeListOf<HTMLDivElement> = document.querySelectorAll('.training-table-value')

        if (!elementsValue.length) return

        elementsValue.forEach((el: HTMLDivElement) => {
            el.addEventListener('click', () => this.actionAttempt(el.innerText))
        })
    }

    public initTrainingSector = () => {
        this.initAttempt()
        this.actionChangeSector()
        this.actionReset()
    }
}