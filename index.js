const imdbMovieScrap = require('./scripts/imdbMovieScrap.js')
const imdbTVScrap = require('./scripts/imdbTVScrap.js')
const info = require('./scripts/info.js')
const image = require('./scripts/image.js')

async function start() {
    // List = await imdbMovieScrap()
    // console.log(List)
    // infoList = await info(List[9])
    infoList = [ 'Valley Girl', 1983, 'Comedy, Romance', 'Martha Coolidge', 'N/A' ]
    infoList = await image(infoList)
    console.log(infoList)  
}

start()