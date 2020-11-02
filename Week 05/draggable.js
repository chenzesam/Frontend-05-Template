const draggable = document.querySelector('#draggable');
const container = document.querySelector('#container');
let [baseX,baseY] = [0, 0];
draggable.addEventListener("mousedown", e => {
  const startX = e.clientX;
  const startY = e.clientY;
  const up = e => {
    baseX = e.clientX - startX + baseX;
    baseY = e.clientY - startY + baseY;
    document.removeEventListener("mousemove", move);
    document.removeEventListener("mouseup", up);
  };
  const move = e => {
    const range = getInsertRange(e.clientX, e.clientY);
    range.insertNode(draggable);
    // draggable.style.transform = `translate(${e.clientX - startX + baseX}px,${e.clientY - startY + baseY}px)`;
  }
  document.addEventListener("mousemove", move);
  document.addEventListener("mouseup", up);
});

const ranges = [];

for (let i = 0; i < container.childNodes[0].textContent.length; i++) {
  const range = document.createRange();
  range.setStart(container.childNodes[0], i);
  range.setEnd(container.childNodes[0], i);
  ranges.push(range);
}

const getInsertRange = (x, y) => {
  let min = Infinity;
  let container = null;
  for (const range of ranges) {
    const {x: rectX, y: rectY} = range.getBoundingClientRect();
    const distance = (x - rectX) ** 2 + (y - rectY) ** 2;
    if (distance < min) {
      min = distance;
      container = range;
    }
  }
  return container;
}

document.addEventListener("selectstart", e => e.preventDefault());