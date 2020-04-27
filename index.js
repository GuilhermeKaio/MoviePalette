const imdbScrap = require('./scripts/imdbScrap.js')

async function start() {
    movieList = await imdbScrap()
    console.log(movieList)
}

start()