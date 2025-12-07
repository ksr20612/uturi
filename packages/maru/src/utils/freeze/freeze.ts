function freeze<T extends object>(component: T, symbol: symbol): T {
  Object.defineProperty(component, symbol, {
    value: true,
    writable: false,
    enumerable: false,
    configurable: false,
  });

  return component;
}

export default freeze;
