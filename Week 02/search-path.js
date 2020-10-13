const container = document.querySelector('.root');
const button = document.querySelector('button');
const map = JSON.parse(localStorage.getItem('map')) || Array(100 * 100).fill(0);
const path = [];
// 存储所有点的 dom 节点。
const pointDivs = [];
let isClear = false;
let isMouseDown = false;
// 方向函数
const dirs = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1]
];

class MinHeap {
  constructor (fn) {
    this.data = [null];
    this.count = 0;
    this.fn = fn;
  }

  take() {
    const top = this.data[1];
    this.data[1] = this.data[this.count];
    this.count--;
    let i = 1;
    let n = this.count;
    while (true) {
      let minPos = i;
      if (i * 2 <= n && this.fn(this.data[i]) > this.fn(this.data[i * 2])) minPos = i * 2;
      if (i * 2 + 1 <= n && this.fn(this.data[minPos]) > this.fn(this.data[i * 2 + 1])) minPos = i * 2 + 1;
      if (minPos == i) break;
      [this.data[i], this.data[minPos]] = [this.data[minPos], this.data[i]]
      i = minPos;
    }
    return top;
  }

  push(value) {
    this.count++;
    this.data[this.count] = value;
    let i = this.data.length - 1;
    while (Math.floor(i / 2) > 0 && this.fn(this.data[i]) < this.fn(this.data[Math.floor(i / 2)])) {
      [this.data[i], this.data[Math.floor(i / 2)]] = [this.data[Math.floor(i / 2)], this.data[i]];
      i = Math.floor(i / 2);
    }
  }
}

const init = () => {
  for (let x = 0; x < 100; x++) {
    for (let y = 0; y < 100; y++) {
      const point = map[x * 100 + y];
      const pointDiv = document.createElement('div');
      pointDiv.classList.add('point');
      pointDiv.style.backgroundColor = point === 1 ? 'black' : 'grey';
      pointDiv.addEventListener('mouseover', () => {
        if (isMouseDown) {
          if (isClear) {
            map[x * 100 + y] = 0;
            pointDiv.style.backgroundColor = 'grey';
          } else {
            map[x * 100 + y] = 1;
            pointDiv.style.backgroundColor = 'black';
          }
        }
      });
      pointDivs[x * 100 + y] = pointDiv;
      container.appendChild(pointDiv)
    }
  }
}

const sleep = (timeout) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, timeout * 1000);
  })
}

const find = async (map, startPoint, endPoint) => {
  const [endX, endY] = endPoint;
  const [startX, startY] = startPoint;
  const distance = ([x, y]) => ((x - endX) ** 2 + (y - endY) ** 2);
  // const distance = ([x, y]) => (Math.abs(x - startX) + Math.abs(y - startY) + Math.abs(x - endX) + Math.abs(y - endY));

  const queue = new MinHeap(distance);
  queue.push(startPoint);

  const insert = async (point, prePoint) => {
    const [x, y] = point;
    if (x < 0 || x > 99 || y < 0 || y > 99) {
      return
    }

    // 黑色的点，则跳过。
    if (map[x * 100 + y] === 1 || path[x * 100 + y]) return;

    pointDivs[x * 100 + y].style.backgroundColor = 'lightgreen';
    path[x * 100 + y] = prePoint;
    queue.push([x, y]);
    await sleep(0.01);
  }

  const showPath = async (x, y) => {
    while (x !== startPoint[0] || y !== startPoint[1]) {
      pointDivs[x * 100 + y].style.backgroundColor = 'pink';
      [x, y] = path[x * 100 + y];
      await sleep(0.01);
    }
    pointDivs[x * 100 + y].style.backgroundColor = 'pink';
  }

  while (queue.data.length) {
    const [x, y] = queue.take();
    if (x === endPoint[0] && y === endPoint[1]) {
      await showPath(x, y);
      return true
    };
    for (let i = 0; i < dirs.length; i++) {
      const [offsetX, offsetY] = dirs[i];
      const nextX = offsetX + x;
      const nextY = offsetY + y;
      await insert([nextX, nextY], [x, y]);
    }
  }
  return false;
}

document.addEventListener('mousedown', (e) => {
  isMouseDown = true;
  isClear = e.button === 2;
});
document.addEventListener('contextmenu', e => {
  e.preventDefault();
})

document.addEventListener('mouseup', () => {
  isMouseDown = false;
});

button.addEventListener('click', e => {
  localStorage.setItem('map', JSON.stringify(map));
});

init();