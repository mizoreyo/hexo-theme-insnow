function switchTheme() {
  let cssElement = document.createElement('link');
  cssElement.setAttribute('rel', 'stylesheet');
  cssElement.setAttribute('href', '/css/prism/material-dark.css');
  document.body.appendChild(cssElement);
}