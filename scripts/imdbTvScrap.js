const puppeteer = require('puppeteer')

async function start() {
    TV = await getTV()
    return TV
}

async function getTV() {
    TV = []
    aux = await scrapTV()

    for (let index = 0; index < aux.length; index++) {
        if ((index % 2) == 0) { }
        else {
            TV.push(aux[index]);
        }
    }
    return TV
}

async function scrapTV() {
    let scrape = async () => {
        const browser = await puppeteer.launch({ headless: true, args: ["--proxy-server='direct://'", '--proxy-bypass-list=*', '--no-sandbox', '--disable-setuid-sandbox'] })
        const page = await browser.newPage()
        await page.setDefaultNavigationTimeout(0)
        await page.goto('https://www.imdb.com/chart/tvmeter/')

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