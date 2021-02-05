document.addEventListener(
  'readystatechange',
  () => {
    if (document.readyState === 'complete') {
      let script = document.createElement('script');

      script.text = `${removeBlockingModal}\n${formatParagraphs}\n${scrollPage}\n${setScroll}\n${setStopScroll}\n${setPercentageScroll}\n${setNextPrevChapter}\n(${main})()`;

      document.body.appendChild(script);
    } else {
      setInterval(main, 2000, false);
    }
  },
  false
);

function main() {
  const url = window.location.href;
  if (url.includes('wuxiaworld')) {
    localStorage.visitedChapterSet = '';
    removeBlockingModal();
    formatParagraphs();
  }

  const scrollSpeed = 1;

  if (url.includes('wuxiaworld') || url.includes('novel')) {
    const id = scrollPage(scrollSpeed);
    console.log('To stop scroll press "s" or type:', `clearInterval(${id})`);
    setStopScroll(id);
  }

  setScroll(scrollSpeed);
  setPercentageScroll();
  setNextPrevChapter(url);
}

function removeBlockingModal() {
  const blockingBoxes = document.querySelectorAll('.modal-backdrop, .fade.in');
  const disabledTexts = document.querySelectorAll('.text-disabled');

  if (blockingBoxes && disabledTexts) {
    document.body.style.overflow = 'initial';
    blockingBoxes.forEach((element) => element.remove());
    disabledTexts.forEach((element) => {
      element.classList.remove('text-disabled');
    });
  }
}

function formatParagraphs() {
  const contentArea =
    document.querySelector('div.content-area') || document.querySelector('div.cha-words');

  if (contentArea) {
    const allPTags = contentArea.querySelectorAll('p');

    allPTags.forEach((p) => {
      const div = document.createElement('div');
      const br = document.createElement('br');
      const newP = p.cloneNode(true);

      div.append(newP, br);
      p.replaceWith(div);
    });
  }
}

function scrollPage(speed = 1) {
  const id = setInterval(
    (speed) => {
      document.documentElement.scrollTop += speed;
    },
    100,
    speed
  );

  return id;
}

function setScroll(speed) {
  window.addEventListener('keydown', (event) => {
    if (event.key === 'k') {
      const id = scrollPage(speed);
      console.log('To stop scroll press "s" or type:', `clearInterval(${id})`);
      setStopScroll(id);
    }
  });
}

function setStopScroll(id) {
  window.addEventListener('keydown', (event) => {
    if (event.key === 's') {
      clearInterval(id);
    }
  });
}

function setPercentageScroll() {
  window.addEventListener('keydown', (event) => {
    const height = document.documentElement.scrollHeight;
    for (let percentage = 0; percentage < 10; percentage++) {
      if (event.key === `${percentage}`) {
        document.documentElement.scrollTop = (percentage / 10) * height;
      }
    }
  });
}

function setNextPrevChapter(url) {
  window.addEventListener('keydown', (e) => {
    const currentNovel = e.view.location.pathname;
    let previousChapterLink = currentNovel;
    let nextChapterLink = currentNovel;

    if (url.includes('novelmania')) {
      const [prevButton, nextButton] = document.querySelectorAll('.p-prev, .p-next');
      const [prev, next] = [prevButton.querySelector('a'), nextButton.querySelector('a')];

      if (prev) {
        previousChapterLink = prev.href;
      }

      if (next) {
        nextChapterLink = next.href;
      }
    } else {
      const currentChapter = Number(currentNovel.split('-').pop());

      nextChapterLink = currentNovel.replace(currentChapter, currentChapter + 1);
      previousChapterLink = currentNovel.replace(
        currentChapter,
        currentChapter - 1 >= 0 ? currentChapter - 1 : 0
      );
    }

    if (e.key === 'ArrowRight') {
      location = nextChapterLink;
    } else if (e.key === 'ArrowLeft') {
      location = previousChapterLink;
    }
  });
}
