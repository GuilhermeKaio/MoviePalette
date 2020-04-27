const puppeteer = require('puppeteer')

async function start() {
    movies = await getMovies()
    return movies
}

async function getMovies() {
    movies = []
    aux = await scrapMovies()

    for (let index = 0; index < aux.length; index++) {
        if ((index % 2) == 0) { }
        else {
            movies.push(aux[index]);
        }
    }
    return movies
}

async function scrapMovies() {
    let scrape = async () => {
        const browser = await puppeteer.launch({ headless: true, args: ["--proxy-server='direct://'", '--proxy-bypass-list=*', '--no-sandbox', '--disable-setuid-sandbox'] })
        const page = await browser.newPage()
        await page.setDefaultNavigationTimeout(0)
        await page.goto('https://www.imdb.com/chart/moviemeter/')

        const result = await page.evaluate(() => {
            const books = []
            document.querySelectorAll('div > div > div > div > div > div > div > span > div > div > div > table > tbody > tr > td > a')
                .forEach(book => books.push(book.textContent))
            return books
        })

        browser.close()
        return result
    };
    aux = []
    await scrape().then(async (value) => {
        aux = value
    })

    return aux
}

module.exports = start