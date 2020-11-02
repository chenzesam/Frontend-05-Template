const cbs = new Map();
const reactivities = new Map();
let depCb = null;
const effect = (cb) => {
  depCb = cb;
  cb();
  depCb = null;
}

const addCb = (obj, prop) => {
  if (!cbs.has(obj)) cbs.set(obj, new Map());
  if (!cbs.get(obj).has(prop)) cbs.get(obj).set(prop, []);
  cbs.get(obj).get(prop).push(depCb);
}

const reactive = object => {
  if (reactivities.has(object)) return reactivities.get(object);
  const proxy = new Proxy(object, {
    set(obj, prop, val) {
      obj[prop] = val;
      if (cbs.get(obj)) {
        if (cbs.get(obj).get(prop))
        for (const cb of cbs.get(obj).get(prop)) {
          cb && cb();
        }
      }
      return true;
    },
    get(obj, prop) {
      // 如果子项是 object，则递归循环依赖。
      if (typeof obj[prop] === 'object') return reactive(obj[prop]);
      addCb(obj, prop);
      return obj[prop];
    }
  });

  reactivities.set(object, proxy);
  return proxy;
};