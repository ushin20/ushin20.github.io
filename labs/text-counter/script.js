const textInput = document.getElementById("text-input");
const sampleButton = document.getElementById("sample-button");
const clearButton = document.getElementById("clear-button");

const characterCount = document.getElementById("count-characters");
const noWhitespaceCount = document.getElementById("count-no-whitespace");
const wordCount = document.getElementById("count-words");
const lineCount = document.getElementById("count-lines");
const paragraphCount = document.getElementById("count-paragraphs");

const SAMPLE_TEXT = `Lab projects are small web tools.

They should be easy to open, try, and improve.
This text counter shows multiple metrics at once.`;

function countWords(text) {
  const trimmed = text.trim();
  if (!trimmed) {
    return 0;
  }

  return trimmed.split(/\s+/).length;
}

function countLines(text) {
  if (!text.length) {
    return 0;
  }

  return text.split(/\r?\n/).length;
}

function countParagraphs(text) {
  const trimmed = text.trim();
  if (!trimmed) {
    return 0;
  }

  return trimmed.split(/\n\s*\n/).filter(Boolean).length;
}

function updateCounts() {
  const text = textInput.value;

  characterCount.textContent = String(text.length);
  noWhitespaceCount.textContent = String(text.replace(/\s/g, "").length);
  wordCount.textContent = String(countWords(text));
  lineCount.textContent = String(countLines(text));
  paragraphCount.textContent = String(countParagraphs(text));
}

textInput.addEventListener("input", updateCounts);

sampleButton.addEventListener("click", () => {
  textInput.value = SAMPLE_TEXT;
  updateCounts();
  textInput.focus();
});

clearButton.addEventListener("click", () => {
  textInput.value = "";
  updateCounts();
  textInput.focus();
});

updateCounts();
