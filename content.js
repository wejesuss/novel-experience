const STORAGE_ACTIVE_IN = 'readerActiveIn';

let scrollSpeed = 1;
let delay = 100;
const intervalIds = [];

function main() {
  setScroll();
  setPercentageScroll();
}

function stopScroll(event) {
  if (event.key === 's') {
    intervalIds.forEach((id) => clearInterval(id));
  }
}

function scrollPage(speed = 1) {
  const id = setInterval(
    (speed) => {
      document.documentElement.scrollTop += speed;
    },
    delay,
    speed
  );

  return id;
}

function scrollWithKey(event) {
  if (event.key === 'k') {
    const id = scrollPage(scrollSpeed);
    intervalIds.push(id);
    setStopScroll();
  }
}

function addPercentageScroll(event) {
  const height = document.documentElement.scrollHeight;
  for (let percentage = 0; percentage < 10; percentage++) {
    if (event.key === `${percentage}`) {
      document.documentElement.scrollTop = (percentage / 10) * height;
    }
  }
}

function setStopScroll() {
  window.addEventListener('keydown', stopScroll);
}

function unsetStopScroll() {
  stopScroll({ key: 's' });
  window.removeEventListener('keydown', stopScroll);
}

function setScroll() {
  window.addEventListener('keydown', scrollWithKey);
}

function unsetScroll() {
  window.removeEventListener('keydown', scrollWithKey);
}

function setPercentageScroll() {
  window.addEventListener('keydown', addPercentageScroll);
}

function unsetPercentageScroll() {
  window.removeEventListener('keydown', addPercentageScroll);
}

main();
