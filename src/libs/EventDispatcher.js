
export class EventDispatcher {
  addEventListener (type, listener) {
    if (this._listeners === undefined) this._listeners = {};
    let listeners = this._listeners;
    if (listeners[ type ] === undefined) {
      listeners[ type ] = [];
    }
    if (listeners[ type ].indexOf(listener) === -1) {
      listeners[ type ].push(listener);
    }
  }

  hasEventListener (type, listener) {
    if (this._listeners === undefined) return false;
    let listeners = this._listeners;
    return listeners[ type ] !== undefined && listeners[ type ].indexOf(listener) !== -1;
  }
  /**
   * 根据type索引和回调函数引用删除监听
   * 若删除type所有监听，可以调用removeAllListener
   * @param {any} type 需要删除的索引key
   * @param {function} listener  需要删除对应type的索引方法引用
   */
  removeEventListener (type, listener) {
    if (this._listeners === undefined) return;
    let listeners = this._listeners;
    let listenerArray = listeners[ type ];
    if (listenerArray !== undefined) {
      let index = listenerArray.indexOf(listener);
      if (index !== -1) {
        listenerArray.splice(index, 1);
      }
    }
  }
  /**
   * 根据type索引删除监听
   * @param {any}} type 要删除的索引key
   */
  removeAllListener (type) {
    if (this._listeners === undefined) return;
    let listeners = this._listeners;
    let listenerArray = listeners[ type ];
    let idx = -1;
    if (listenerArray !== undefined) {
      idx = listenerArray.length;
      while (idx > 0) {
        listenerArray.splice(--idx, 1);
      }
    }
  }

  /**
   * 删除所有事件监听
   */
  removeAllTypeListener () {
    if (this._listeners === undefined) return;
    let listeners = this._listeners;
    let listenerTypes = Object.keys(listeners);
    if (Array.isArray(listenerTypes) && listenerTypes.length > 0) {
      for (const type of listenerTypes) {
        this.removeAllListener(type);
        delete listeners[type];
      }
    }
  }

  dispatchEvent (type, ...args) {
    if (this._listeners === undefined) return;
    let listeners = this._listeners;
    let listenerArray = listeners[ type ];
    if (listenerArray !== undefined) {
      let array = listenerArray.slice(0);
      for (let i = 0, l = array.length; i < l; i++) {
        array[i].apply(this, args);
      }
    }
  }

  on (...args) {
    this.addEventListener(...args);
  }
  off (...args) {
    this.removeEventListener(...args);
  }
  emit (...args) {
    this.dispatchEvent(...args);
  }
}
