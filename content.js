function scroll(x, y) {
    document.documentElement.scroll({behavior: "smooth", top: y})
}

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

    const id = setInterval(() => {
        scroll(0, document.documentElement.scrollTop)
        
        document.documentElement.scrollTop += 2
    }, 200)
    
    console.log("Interval id:" + id, 'Type clearInterval(id) to stop scroll')
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

function setStopScroll(id) {
    window.addEventListener("keydown", (event) => {
        if(event.key === "s") {
            clearInterval(id)
        }
    })
}