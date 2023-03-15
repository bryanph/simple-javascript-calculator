const input = document.getElementById("calculator-input");
const buttons = document.getElementsByClassName("calculator-button");
const resultList = document.getElementById("last-result-list");

const sanitizeRegex = /[^-()\d/*+.\^e]/g;
const powReplaceRegex = /\^/g;
const xReplaceRegex = /x/g;
// replace multiplication of the form 5(2 + 5) to 5*(2 + 5)
const multiplicationReplaceRegex = /(\d)(\()/g;

function getResultItem(value, result) {
  const resultItem = createElementFromHTML(`
      <div class="last-result-entry">
        <div class="last-result-entry-eq">${value} =</div>
        <div class="last-result-entry-result">${result}</div>
      </div>
    `);

  resultItem.addEventListener("click", () => {
    insertSymbols(String(result));
  });
  // prevent button from taking focus
  resultItem.addEventListener("mousedown", (event) => {
    event.preventDefault();
  });

  return resultItem;
}

function calculateResult() {
  const value = input.value
    .replace(xReplaceRegex, "*")
    .replace(powReplaceRegex, "**")
    .replace(sanitizeRegex, "")
    .replace(multiplicationReplaceRegex, "$1*$2");

  if (value === "") return;

  let result;

  try {
    result = eval(value);
    input.value = result;
  } catch (e) {
    input.classList.add("input-error");
    return;
  }

  resultList.prepend(getResultItem(value, result));
}

function removeInputErrorState() {
  if (input.classList.contains("input-error")) {
    input.classList.remove("input-error");
  }
}

// make backspace take the cursor position into account
function backspace() {
  const { selectionStart, selectionEnd } = input;
  if (selectionStart === selectionEnd) {
    if (selectionStart === 0) return;
    input.value =
      input.value.slice(0, input.selectionStart - 1) +
      input.value.slice(input.selectionEnd);
    input.setSelectionRange(selectionStart - 1, selectionStart - 1);
    return;
  }

  input.value =
    input.value.slice(0, input.selectionStart) +
    input.value.slice(input.selectionEnd);
  input.setSelectionRange(selectionStart, selectionStart);
}

// make inserting a symbol take the cursor position into account
function insertSymbols(symbols) {
  const { selectionStart, selectionEnd } = input;

  if (selectionStart !== selectionEnd) {
    backspace();
  }

  input.value =
    input.value.slice(0, input.selectionStart) +
    symbols +
    input.value.slice(input.selectionEnd);

  input.setSelectionRange(
    selectionStart + symbols.length,
    selectionStart + symbols.length
  );
}

for (const button of buttons) {
  const op = button.dataset.op;
  button.addEventListener("click", (event) => {
    if (op === "=") {
      calculateResult();
      return;
    }
    if (op === "backspace") {
      removeInputErrorState();
      backspace();
      return;
    }
    if (op === "c") {
      removeInputErrorState();
      input.value = "";
      return;
    }

    removeInputErrorState();
    insertSymbols(op);
  });

  // prevent button from taking focus
  button.addEventListener("mousedown", (event) => {
    event.preventDefault();
  });
}

input.addEventListener("keyup", (event) => {
  removeInputErrorState();
  if (event.key === "Enter") {
    calculateResult();
  }
});

// keep focus on input
input.addEventListener("blur", () => {
  input.focus();
});

// create an element from a template string
function createElementFromHTML(htmlString) {
  var div = document.createElement("div");
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}
