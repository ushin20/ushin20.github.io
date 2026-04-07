const lineCountSelect = document.getElementById("line-count");
const generateButton = document.getElementById("generate-button");
const lottoResults = document.getElementById("lotto-results");

function shuffle(numbers) {
  const pool = [...numbers];

  for (let index = pool.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [pool[index], pool[swapIndex]] = [pool[swapIndex], pool[index]];
  }

  return pool;
}

function getBallRangeClass(number) {
  if (number <= 10) return "range-1";
  if (number <= 20) return "range-2";
  if (number <= 30) return "range-3";
  if (number <= 40) return "range-4";
  return "range-5";
}

function createBall(number) {
  const item = document.createElement("span");
  item.className = `lotto-ball ${getBallRangeClass(number)}`;
  item.textContent = String(number);
  return item;
}

function generateLine() {
  const numbers = Array.from({ length: 45 }, (_, index) => index + 1);
  const shuffled = shuffle(numbers);
  const main = shuffled.slice(0, 6).sort((a, b) => a - b);
  const bonus = shuffled[6];
  return { main, bonus };
}

function buildLineCard(result, index) {
  const article = document.createElement("article");
  article.className = "lotto-line";

  const top = document.createElement("div");
  top.className = "lotto-line-top";

  const label = document.createElement("span");
  label.className = "lotto-line-label";
  label.textContent = `Line ${index + 1}`;

  const bonusWrap = document.createElement("div");
  bonusWrap.className = "lotto-bonus-wrap";

  const bonusLabel = document.createElement("span");
  bonusLabel.className = "lotto-bonus-label";
  bonusLabel.textContent = "Bonus";

  bonusWrap.append(bonusLabel, createBall(result.bonus));
  top.append(label, bonusWrap);

  const row = document.createElement("div");
  row.className = "lotto-ball-row";
  result.main.forEach((number) => row.append(createBall(number)));

  article.append(top, row);
  return article;
}

function renderInitialState() {
  const empty = document.createElement("p");
  empty.className = "lotto-empty";
  empty.textContent = "Choose how many lines you want, then generate a fresh set of numbers.";
  lottoResults.replaceChildren(empty);
}

function renderLines() {
  const lineCount = Number(lineCountSelect.value);
  const cards = Array.from({ length: lineCount }, (_, index) => buildLineCard(generateLine(), index));
  lottoResults.replaceChildren(...cards);
}

generateButton.addEventListener("click", renderLines);

renderInitialState();
