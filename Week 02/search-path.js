const container = document.querySelector('.root');
const saveButton = document.querySelectorAll('button')[0];
const startButton = document.querySelectorAll('button')[1];
const startInputs = document.querySelectorAll('.startInput');
const endInputs = document.querySelectorAll('.endInput');
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

// class Sorted {
//   constructor (compare = (a, b) => a - b) {
//     this.data = [];
//     this.compare = compare;
//   }

//   // 获取最小的值
//   take() {
//     if (!this.data.length) {
//       return;
//     }
//     let index = 0;
//     let value = this.data[index];

//     for (let i = 1; i < this.data.length; i++) {
//       const nextValue = this.data[i];
//       // 如果前一个值比后一个值的大的话，取后面的小值。
//       if (this.compare(value, nextValue) > 0) {
//         index = i;
//         value = nextValue;
//       }
//     }
//     this.data[index] = this.data[this.data.length - 1];
//     this.data.pop();
//     return value;
//   }
//   push(value) {
//     this.data.push(value)
//   }
// }

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
  const [startX, startY] = startPoint;
  const [endX, endY] = endPoint;
  // 到起点的代价，如果只用 g 方法，是最短路径。
  const g = ([x, y]) => Math.sqrt((x - startX) ** 2 + (y - startY) ** 2);
  // 到终点的预计代价，如果只用 h 方法。是最快搜索算法。
  const h = ([x, y]) => Math.sqrt((x - endX) ** 2 + (y - endY) ** 2);

  const queue = new MinHeap(point => g(point) + h(point));
  queue.push(startPoint);
  let cost = {};
  cost[startPoint[0] * 100 + startPoint[1]] = 0;

  const insert = async (point, prePoint) => {
    const [x, y] = point;
    if (x < 0 || x > 99 || y < 0 || y > 99) {
      return
    }

    // 黑色的点，则跳过。
    if (map[x * 100 + y] === 1) return;

    if (typeof path[x * 100 + y] === 'object') {
      // 如果这个点之前被遍历过来了，则判断它和上一个点的的距离做判断。
      if (cost[x * 100 + y] > cost[prePoint[0] * 100 + prePoint[1]] + 1) {
        path[x * 100 + y] = prePoint;
        cost[x * 100 + y] = cost[prePoint[0] * 100 + prePoint[1]] + 1;
      }
      return;
    }

    pointDivs[x * 100 + y].style.backgroundColor = 'lightgreen';

    // map[x * 100 + y] = 1;
    path[x * 100 + y] = prePoint;
    cost[x * 100 + y] = cost[prePoint[0] * 100 + prePoint[1]] + 1;

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

saveButton.addEventListener('click', e => {
  localStorage.setItem('map', JSON.stringify(map));
});

startButton.addEventListener('click', e => {
  const startPoint = [+startInputs[0].value, +startInputs[1].value];
  const endPoint = [+endInputs[0].value, +endInputs[1].value];
  if (map[startPoint[0] * 100 + startPoint[1]] === 1) {
    alert('起点有障碍，请重新输入')
  } else if (map[endPoint[0] * 100 + endPoint[1]] === 1) {
    alert('终点有障碍，请重新输入')
  } else {
    find(map, startPoint, endPoint)
  }
})

init();