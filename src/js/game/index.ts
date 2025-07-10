document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('body')
        ?.classList
        .add('loaded')

    paintTarget()
})

const paintTarget = () => {
    const numbers: number[] = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 18, 11, 14, 9, 12, 5]
    const sectionTarget: HTMLElement | null = document.getElementById('target')
    let htmlSectors = ''

    numbers.forEach((el: number) => {
        htmlSectors += ` <div class="target-total">
            <div class="target-total__x2" data-value="${el * 2}">x2</div>
            <div class="target-total__x1" data-value="${el}">${el}</div>
            <div class="target-total__x3" data-value="${el * 3}">x3</div>
        </div>`
    })

    sectionTarget?.insertAdjacentHTML('afterbegin', htmlSectors)
}