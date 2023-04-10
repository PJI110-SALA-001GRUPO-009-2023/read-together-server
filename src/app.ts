import express from 'express'
import expressEjsLayouts from 'express-ejs-layouts'
import morgan from 'morgan'
import { morganStream } from './logger'
import sessaoService from './services/sessaoService'
import bodyParser from 'body-parser'
import multer from 'multer'
import router from './routes/routerCentral'

const app = express()
app.use(morgan(':status :method : url – :total-time', {stream: morganStream}))
app.use(sessaoService)
app.use('/views', express.static('views'))
app.use(express.static('public'))

app.use(expressEjsLayouts)
app.set('layout', './layouts/layout')
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended: true}))
app.use(multer().array('imagem-capa'))
app.use(router)

app.get('/', (req, res) => {
    res.render('index', { title: 'Home | Read Together' })
})

export default app