setTimeout(() => {
    const url = window.location.href

    // remove protection ATG
    if(url.includes('against-the-gods')) {
        document.body.style.overflow = 'initial'
        document.querySelectorAll('.modal-backdrop, .fade.in').forEach(element => element.remove())
        document.querySelectorAll('.text-disabled').forEach(element => {
            element.classList.remove('text-disabled')
        })
    }
    
    // add identation to KOG
    const contentAre = document.querySelector('div.content-area') || document.querySelector('div.cha-words')
    if(url.includes('king-of-gods') && contentAre) {
        const allPTags = contentAre.querySelectorAll('p')

        allPTags.forEach(p => {
            const div = document.createElement('div')
            const br = document.createElement('br')
            const newP = p.cloneNode(true)
            
            div.append(newP, br)
            
            p.replaceWith(div)
        })
    }

    alert('divirta-se')

}, 2000)