var Twit = require('twit')
var fs = require('fs')
//const dotenv = require('dotenv')


async function start(infoList) {
    await tweetImage(infoList)
}

function tweetImage(infoList) {
    //dotenv.config()
    var T = new Twit({
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        access_token: process.env.ACCESS_TOKEN,
        access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    })

    var b64content = fs.readFileSync('./content/final.jpg', { encoding: 'base64' })

    T.post('media/upload', { media_data: b64content }, function (err, data, response) {

        var mediaIdStr = data.media_id_string
        var altText = `${infoList[0]} (${infoList[1]})`
        var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }

        T.post('media/metadata/create', meta_params, function (err, data, response) {
            if (!err) {
                textstatus = `${infoList[0]} (${infoList[1]}) \r\n\r\n Dir.: ${infoList[3]}`
                var params = { status: textstatus, media_ids: [mediaIdStr] }

                T.post('statuses/update', params, function (err, data, response) {
                    if (!err) {
                        PTid = data.id_str
                        console.log('Tweet Realizado!');
                        
                    }
                    else {
                        console.log(err)
                    }

                })
            }
            else {
                console.log(err)
            }
        })
    })
}

module.exports = start

