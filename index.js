const imdbMovieScrap = require('./scripts/imdbMovieScrap.js')
const imdbTVScrap = require('./scripts/imdbTVScrap.js')
const info = require('./scripts/info.js')
const image = require('./scripts/image.js')
const twitter = require('./scripts/twitter.js')
const uniqueRandom = require('unique-random')

async function start() {
    const random = uniqueRandom(0, 1)
    if (random() == 0){
        List = await imdbMovieScrap()
    }
    else{
        List = await imdbTVScrap()
    }
    console.log(List)
    const randomList = uniqueRandom(0, List.length)
    infoList = await info(List[randomList()])
    infoList = await image(infoList)
    twitter(infoList) 
}

start()