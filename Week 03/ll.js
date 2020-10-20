// const reg = /([0-9\.]+)|([ \t\n\r]+)|([\r\n]+)|(\+)|(\-)|(\*)|(\/)/g;
const reg = /([0-9\.]+)|(\+)|(\-)|(\*)|(\/)/g;

// const dic = ["Number", "Whitespace", "LineTerminator", "+", "-", "*", "/"];
const dic = ["Number", "+", "-", "*", "/"];

function tokenize(token) {
  var match = null;
  var result = [];
  while (true) {
    // 获取上一次匹配的最后字符的 index。
    let lastIndex = reg.lastIndex;
    match = reg.exec(token);
    if (!match) break;
    // 如果当前匹配的最后字符 index 减去上一次匹配的最后字符 index 的长度比现在匹配到的字符长，代表有不认识的字符出现。
    if (lastIndex - reg.lastIndex > match[0].length) break;
    for (let i = 1; i <= dic.length; i++) {
      const type = dic[i - 1];
      if (match[i]) {
        result.push({
          type,
          value: match[i]
        })
      }
    }
  }
  result.push({
    type: "EOF"
  });
  return result;
}

const MultiplicativeExpression = source => {
  if (source[0].type === 'Number') {
    let node = {
      type: 'MultiplicativeExpression',
      children: [source[0]]
    };
    source[0] = node;
    return MultiplicativeExpression(source);
  }

  if (source[0].type === 'MultiplicativeExpression' && source[1] && source[1].type === '*') {
    let node = {
      type: 'MultiplicativeExpression',
      operator: '*',
      children: []
    };
    node.children.push(source.shift());
    node.children.push(source.shift());
    node.children.push(source.shift());
    source.unshift(node);
    return MultiplicativeExpression(source);
  }
  if (source[0].type === 'MultiplicativeExpression' && source[1] && source[1].type === '/') {
    let node = {
      type: 'MultiplicativeExpression',
      operator: '/',
      children: []
    };
    node.children.push(source.shift());
    node.children.push(source.shift());
    node.children.push(source.shift());
    source.unshift(node);
    return MultiplicativeExpression(source);
  }

  if (source[0].type === 'MultiplicativeExpression') return source[0];

  return MultiplicativeExpression(source[0])
};

const AdditiveExpression = source => {
  if (source[0].type === 'MultiplicativeExpression') {
    let node = {
      type: 'AdditiveExpression',
      children: [source[0]]
    }
    source[0] = node;
    return AdditiveExpression(source);
  }

  if (source[0].type === 'AdditiveExpression' && source[1] && source[1].type === '+') {
    let node = {
      type: 'AdditiveExpression',
      operator: '+',
      children: []
    };
    node.children.push(source.shift());
    node.children.push(source.shift());
    MultiplicativeExpression(source);
    node.children.push(source.shift());
    source.unshift(node);
    return AdditiveExpression(source);
  }

  if (source[0].type === 'AdditiveExpression' && source[1] && source[1].type === '-') {
    let node = {
      type: 'AdditiveExpression',
      operator: '-',
      children: []
    };
    node.children.push(source.shift());
    node.children.push(source.shift());
    MultiplicativeExpression(source);
    node.children.push(source.shift());
    source.unshift(node);
    return AdditiveExpression(source);
  }

  if (source[0].type === 'AdditiveExpression') return source[0];

  MultiplicativeExpression(source);
  return AdditiveExpression(source);
}

const Expression = source => {
  if (source[0].type === 'AdditiveExpression' && source[1] && source[1].type === 'EOF') {
    let node = {
      type: 'Expression',
      children: [source.shift(), source.shift()]
    };
    source.unshift(node);
    return node;
  }

  AdditiveExpression(source);
  return Expression(source);
}

const evaluate = (node) => {
  if(node.type === "Expression") {
      return evaluate(node.children[0])
  }
  if(node.type === "AdditiveExpression") {
      if(node.operator === '-') {
          return evaluate(node.children[0]) - evaluate(node.children[2]);
      }
      if(node.operator === '+') {
          return evaluate(node.children[0]) + evaluate(node.children[2]);
      }
      return evaluate(node.children[0])
  }
  if(node.type === "MultiplicativeExpression") {
      if(node.operator === '*') {
          return evaluate(node.children[0]) * evaluate(node.children[2]);
      }
      if(node.operator === '/') {
          return evaluate(node.children[0]) / evaluate(node.children[2]);
      }
      return evaluate(node.children[0])
  }
  if(node.type === "Number") {
      return Number(node.value);
  }
}

const input = document.querySelector('input');
const button = document.querySelector('button');
const textarea = document.querySelector('textarea');
const span = document.querySelector('span');
button.addEventListener('click', () => {
  const tokens = tokenize(input.value);
  const ast = Expression(tokens);
  const result = evaluate(ast);
  span.innerHTML = `运算结果：${result}，下面为该四则运算的 AST：`;
  textarea.value = JSON.stringify(ast, null, 2);
})