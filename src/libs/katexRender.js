export function KaTexRenderDom (dom) {
  if (!dom) {
    return;
  }
  window.renderMathInElement(dom,
    {
      'delimiters': [
        { left: '$$', right: '$$', display: true },
        { left: '\\[', right: '\\]', display: true },
        { left: '$', right: '$', display: false },
        { left: '\\(', right: '\\)', display: false }
      ],
      'macros': {
        '\\require': '\\vphantom',
        '\\overparen': '\\overset{\\large{\\frown}}',
        '\\underline': '\\uline{#1}',
        '\\hfill': '',
        '\\parallel': '/\\!/'
      }
    }
  );
};
