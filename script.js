const PREFIX = "notepad-";
const np = document.querySelector("#notepad");
const history = document.querySelector("#history");
const actionButtons = document.querySelectorAll("[data-action]");

np.innerHTML = localStorage.getItem(PREFIX + "content");

function saveContent() {
  localStorage.setItem(PREFIX + "content", np.innerHTML);
}

function getHistory() {
  return JSON.parse(localStorage.getItem(PREFIX + "history")) || {};
}

function setHistory(data) {
  return localStorage.setItem(PREFIX + "history", JSON.stringify(data));
}

function fillHistoryList() {
  history.innerHTML = "";
  const hData = getHistory();
  console.log(hData);
  for (let i in hData) {
    if (!hData.hasOwnProperty(i)) continue;
    let hItem = document.createElement("li");
    hItem.classList.add("h__item");
    hItem.dataset["action"] = "restoreFromHistory";
    hItem.dataset["key"] = i;
    hItem.innerText = i;
    history.appendChild(hItem);
    addActionButtonHandler(hItem);
  }
}

function onHistoryAdd() {
  const hData = getHistory();
  hData[new Date().toLocaleString()] = np.innerHTML;
  setHistory(hData);
  fillHistoryList();
}

function onHistoryClear() {
  if (!confirm("Remove ALL records from hidtory?")) return;
  setHistory({});
  fillHistoryList();
}

function onFormatClear() {
  document.execCommand("removeformat");
}

function onToggle() {
  if (this.classList.contains("open")) {
    this.classList.remove("open");
  } else {
    this.classList.add("open");
  }
}

function onRestoreFromHistory() {
  console.log("rfh");
  const hData = getHistory();
  np.innerHTML = hData[this.dataset.key];
}

function addActionButtonHandler(actionButton) {
  actionButton.addEventListener("click", function(e) {
    let action = this.dataset.action;
    action = action.charAt(0).toUpperCase() + action.slice(1);
    window["on" + action].bind(this)(e);
    saveContent();
  });
}

np.addEventListener("keypress", saveContent);

for (let i in actionButtons) {
  if (!actionButtons.hasOwnProperty(i)) continue;
  actionButtons[i].addEventListener("mousedown", function(e) {
    e.preventDefault();
    e.stopPropagation();
  });
  addActionButtonHandler(actionButtons[i]);
}

fillHistoryList();
