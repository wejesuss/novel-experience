setTimeout(() => {
    const url = window.location.href

    // remove protection ATG
    if(url.includes('against-the-gods')) {
        document.body.style.overflow = 'initial'
        document.querySelectorAll('.modal-backdrop, .fade.in').forEach(element => element.remove())
        document.querySelectorAll('.text-disabled').forEach(element => {
            element.classList.remove('text-disabled')
        })

        setNextPrevChapter()
    }
    
    // add identation to KOG
    const contentArea = document.querySelector('div.content-area') || document.querySelector('div.cha-words')
    if(url.includes('king-of-gods') && contentArea) {
        const allPTags = contentArea.querySelectorAll('p')

        allPTags.forEach(p => {
            const div = document.createElement('div')
            const br = document.createElement('br')
            const newP = p.cloneNode(true)
            
            div.append(newP, br)
            
            p.replaceWith(div)
        })
    }

    alert('divirta-se')

    const scrollSpeed = 1
    const id = scroll(scrollSpeed)
    
    console.log("Interval id:" + id, 'Type clearInterval(id) to stop scroll')
    setScroll(scrollSpeed)
    setStopScroll(id)
}, 2000)

function setNextPrevChapter() {
    window.addEventListener('keydown', (e) => {
        const currentNovel = e.view.location.pathname
        const currentChapterPosition = currentNovel.lastIndexOf('-')
        const currentChapter = Number(currentNovel.slice(currentChapterPosition + 1))

        const nextChapter = currentChapter + 1
        const previousChapter = currentChapter - 1

        if(e.key === "ArrowRight") {
            location = currentNovel.replace(currentChapter, nextChapter)
        }

        if(e.key === "ArrowLeft") {
            location = currentNovel.replace(currentChapter, previousChapter)
        }
    })
}

function scroll(speed = 1) {
    const id = setInterval((speed) => {
        document.documentElement.scrollTop += speed
    }, 100, speed)

    return id
}

function setScroll(speed) {
    window.addEventListener("keydown", (event) => {
        if(event.key === "k") {
            const id = scroll(speed)
            setStopScroll(id)
        }
    })
}

function setStopScroll(id) {
    window.addEventListener("keydown", (event) => {
        if(event.key === "s") {
            clearInterval(id)
        }
    })
}