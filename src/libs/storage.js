export const setStorage = (name, value) => {
  if (window.localStorage) {
    window.localStorage.setItem(name, value);
  } else {
    this.setCookie(name, value);
  }
};

export const getStorage = (name) => {
  if (window.localStorage) {
    return window.localStorage.getItem(name);
  } else {
    return this.getCookie(name);
  }
};

export const removeStorage = (name) => {
  if (window.localStorage) {
    window.localStorage.removeItem(name);
  } else {
    this.removeCookie(name);
  }
};

export const setSession = (key, value) => {
  const session = window.sessionStorage;
  if (session) {
    session.setItem(key, value);
  }
};
export const getSession = (key) => {
  const session = window.sessionStorage;
  if (session) {
    return session.getItem(key);
  }
};

export const removeSession = (key) => {
  const session = window.sessionStorage;
  if (session) {
    session.removeItem(key);
  }
};

/* expires为秒 */
export const setCookie = (name, value, expires) => {
  const oDate = new Date();

  if (oDate) {
    oDate.setTime(oDate.getTime() + expires * 1000);
  }

  document.cookie = [
    name + '=' + decodeURIComponent(value),
    expires ? 'expires' + '=' + oDate.toGMTString() : '',
    'path=/'
  ].join('; ');
};

export const getCookie = (name) => {
  const cookies = document.cookie;
  let res = null;
  if (cookies.indexOf(name) < 0) return null;
  (cookies.split('; ') || []).map((item) => {
    let ret = item.indexOf('=');
    const sName = item.substring(0, ret);
    if (sName === name) {
      res = item.substring(ret + 1, item.length);
    }
  });
  return res;
};

export const removeCookie = (name) => {
  this.setCookie(name, null, -1);
};
