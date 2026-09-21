const diceType = document.querySelector('#dice-type');
const diceCount = document.querySelector('#dice-count');
const diceStage = document.querySelector('#dice-stage');
const rollButton = document.querySelector('#roll-button');
const totalElement = document.querySelector('#total');
const rollCountElement = document.querySelector('#roll-count');
const historyList = document.querySelector('#history-list');
const decreaseButton = document.querySelector('#decrease');
const increaseButton = document.querySelector('#increase');
const clearHistoryButton = document.querySelector('#clear-history');

let rollNumber = 0;
let history = [];

function clampDiceCount(value) {
  return Math.min(12, Math.max(1, Number(value) || 1));
}

function updateDiceCount(value) {
  diceCount.value = clampDiceCount(value);
}

function rollDice() {
  const sides = Number(diceType.value);
  const count = clampDiceCount(diceCount.value);
  const results = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
  const total = results.reduce((sum, value) => sum + value, 0);

  rollNumber += 1;
  diceStage.innerHTML = results.map((result, index) => (
    `<div class="die" style="animation-delay: ${index * 55}ms" aria-label="第 ${index + 1} 顆骰子結果為 ${result}">${result}</div>`
  )).join('');
  totalElement.textContent = total;
  rollCountElement.textContent = `第 ${String(rollNumber).padStart(2, '0')} 次`;

  history.unshift({ sides, results, total });
  history = history.slice(0, 5);
  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = history.length === 0
    ? '<li class="history-empty">你的擲骰紀錄會顯示在這裡</li>'
    : history.map((roll, index) => `
      <li class="history-item">
        <span>#${String(history.length - index).padStart(2, '0')} &nbsp; D${roll.sides} × ${roll.results.length} &nbsp; [${roll.results.join(', ')}]</span>
        <strong>${roll.total}</strong>
      </li>
    `).join('');
}

decreaseButton.addEventListener('click', () => updateDiceCount(Number(diceCount.value) - 1));
increaseButton.addEventListener('click', () => updateDiceCount(Number(diceCount.value) + 1));
diceCount.addEventListener('change', () => updateDiceCount(diceCount.value));
rollButton.addEventListener('click', rollDice);
clearHistoryButton.addEventListener('click', () => {
  history = [];
  renderHistory();
});

document.addEventListener('keydown', (event) => {
  if (event.code === 'Space' && document.activeElement !== diceCount) {
    event.preventDefault();
    rollDice();
  }
});
