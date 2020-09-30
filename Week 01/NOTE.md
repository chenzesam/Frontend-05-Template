# Week 01 学习笔记

## TicTacToe

挺有意思的题目，下棋和判断输赢的逻辑都挺简单的，比较难的是 AI 算法。winter 老师使用的方法在我理解来看是以比较简单的方式展示出来的，他是基于 “我们最好，对手最坏。对手最好，我们最好” 的原则，进行了负负得正的辗转递归取值法，硬理解起来其实是比较难的。于是我就上网找了一下 TicTacToe 的 AI 算法，发现了一个叫做 [minimax](https://www.geeksforgeeks.org/minimax-algorithm-in-game-theory-set-1-introduction/?ref=lbp) 的算法，它就是用来作为传统的棋类（两两对战）AI 算法的，所以通过理解和吸收最终使用了 minimax 算法来完成了 TicTacToe 作业。以下是几点注意点：

1. 攻略中的 minimax 算法，是假定了 AI 对手作为主角的，所以它在计分算法里面是直接判断如果是 player 赢那么就得到正分，否则 opponent 赢就得到负分。但是我的写法里面并没有 player 和 opponent 的概念，所以就判断了 isMax 如果是 ture 就代表为 AI，而 AI 在这个算法里面是主角，因此赢了需要得 1 分，而如果 isMax 为 false，则代表是 AI 的对手，这时候如果它赢了，AI 就要得 -1 分。其实也是 “我们最好，对手最坏。对手最好，我们最好” 这个原理。

2. 采用了一位数组的方式进行棋谱的存储，这时候判断是否胜利的时候需要进行一定的转化，平时多练，就能够记住它们的规律了，大概就是要记住每行每列有多少个数，然后通过这个数进行加减乘除就可以了。

## 红绿灯（traffic-lights）

使用了 async/await 的方式来实现，要注意 sleep 方法需要返回 Promise，不然会直接把 Mac 变成暖宝宝。
