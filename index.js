if (module.hot) {
  module.hot.accept();
}

// POPULATE HTML
let stocks = [
  { title: "AAPL", description: "Apple Inc." },
  { title: "GOOGL", description: "Google Inc." },
  { title: "TSLA", description: "Tesla Inc." },
];
while (stocks.length < 100) {
  stocks = [...stocks, ...stocks];
}

const stockTemplate = document.getElementById("stock-template");
stocks.forEach((stock) => {
  const stockInstance = document.importNode(stockTemplate.content, true);
  stockInstance.querySelector(".stock__name").innerHTML = stock.title;
  stockInstance.querySelector(".stock__description").innerHTML =
    stock.description;
  document.getElementById("stock-list").appendChild(stockInstance);
});

const biTemplate = document.getElementById("bi-article");
for (let i = 0; i < 100; i++) {
  const biArticleInstance = document.importNode(biTemplate.content, true);
  document.getElementById("article-list").appendChild(biArticleInstance);
}

// TOUCH EVENT HANDLERS

// Initial state
let isDragging = false;
let dragginStartedFrom = "bottom";
let initialDragClientY = 0;
// declare yDrag as an object with getters and setters
// so we have a straight forward way of updating style
// whenever its value changes
const draggableContentElement = document.querySelector(
  ".main__secondary-content"
);
const yDrag = {
  dragValue: 0,
  startedAt: "bottom",
  set value(val) {
    this.dragValue = val;
    draggableContentElement.style.transform = `translateY(${val}px)`;
  },
  get value() {
    return this.dragValue;
  },
};

const { height: headerHeight } = document
  .querySelector(".main__header")
  .getBoundingClientRect();
const { top: secondaryContentTop } = document
  .querySelector(".main__secondary-content")
  .getBoundingClientRect();

const draggableArea = secondaryContentTop - headerHeight;
const startFromBottomDestination = draggableArea * -1;
const startFromTopDestination = 0;

window.startDraggingHandler = (event) => {
  event.stopPropagation();
  isDragging = true;
  dragginStartedFrom =
    yDrag.value === startFromTopDestination ? "bottom" : "top";
  initialDragClientY = event.touches[0].clientY;
};

window.draggingHandler = (event) => {
  event.stopPropagation();
  if (!isDragging) return;
  const { clientY } = event.touches[0];
  let draggingValue = clientY - initialDragClientY;
  if (dragginStartedFrom === "top") {
    draggingValue = startFromBottomDestination + draggingValue;
  }
  yDrag.value = draggingValue;
};

window.stopDraggingHandler = (event) => {
  event.stopPropagation();
  if (!isDragging) return;
  isDragging = false;
  const { clientY } = event.changedTouches[0];
  dragginStartedFrom === "bottom"
    ? handleBottomDestination(clientY)
    : handleTopDestination(clientY);
};

const handleTopDestination = (clientY) => {
  const hasPassedHalf = yDrag.value * -1 < draggableArea / 2;
  if (!hasPassedHalf) {
    yDrag.value = startFromBottomDestination;
    return;
  }
  yDrag.value = startFromTopDestination;
};
const handleBottomDestination = (clientY) => {
  const hasPassedHalf = yDrag.value * -1 > draggableArea / 2;
  if (!hasPassedHalf) {
    yDrag.value = startFromTopDestination;
    return;
  }
  yDrag.value = startFromBottomDestination;
};
