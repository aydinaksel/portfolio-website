console.log("Aydin's Site Loaded");

function setVhVar() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', setVhVar);
window.addEventListener('load', setVhVar);
