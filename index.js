const imdbMovieScrap = require('./scripts/imdbMovieScrap.js')
const imdbTVScrap = require('./scripts/imdbTVScrap.js')
const info = require('./scripts/info.js')

async function start() {
    List = await imdbMovieScrap()
    console.log(List)
    infoList = await info(List[9])
    console.log(infoList)  
}

start()