
const input = document.getElementById('calculator-input')
const buttons = document.getElementsByClassName('calculator-button');
const resultList = document.getElementById('last-result-list');

const sanitizeRegex = /[^-()\d/*+.\^e]/g
const powReplaceRegex = /\^/g
// replace multiplication of the form 5(2 + 5) to 5*(2 + 5)
const multiplicationReplaceRegex = /(\d)(\()/g

function getResultItem (value, result) {
    const resultItem = createElementFromHTML(`
      <div class="last-result-entry">
        <div class="last-result-entry-eq">${value} =</div>
        <div class="last-result-entry-result">${result}</div>
      </div>
    `)

    resultItem.addEventListener('click', () => {
        input.value += result
    })

    return resultItem
}

function calculateResult() {
    const value = input.value
        .replace(sanitizeRegex, '')
        .replace(powReplaceRegex, '**')
        .replace(multiplicationReplaceRegex, '$1*$2')

    if (value === '') return

    let result;

    try {
        result = eval(value)
        input.value = result
    }
    catch (e) {
        input.classList.add('input-error')
        return
    }

    resultList.prepend(getResultItem(value, result))
}

for (const button of buttons) {
    const op = button.dataset.op
    button.addEventListener('click', event => {
        if (op === '=') {
            calculateResult()
            return;
        }
        if (op === 'backspace') {
            input.value = input.value.slice(0, -1)
            return;
        }
        if (op === 'c') {
            input.value = ''
            return;
        }

        input.value += op
    })

    // prevent button from taking focus
    button.addEventListener('mousedown', event => {
        event.preventDefault()
    })
}

input.addEventListener('keyup', event => {
    if (input.classList.contains('input-error')) {
        input.classList.remove('input-error')
    }
    if (event.key === 'Enter') {
        calculateResult()
    }
})

// keep focus on input
input.addEventListener('blur', () => {
    input.focus()
})

// create an element from a template string
function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}
