const imdb = require('imdb-api')

async function getInfo(name){
    movie = await imdb.get({name: name}, {apiKey: process.env.apiKeyIMDB, timeout: 30000})
    infoList = [name, movie.year, movie.genres, movie.director, movie.awards]

    return infoList
}


module.exports = getInfo