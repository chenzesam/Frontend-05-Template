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
]

class Sorted {
  constructor (compare = (a, b) => a - b) {
    this.data = [];
    this.compare = compare;
  }

  // 获取最小的值
  take() {
    if (!this.data.length) {
      return;
    }
    let index = 0;
    let value = this.data[index];

    for (let i = 1; i < this.data.length; i++) {
      const nextValue = this.data[i];
      // 如果前一个值比后一个值的大的话，取后面的小值。
      if (this.compare(value, nextValue) > 0) {
        index = i;
        value = nextValue;
      }
    }
    this.data[index] = this.data[this.data.length - 1];
    this.data.pop();
    return value;
  }
  push(value) {
    this.data.push(value)
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
  const queue = new Sorted((a, b) => {
    const [preX, preY] = a;
    const [nextX, nextY] = b;
    return distance(preX, preY) - distance(nextX, nextY)
  });
  queue.push(startPoint);

  const distance = (x, y) => ((x - endX) ** 2 + (y - endY) ** 2);

  const insert = async (point, prePoint) => {
    const [x, y] = point;
    if (x < 0 || x > 99 || y < 0 || y > 99) {
      return
    }
    if (map[x * 100 + y]) {
      return
    }
    map[x * 100 + y] = 1;
    queue.push([x, y]);
    path[x * 100 + y] = prePoint;
    pointDivs[x * 100 + y].style.backgroundColor = 'lightgreen';
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