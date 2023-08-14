const express = require("express")
const https = require("https")
const bodyParser = require("body-parser")
const app = express()
const port = 3000

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'))

let weatherData;

app.get('/', function(req, res) {
    res.render('index')
})

app.post('/', function(req, res) {
    const apiKey = '8da6825cfd27d16a449ec469ac02e9d5'
    const cityName = req.body.city_name.toUpperCase()
    const openWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + apiKey + '&units=metric'
    
    https.get(openWeatherUrl, function(response) {
        response.on('data', (d) => {
            weatherData = JSON.parse(d)
            if(weatherData.cod === '404') {
                const context = {
                    cityName: cityName,
                }
                res.render('404', context)
            } else {
                const temp = weatherData.main.temp
                const description = weatherData.weather[0].description
                const image_code = weatherData.weather[0].icon
                const image_url = `https://openweathermap.org/img/wn/${image_code}@2x.png`
                const minTemp = weatherData.main.temp_min
                const maxTemp = weatherData.main.temp_max

                const context = {    
                    cityName: cityName,
                    temp: temp,
                    description: description,
                    image_url: image_url,
                    minTemp: minTemp,
                    maxTemp: maxTemp,
                }

                res.render('weather-info', context)
            }
        })
    })
})


app.listen(port, function() {
    console.log(`http://localhost:${port}`);
})