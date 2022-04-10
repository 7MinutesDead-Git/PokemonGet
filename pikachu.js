const pokeAPI = 'https://pokeapi.co/api/v2/'
const searchType = 'pokemon/'

function renderPokemon(json) {
    const spriteTypes = json['sprites']
    for (const sprite in spriteTypes) {
        const url = spriteTypes[sprite]
        if (typeof url === 'string' && url.startsWith('https')) {
            const newImg = document.createElement("img")
            newImg.src = url
            document.querySelector('.pikachu-container').appendChild(newImg)
            console.log(url)
        }
    }
}
function getPokemon(reqURL) {
    fetch(reqURL)
        .then(res => res.json())
        .then(json => {
            console.log(json)
            renderPokemon(json)
        })
        .then(() => {
            // A slight delay so the animation has time to play.
            setTimeout(revealNewPokemon, 50)
        })
        .catch(error => {
            console.log(`Error when fetching: ${error}`)
        })
}

function revealNewPokemon() {
    document.querySelectorAll('img').forEach(img => img.style.opacity = '1')
}

function getAndRevealPokemon() {
    const searchTarget = document.querySelector('#pokesearch').value.toLowerCase().trim()
    console.log(searchTarget)
    const pokeURL = `${pokeAPI}${searchType}${searchTarget}`
    getPokemon(pokeURL)
}

function flashElements(...elements) {
    for (const element of elements) {
        element.classList.add('flicker')
        setTimeout(() => {
            element.classList.remove('flicker')
        }, 200)
    }
}

function destroyPokemon() {
    const allImages = document.querySelectorAll('img')
    for (const img of allImages) {
        img.remove()
    }
}

window.onload = () => {
    const searchButton = document.querySelector('#pokesearch-button')
    const searchInput = document.querySelector('#pokesearch')
    const clearButton = document.querySelector('#clear')

    searchButton.addEventListener('click', () => {
        getAndRevealPokemon()
        flashElements(searchButton, searchInput, document.body)
    })
    // Also submit on hitting enter.
    searchInput.addEventListener('keyup', e => {
        if (e.keyCode === 13) {
            getAndRevealPokemon()
            flashElements(searchButton, searchInput, document.body)
        }
    })

    clearButton.addEventListener('click', () => {
        destroyPokemon()
        flashElements(document.body, clearButton)
    })
}