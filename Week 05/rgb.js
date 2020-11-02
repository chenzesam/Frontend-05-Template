let o = {
  r: 0,
  g: 0,
  b: 0
};
let p = reactive(o);
const r = document.querySelector('#r');
const g = document.querySelector('#g');
const b = document.querySelector('#b');
const rgb = document.querySelector('#rgb');
effect(() => {
  r.value = p.r;
  g.value = p.g;
  b.value = p.b;
  rgb.style.backgroundColor = `rgb(${p.r},${p.g},${p.b})`
});

r.addEventListener('input', e => p.r = e.target.value);
g.addEventListener('input', e => p.g = e.target.value);
b.addEventListener('input', e => p.b = e.target.value);