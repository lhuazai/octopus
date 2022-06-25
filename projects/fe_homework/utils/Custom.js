/* eslint-disable */
class LxBlank extends HTMLElement {
  get content () {
    return this.getAttribute('content');
  }

  set content (val) {
    this.setAttribute('content', val);
  }
}

class LxBracket extends HTMLElement {
  get content () {
    return this.getAttribute('content');
  }

  set content (val) {
    this.setAttribute('content', val);
  }
}

class LxEmphasis extends HTMLElement {
  get content () {
    return this.getAttribute('content');
  }

  set content (val) {
    this.setAttribute('content', val);
  }
}

class LxUnderline extends HTMLElement {
  get content () {
    return this.getAttribute('content');
  }

  set content (val) {
    this.setAttribute('content', val);
  }
}
if (window.customElements && window.customElements.define) {
  window.customElements.define('lx-blank', LxBlank);
  window.customElements.define('lx-bracket', LxBracket);
  window.customElements.define('lx-emphasis', LxEmphasis);
  window.customElements.define('lx-underline', LxUnderline);
} else {
  // console.log('iiii', document.registerElement);
  console.log('iiii888', window);
}
/* eslint-disable */

