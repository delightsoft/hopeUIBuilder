export default function goTo(e, to) {
  const path = e.path || (e.composedPath && e.composedPath()) || composedPath(e.target);
  if (!path.find(path => path.classList?.contains('no-go-to'))) {
    this.$router.push(to);
  }
}

const composedPath = (el) => {
  let path = [];
  while (el) {
    path.push(el);
    if (el.tagName === 'HTML') {
      path.push(document);
      path.push(window);
      return path;
    }
    el = el.parentElement;
  }
};
