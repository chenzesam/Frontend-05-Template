const O = Symbol('O');
const X = Symbol('X');
const NULL = Symbol('NULL');

// 容器
const container = document.querySelector('.root');

// 已经下了的棋子，1 代表圈，2 代表叉。
let chesses = [
  NULL, NULL, NULL,
  NULL, NULL, NULL,
  NULL, NULL, NULL
];

let curColor = O;

// 渲染期盼。
const render = () => {
  container.innerHTML = '';
  for (let i = 0; i < chesses.length; i++) {
    const chess = chesses[i];
    const chessDiv = document.createElement('span');
    chessDiv.classList.add('chess');
    chessDiv.innerText = chess === O ? 'O' : chess === X ? 'X' : ' ';
    chess === NULL && chessDiv.addEventListener('click', () => move(i));
    container.appendChild(chessDiv);
    // 如果是第三个和第六个，则换行。
    if ((i + 1) / 3 === 1 || (i + 1) / 3 === 2) {
      container.appendChild(document.createElement('br'));
    }
  }
};

// 下棋动作。
const move = (i) => {
  chesses[i] = curColor;
  render();
  if (check(chesses, curColor)) {
    alert(`${curColor === O ? 'O' : 'X'} 胜利`);
    return;
  }
  curColor = curColor === O ? X : O;
  aiMove();
}

const aiMove = () => {
  const p = bestChoice(chesses, curColor).point;
  console.log('p :>> ', p);
  console.log('minMax :>> ', minMax(chesses, curColor));
  chesses[p] = curColor;
  render();
  if (check(chesses, curColor)) {
    alert(`${curColor === O ? 'O' : 'X'} 胜利`);
    return;
  }
  curColor = curColor === O ? X : O;
}
// 当 ai 要走的时候，需要判断剩下的所有情况。基本原则如下：
// 当 ai 要走的时候，获取最好的结果。当对手要走的时候，获取最坏的结果。
const bestChoice = (chesses, color) => {
  const p = willWill(chesses, color);
  // 如果有可是胜出的点，那么直接选出来。
  if (p !== -1) {
    return {
      point: p,
      result: 1
    }
  }
  let result = -2;
  let point = null;
  // 循环 + 递归判断每种下法最后的结果。
  for (let i = 0; i < chesses.length; i++) {
    const chess = chesses[i];
    if (chess !== NULL) {
      continue;
    }
    const clone = chesses.slice();
    clone[i] = color;
    let r = bestChoice(clone, color === O ? X : O).result;
    // 下一步最不好的结果，证明当前步最好。
    if (-r > result) {
      result = -r;
      point = i;
    }
  }

  // 如果 point 为 null，则为和局，result 为 0。
  return {
    point,
    result: point === null ? 0 : result
  }
}

// 检测某个棋是否胜利。
const check = (chesses, color) => {
  // 判断横
  for (let i = 0; i < 3; i++) {
    let win = true;
    for (let j = 0; j < 3; j++) {
      if (chesses[i * 3 + j] !== color) win = false;
    }
    if (win) return win;
  }

  // 判断竖
  for (let i = 0; i < 3; i++) {
    let win = true;
    for (let j = 0; j < 3; j++) {
      if (chesses[j * 3 + i] !== color) win = false;
    }
    if (win) return win;
  }
  // 判断斜线。
  let win = true;
  for (let i = 0; i < 3; i++) {
    if (chesses[i * 3 + 2 - i] !== color) win = false;
  }
  if (win) return win;

  // 判断正斜线。
  win = true;
  for (let i = 0; i < 3; i++) {
    if (chesses[i * 3 + i] !== color) win = false;
  }
  if (win) return win;

  return false;
}

const willWill = (chesses, color) => {
  for (let i = 0; i < chesses.length; i++) {
    const chess = chesses[i];
    if (chess !== NULL) {
      continue;
    }
    const clone = chesses.slice();
    clone[i] = color;
    if (check(clone, color)) {
      return i;
    }
  }

  return -1;
}
render();