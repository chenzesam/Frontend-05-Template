const lights = document.querySelectorAll('.light');
const green = document.querySelector('.green');
const red = document.querySelector('.red');
const yellow = document.querySelector('.yellow');

const clear = () => {
  lights.forEach(light => {
    light.classList.remove('bright');
  })
}

const sleep = (second) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, second * 1000)
  })
}

const go = async () => {
  greenGo();
  await sleep(3);
  redGo();
  await sleep(2);
  yellowGo();
  await sleep(1);
  go();
}

const greenGo = () => {
  clear();
  green.classList.add('bright');
}

const redGo = () => {
  clear();
  red.classList.add('bright');
}

const yellowGo = () => {
  clear();
  yellow.classList.add('bright');
}

go();