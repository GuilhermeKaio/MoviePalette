const google = require('googleapis').google
const customSearch = google.customsearch('v1')
const imageDownloader = require('image-downloader')
const path = require('path')
const getColors = require('get-image-colors')
const rgbHex = require('rgb-hex')
const { createCanvas, loadImage } = require('canvas')
var fs = require('fs')
const chroma = require('chroma-js')
const hexSorter = require('hexSorter')


async function start(info) {
    ImageList = await fetchGoogleAndReturnImagesLinks(info[0])
    downloadedImage = await downloadImages(ImageList)
    colors = await getPalette()
    info.push(downloadedImage)
    info.push(colors)
    return info
}

async function fetchGoogleAndReturnImagesLinks(query) {
    //dotenv.config()
    const response = await customSearch.cse.list({
        auth: 'AIzaSyCqNjjLi1qqmNOD1ZljMBakv0pZkQD13Ck',
        cx: '012043904672707755401:khhh1f3vtxo',
        q: query + ' Movie Screencaps',
        searchType: 'image',
        num: 5
    })

    const imagesUrl = response.data.items.map((item) => {
        return item.link
    })

    return imagesUrl
}

async function downloadImages(ImageList) {
    var ok = true
    num = 0
    while (ok) {
        imageUrl = ImageList[num]
        try {
            await downloadAndSave(imageUrl, `screencap.jpg`)
            console.log(`Image successfully downloaded: ${imageUrl}`)
            ok = false
        }
        catch (error) {
            console.log(`Download Error (${imageUrl}): ${error}`)
            ok = true
            num += 1
        }
    }
    return imageUrl
}

async function downloadAndSave(url, fileName) {
    return imageDownloader.image({
        url: url,
        dest: `./content/${fileName}`
    })
}

async function getPalette() {
    const options = {
        count: 11,
        type: 'image/jpg'
    }
    RGBcolors = await getColors(path.join(__dirname, '../content/screencap.jpg'), options)
    colors = []
    for (let index = 0; index <= 9; index++) {
        color = RGBcolors[index]._rgb
        hex = rgbHex(color[0], color[1], color[2])
        colors.push('#' + hex)
    }

    var sortedColors = hexSorter.sortColors(colors, 'mostBrightColor')

    for (let index = 0; index <= 9; index++) {
        const canvasPalette = createCanvas(64, 123)
        const contextPalette = canvasPalette.getContext('2d')
        contextPalette.fillStyle = sortedColors[index]
        contextPalette.fillRect(0, 0, 64, 123)
        const buffer = canvasPalette.toBuffer('image/png')
        fs.writeFileSync(`./content/color${index + 1}.jpg`, buffer)
    }

    const canvasBackground = createCanvas(680, 510)
    const contextBackground = canvasBackground.getContext('2d')
    contextBackground.fillStyle = "#ffffff"
    contextBackground.fillRect(0, 0, 680, 510)

    loadImage('./content/color1.jpg').then(image => {
        contextBackground.drawImage(image, 6, 380, 64, 123)
        const buffer = canvasBackground.toBuffer('image/png')
        fs.writeFileSync(`./content/background1.jpg`, buffer)
    })

    for (let num = 2; num <= 10; num++) {
        width = (num - 1) * 72 + 1
        await loadImage('./content/color' + num + '.jpg').then(image1 => {
            if (num == 2) {
                contextBackground.drawImage(image1, width, 380, 64, 123)
                const buffer = canvasBackground.toBuffer('image/png')
                fs.writeFileSync('./content/background' + num + '.jpg', buffer)
            }
            else {
                width = width - ((num - 2) * 5)
                contextBackground.drawImage(image1, width, 380, 64, 123)
                const buffer = canvasBackground.toBuffer('image/png')
                fs.writeFileSync('./content/background' + num + '.jpg', buffer)
            }
        })
    }
    await compositeImageSource()
    
    async function compositeImageSource() {
        var height
        var width
    
        await loadImage('./content/screencap.jpg').then(image => {
          if (image.width < image.height) {
            height = image.height
            width = (image.height * 1.81)
          }
          else {
            height = (image.width * 0.55)
            width = image.width
          }
          const canvasCrop = createCanvas(width, height)
          const contextCrop = canvasCrop.getContext('2d')
    
          sx = (image.width - width)/2
          sy = (image.height - height)/2

          contextCrop.drawImage(image, sx, sy, width, height, 0, 0, width, height)
    
          const buffer = canvasCrop.toBuffer('image/png')
          fs.writeFileSync('./content/screencap-resize.jpg', buffer)
        })
    
        const canvasFinal = createCanvas(680, 510)
        const contextFinal = canvasFinal.getContext('2d')
    
        await loadImage('./content/background10.jpg').then(image => {
          contextFinal.drawImage(image, 0, 0, 680, 510)
          loadImage('./content/screencap-resize.jpg').then(image1 => {
            contextFinal.drawImage(image1, 6, 5, 668,369)
            const buffer = canvasFinal.toBuffer('image/png')
            fs.writeFileSync('./content/final.jpg', buffer)
          })
        })
      } 

    return sortedColors
}

module.exports = start