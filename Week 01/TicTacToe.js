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

let curPlayer = O;

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
  chesses[i] = curPlayer;
  render();
  if (check(chesses, curPlayer)) {
    alert(`${curPlayer === O ? 'O' : 'X'} 胜利`);
    return;
  }
  curPlayer = curPlayer === O ? X : O;
  aiMove();
}

const aiMove = () => {
  const bestP = bestChoice(chesses, curPlayer);
  chesses[bestP] = curPlayer;
  render();
  if (check(chesses, curPlayer)) {
    alert(`${curPlayer === O ? 'O' : 'X'} 胜利`);
    return;
  }
  curPlayer = curPlayer === O ? X : O;
}

// 检测某个棋是否胜利。
const check = (chesses, player) => {
  // 判断横
  for (let i = 0; i < 3; i++) {
    let win = true;
    for (let j = 0; j < 3; j++) {
      if (chesses[i * 3 + j] !== player) win = false;
    }
    if (win) return win;
  }

  // 判断竖
  for (let i = 0; i < 3; i++) {
    let win = true;
    for (let j = 0; j < 3; j++) {
      if (chesses[j * 3 + i] !== player) win = false;
    }
    if (win) return win;
  }
  // 判断斜线。
  let win = true;
  for (let i = 0; i < 3; i++) {
    if (chesses[i * 3 + 2 - i] !== player) win = false;
  }
  if (win) return win;

  // 判断正斜线。
  win = true;
  for (let i = 0; i < 3; i++) {
    if (chesses[i * 3 + i] !== player) win = false;
  }
  if (win) return win;

  return false;
}

// 判断 player 是否会赢。可废弃
const willWill = (chesses, player) => {
  for (let i = 0; i < chesses.length; i++) {
    const chess = chesses[i];
    if (chess !== NULL) {
      continue;
    }
    const clone = chesses.slice();
    clone[i] = player;
    if (check(clone, player)) {
      return i;
    }
  }
  return -1;
}

// 找出最好的下棋位置，使用 minimax 算法。
const bestChoice = (chesses, player) => {
  let bestResult = -Infinity;
  let bestMove = null;
  for (let i = 0; i < chesses.length; i++) {
    const chess = chesses[i];
    if (chess !== NULL) {
      continue
    }
    chesses[i] = player;
    const result = minimax(false, chesses, player === O ? X : O);
    chesses[i] = NULL;
    if (result > bestResult) {
      bestResult = result;
      bestMove = i;
    }
  }
  return bestMove;
}

// 判断棋盘是否还有位置可以下。
const canMove = (chesses) => {
  for (let i = 0; i < chesses.length; i++) {
    const chess = chesses[i];
    if (chess === NULL) {
      return true;
    }
  }
  return false;
}

// minimax 算法。
const minimax = (isMax, chesses, player) => {
  // 如果是 isMax（AI 下棋 ）赢了，则返回分数 1，否则则代表是对手赢了，AI 得 -1 分。
  if (check(chesses, player)) {
    return isMax ? 1 : -1;
  }

  // 原理同上，如果 AI 输了，则得 -1 分，如果对手输了，则得 1 分。
  if (check(chesses, player === O ? X : O)) {
    return isMax ? -1 : 1;
  }

  // 如果是和局，返回分数 0.
  if (!canMove(chesses)) {
    return 0;
  }

  if (isMax) {
    let bestResult = -Infinity;
    for (let i = 0; i < chesses.length; i++) {
      const chess = chesses[i];
      if (chess !== NULL) {
        continue;
      }
      chesses[i] = player;
      const result = minimax(!isMax, chesses, player === O ? X : O);
      bestResult = Math.max(result, bestResult);
      chesses[i] = NULL;
    }
    return bestResult;
  } else {
    let worstResult = Infinity;
    for (let i = 0; i < chesses.length; i++) {
      const chess = chesses[i];
      if (chess !== NULL) {
        continue;
      }
      chesses[i] = player;
      const result = minimax(!isMax, chesses, player === O ? X : O);
      worstResult = Math.min(result, worstResult);
      chesses[i] = NULL;
    }
    return worstResult;
  }
}

render();