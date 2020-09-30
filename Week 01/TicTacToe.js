const O = Symbol("O");
const X = Symbol("X");
const NULL = Symbol("NULL");

// 容器
const container = document.querySelector(".root");

// 已经下了的棋子，1 代表圈，2 代表叉。
let chesses = [NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL];

let curPlayer = O;

// 渲染期盼。
const render = () => {
  container.innerHTML = "";
  for (let i = 0; i < chesses.length; i++) {
    const chess = chesses[i];
    const chessDiv = document.createElement("span");
    chessDiv.classList.add("chess");
    chessDiv.innerText = chess === O ? "O" : chess === X ? "X" : " ";
    chess === NULL && chessDiv.addEventListener("click", () => move(i));
    container.appendChild(chessDiv);
    // 如果是第三个和第六个，则换行。
    if ((i + 1) / 3 === 1 || (i + 1) / 3 === 2) {
      container.appendChild(document.createElement("br"));
    }
  }
};

// 下棋动作。
const move = (i) => {
  chesses[i] = curPlayer;
  render();
  if (check(chesses, curPlayer)) {
    alert(`${curPlayer === O ? "O" : "X"} 胜利`);
    return;
  }
  curPlayer = curPlayer === O ? X : O;
  aiMove();
};

const aiMove = () => {
  const bestP = bestChoice(chesses, curPlayer);
  chesses[bestP] = curPlayer;
  render();
  if (check(chesses, curPlayer)) {
    alert(`${curPlayer === O ? "O" : "X"} 胜利`);
    return;
  }
  curPlayer = curPlayer === O ? X : O;
};

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
};

// 找出最好的下棋位置，使用 minimax 算法。
const bestChoice = (chesses, player) => {
  let bestResult = -Infinity;
  let bestMove = null;
  let bestDepth = Infinity;
  for (let i = 0; i < chesses.length; i++) {
    const chess = chesses[i];
    if (chess !== NULL) {
      continue;
    }
    chesses[i] = player;
    const { result, depth: resultDepth } = minimax(false, chesses, player === O ? X : O, -Infinity, +Infinity, 0);
    chesses[i] = NULL;

    // 和 minimax 算法同理，AI 是 maximizer，所以取大 result，小 depth。
    if (result > bestResult) {
      bestResult = result;
      bestMove = i;
      bestDepth = resultDepth;
    } else if (result === bestResult) {
      if (resultDepth < bestDepth) {
        bestMove = i;
        bestDepth = resultDepth;
      }
    }
  }
  return bestMove;
};

// 判断棋盘是否还有位置可以下。
const canMove = (chesses) => {
  for (let i = 0; i < chesses.length; i++) {
    const chess = chesses[i];
    if (chess === NULL) {
      return true;
    }
  }
  return false;
};

// minimax 算法。
const minimax = (isMax, chesses, player, alpha, beta, depth) => {
  // 如果是 isMax（AI 下棋 ）赢了，则返回分数 1，否则则代表是对手赢了，AI 得 -1 分。
  if (check(chesses, player)) {
    return {
      result: isMax ? 1 : -1,
      depth
    }
  }

  // 原理同上，如果 AI 输了，则得 -1 分，如果对手输了，则得 1 分。
  if (check(chesses, player === O ? X : O)) {
    return {
      result: isMax ? -1 : 1,
      depth
    };
  }

  // 如果是和局，返回分数 0.
  if (!canMove(chesses)) {
    return {
      result: 0,
      depth
    };
  }

  if (isMax) {
    let bestResult = -Infinity;
    let bestDepth = Infinity;
    for (let i = 0; i < chesses.length; i++) {
      const chess = chesses[i];
      if (chess !== NULL) {
        continue;
      }
      chesses[i] = player;
      const { result, depth: resultDepth } = minimax(!isMax, chesses, player === O ? X : O, alpha, beta, depth + 1);
      chesses[i] = NULL;

      // maximizer 尽可能的取得最短的胜利路径。
      // 如果是更好的结果，那么就取这个结果。
      if (result > bestResult) {
        bestResult = result;
        bestDepth = resultDepth;
      // 如果是一样的结果，那么就取路径更短的结果。
      } else if (result === bestResult) {
        if (resultDepth < bestDepth) {
          bestDepth = resultDepth;
        }
      }

      // alpha beta 剪枝算法。
      alpha = Math.max(alpha, bestResult);
      if (beta <= alpha) {
        break;
      }
    }
    return {
      result: bestResult,
      depth: bestDepth
    };
  } else {
    let worstResult = Infinity;
    let bestDepth = Infinity;
    for (let i = 0; i < chesses.length; i++) {
      const chess = chesses[i];
      if (chess !== NULL) {
        continue;
      }
      chesses[i] = player;
      const { result, depth: resultDepth } = minimax(!isMax, chesses, player === O ? X : O, alpha, beta, depth + 1);
      chesses[i] = NULL;
      
      // minimizer 尽可能的取得最长的胜利路径。
      // 如果结果更坏，那就取这个结果。
      if (result < worstResult) {
        worstResult = result;
        bestDepth = resultDepth;
      // 如果是一样的结果，那么就取路径更长的结果。
      } else if (result === worstResult) {
        if (resultDepth > bestDepth) {
          bestDepth = resultDepth;
        }
      }

      // alpha beta 剪枝算法。
      beta = Math.min(beta, worstResult);
      if (beta <= alpha) {
        break;
      }
    }
    return {
      result: worstResult,
      depth: bestDepth
    };
  }
};

render();

// 以下注释打开，可自动下棋，首棋随机选。
// (function () {
//   const random = Math.floor(Math.random() * 8);
//   console.log(random)
//   move(random)
// })();

// setInterval(() => {
//   if (canMove(chesses)) {
//     aiMove();
//   }
// }, 1000)
