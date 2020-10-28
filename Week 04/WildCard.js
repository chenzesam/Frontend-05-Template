const find = (source, pattern) => {
  let startCount = 0;
  for (let i = 0; i < pattern.length; i++) {
    const char = pattern[i];
    if (char === '*') startCount++;
  }

  if (startCount === 0) {
    for (let i = 0; i < pattern.length; i++) {
      const char = pattern[i];
      if (char !== source[i] && char !== '?') return false;
    }
    return true;
  }

  let i = 0;
  for (i = 0; pattern[i] !== '*'; i++) {
    const char = pattern[i];
    if (char !== source[i] && char !== '?') return false
  }

  let lastIndex = i;

  for (let p = 0; p < startCount - 1; p++) {
    i++;
    let subPattern = '';
    while (pattern[i] !== '*') {
      subPattern += pattern[i];
      i++;
    }

    let reg = new RegExp(subPattern.replace(/\?/g, "[\\s\\S]"), 'g');
    reg.lastIndex = lastIndex;
    if (!reg.exec(source)) return false;
    lastIndex = reg.lastIndex;
  }

  for (let i = 0; i <= source.length - lastIndex && pattern[pattern.length - i] !== '*'; i++) {
    if (pattern[pattern.length - i] !== source[source.length - i] && pattern[pattern.length - i] !== '?') {
      return false;
    }
  }

  return true;
}