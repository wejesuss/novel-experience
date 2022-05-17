let scrollSpeed = 1;
let delay = 200;
const intervalIds = [];

const unblockNovels = {
  wuxiaworld: {
    removeBlockingModal: removeBlockingModal,
    setNextPrevChapter: () => {
      window.addEventListener('keydown', addNextPrevChapter);
    },
    unsetNextPrevChapter: () => {
      window.removeEventListener('keydown', addNextPrevChapter);
    },
    main: () => {
      const that = unblockNovels.wuxiaworld;
      localStorage.visitedChapterSet = '';
      localStorage.removeItem('anon-chapters-read');
      that.removeBlockingModal();
      that.setNextPrevChapter();
    },
  },
  novelmania: {
    removeBlockingModal: removeBlockingModal,
    getNextPrevChapter: (event) => {
      const currentChapter = event.location.href;

      const [
        previousChapterLink = currentChapter,
        nextChapterLink = currentChapter,
      ] = getNextPrevChapter('.p-prev a', '.p-next a');

      if (event.key === 'ArrowRight') {
        location = nextChapterLink;
      } else if (event.key === 'ArrowLeft') {
        location = previousChapterLink;
      }
    },
    setNextPrevChapter: () => {
      window.addEventListener(
        'keydown',
        unblockNovels.novelmania.getNextPrevChapter
      );
    },
    unsetNextPrevChapter: () => {
      window.removeEventListener(
        'keydown',
        unblockNovels.novelmania.getNextPrevChapter
      );
    },
    main: () => {
      const that = unblockNovels.wuxiaworld;
      that.removeBlockingModal();
      that.setNextPrevChapter();
    },
  },
};

function main() {
  const url = window.location.href;
  setScroll();
  setPercentageScroll();

  Object.entries(unblockNovels).forEach(([domain, website]) => {
    if (url.includes(domain)) {
      website.main();
    }
  });
}

function unsetAll() {
  unsetPercentageScroll();
  unsetScroll();
  unsetStopScroll();
  unsetNextPrevChapter();
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

function getNextPrevChapter(prevSelector, nextSelector, currentChapter) {
  let previousChapterLink = currentChapter;
  let nextChapterLink = currentChapter;
  const prev = document.querySelector(`${prevSelector}`);
  const next = document.querySelector(`${nextSelector}`);

  if (prev) {
    previousChapterLink = prev.href;
  }

  if (next) {
    nextChapterLink = next.href;
  }

  return [previousChapterLink, nextChapterLink];
}

function addNextPrevChapter(event) {
  const pathname = location.pathname.split('-');
  const currentChapter = Number(pathname.pop());
  const previousChapter = currentChapter - 1;
  const nextChapter = currentChapter + 1;

  const previousChapterLink = pathname.concat(previousChapter).join('-');
  const nextChapterLink = pathname.concat(nextChapter).join('-');

  if (event.key === 'ArrowRight') {
    location = nextChapterLink;
  } else if (event.key === 'ArrowLeft') {
    location = previousChapterLink;
  }
}

function removeBlockingModal() {
  const blockingBoxes = document.querySelectorAll('.modal-backdrop, .fade.in');
  const disabledTexts = document.querySelectorAll('.text-disabled,.no-select');

  if (blockingBoxes.length && disabledTexts.length) {
    document.body.style.overflow = 'initial';
    blockingBoxes.forEach((element) => element.remove());
    disabledTexts.forEach((element) =>
      element.classList.remove('text-disabled', 'no-select')
    );
  }
}

function formatParagraphs() {
  const contentArea =
    document.querySelector('div.content-area') ||
    document.querySelector('div.cha-words');

  if (contentArea) {
    const pTags = contentArea.querySelectorAll('p');

    pTags.forEach((p) => {
      const div = document.createElement('div');
      const br = document.createElement('br');
      const newP = p.cloneNode(true);

      div.append(newP, br);
      p.replaceWith(div);
    });
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

function unsetNextPrevChapter() {
  Object.values(unblockNovels).forEach((website) => {
    website.unsetNextPrevChapter();
  });
}
