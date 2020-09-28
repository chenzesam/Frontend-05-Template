// 容器
const container = document.querySelector('.root');

// 已经下了的棋子，1 代表圈，2 代表叉。
let chesses = [
  0, 0, 1,
  0, 2, 0,
  0, 0, 0
];

let curColor = 1;

// 渲染期盼。
const render = () => {
  container.innerHTML = '';
  for (let i = 0; i < chesses.length; i++) {
    const chess = chesses[i];
    const chessDiv = document.createElement('span');
    chessDiv.classList.add('chess');
    chessDiv.innerText = chess === 1 ? 'O' : chess === 2 ? 'X' : ' ';
    chessDiv.addEventListener('click', () => move(i));
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
  if (check(curColor)) {
    alert('胜利')
  }
  curColor = 3 - curColor;
}

// 检测某个棋是否胜利。
const check = (color) => {
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
render();