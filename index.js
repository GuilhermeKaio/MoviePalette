const imdbMovieScrap = require('./scripts/imdbmoviescrap.js')
//const imdbTVScrap = require('./scripts/imdbtvscrap.js')
const info = require('./scripts/info.js')
const image = require('./scripts/image.js')
const twitter = require('./scripts/twitter.js')
const uniqueRandom = require('unique-random')

async function start() {
    List = await imdbMovieScrap()
    console.log(List)
    const randomList = uniqueRandom(0, List.length)
    infoList = await info(List[randomList()])
    infoList = await image(infoList)
    twitter(infoList) 
}

start()
