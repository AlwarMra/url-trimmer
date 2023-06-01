const express = require('express')
const mongoose = require('mongoose')
const shortUrl = require('./models/shortUrl')

const app = express()

mongoose.connect('mongodb://localhost:27017/urlShortener', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))

app.get('/', async (req, res) => {
  const shortUrls = await shortUrl.find()
  res.render('index', { shortUrls })
})

app.post('/shortUrls', async (req, res) => {
  await shortUrl.create({ full: req.body.url })
  res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
  const newUrl = await shortUrl.findOne({ short: req.params.shortUrl })
  if (newUrl === null) return res.sendStatus(404)

  newUrl.clicks++
  newUrl.save()
  res.redirect(newUrl.full)
})

app.listen(process.env.PORT || 5000)
