const pokeAPI = 'https://pokeapi.co/api/v2/'
const searchType = 'pokemon/'

function renderPokemon(json) {
    const container = document.querySelector('.pikachu-container')
    const spriteTypes = json['sprites']
    let previousPokemon = null

    for (const sprite in spriteTypes) {
        const url = spriteTypes[sprite]

        if (typeof url === 'string' && url.startsWith('https')) {
            const pokemon = document.createElement("img")
            pokemon.src = url

            // Don't ask me why yet.
            pokemon.addEventListener('click', (e) => {
                const currentSize = parseInt(getComputedStyle(e.target).width)
                e.target.style.width = `${currentSize + 90}px`
                e.target.style.height = `${currentSize + 90}px`
            })
            container.appendChild(pokemon)
            // // If shifting new pokemon to the front is desired, uncomment.
            // if (!previousPokemon)
            //     container.appendChild(pokemon)
            // else
            //     container.insertBefore(pokemon, previousPokemon)
            // previousPokemon = document.querySelector('img:first-of-type')
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
            toggleLoadingIcon()
            setTimeout(revealNewPokemon, 30)
        })
        .catch(error => {
            const errorElement = document.querySelector('span.error-text')
            errorElement.innerText = `${error}`
            flashElements(errorElement)
            toggleLoadingIcon()
        })
}

function revealNewPokemon() {
    document.querySelectorAll('img').forEach(img => img.style.opacity = '1')
}

function getAndRevealPokemon() {
    const searchTarget = document.querySelector('#pokesearch').value.toLowerCase().trim()
    if (searchTarget.length > 0) {
        console.log(searchTarget)
        const pokeURL = `${pokeAPI}${searchType}${searchTarget}`
        getPokemon(pokeURL)
    }
    else {
        const errorElement = document.querySelector('span.error-text')
        errorElement.innerText = "You gotta enter something!"
        flashElements(errorElement)
        toggleLoadingIcon()
    }
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
        img.style.opacity = "0"
        setTimeout(() => img.remove(), 500)
    }
}

function toggleLoadingIcon() {
    document.querySelector('.lds-roller').classList.toggle('reveal')
}

window.onload = () => {
    const searchButton = document.querySelector('#pokesearch-button')
    const searchInput = document.querySelector('#pokesearch')
    const clearButton = document.querySelector('#clear')

    searchButton.addEventListener('click', () => {
        toggleLoadingIcon()
        getAndRevealPokemon()
        flashElements(searchButton, searchInput, document.body)
    })
    // Also submit on hitting enter.
    searchInput.addEventListener('keyup', e => {
        if (e.keyCode === 13) {
            toggleLoadingIcon()
            getAndRevealPokemon()
            flashElements(searchButton, searchInput, document.body)
        }
    })

    clearButton.addEventListener('click', () => {
        destroyPokemon()
        flashElements(document.body, clearButton)
    })
}