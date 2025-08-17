(function () {
  const display = document.getElementById("display");
  const keys = document.querySelector(".keys");

  let a = null;      // first operand
  let op = null;     // pending operator
  let resetNext = false;

  function format(n) {
    if (Number.isFinite(n)) {
      // limit to 12 significant digits but keep integers pretty
      return Math.abs(n) > 1e12 ? n.toExponential(6) : (+n.toFixed(12)).toString();
    }
    return "Error";
  }

  function inputNumber(ch) {
    if (resetNext || display.value === "0") {
      display.value = ch === "." ? "0." : ch;
      resetNext = false;
    } else {
      if (ch === "." && display.value.includes(".")) return;
      display.value += ch;
    }
  }

  function setOperator(nextOp) {
    const current = parseFloat(display.value || "0");
    if (a === null) {
      a = current;
    } else if (op) {
      a = evaluate(a, op, current);
      display.value = format(a);
    }
    op = nextOp;
    resetNext = true;
  }

  function evaluate(x, operator, y) {
    switch (operator) {
      case "+": return x + y;
      case "−":
      case "-": return x - y;
      case "×":
      case "*": return x * y;
      case "÷":
      case "/": return y === 0 ? NaN : x / y;
      default: return y;
    }
  }

  function equals() {
    if (op === null || a === null) return;
    const current = parseFloat(display.value || "0");
    const result = evaluate(a, op, current);
    display.value = format(result);
    a = null; op = null; resetNext = true;
  }

  function clearAll() {
    display.value = "0";
    a = null; op = null; resetNext = false;
  }

  function backspace() {
    if (resetNext) return;
    if (display.value.length <= 1) {
      display.value = "0";
    } else {
      display.value = display.value.slice(0, -1);
    }
  }

  // Click handlers
  keys.addEventListener("click", (e) => {
    const t = e.target.closest("button");
    if (!t) return;
    if (t.dataset.num) return inputNumber(t.dataset.num);
    if (t.dataset.dot !== undefined) return inputNumber(".");
    if (t.dataset.op) return setOperator(t.dataset.op);
    if (t.dataset.action === "equals") return equals();
    if (t.dataset.action === "clear") return clearAll();
    if (t.dataset.action === "delete") return backspace();
  });

  // Keyboard support
  window.addEventListener("keydown", (e) => {
    if (/\d/.test(e.key)) inputNumber(e.key);
    else if (e.key === ".") inputNumber(".");
    else if (["+","-","*","/"].includes(e.key)) setOperator(e.key);
    else if (e.key === "Enter" || e.key === "=") equals();
    else if (e.key === "Backspace") backspace();
    else if (e.key.toLowerCase() === "c" || e.key === "Escape") clearAll();
  });

  // Initialize
  clearAll();
})();
