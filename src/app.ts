import express from 'express'
import expressEjsLayouts from 'express-ejs-layouts'
import morgan from 'morgan'
import logger, { morganStream } from './logger'
import sessaoService from './services/sessaoService'
import bodyParser from 'body-parser'
import multer from 'multer'
import router from './routes'
import { autenticacaoServiceInstance } from './services/autenticacaoService'

const app = express()
app.use(sessaoService)
app.use(autenticacaoServiceInstance.session())
app.use((req, res, next) => {
    logger.defaultMeta = {...logger.defaultMeta, sessao: req.sessionID, socket: req.socket.remoteAddress}
    next()
})
app.use(morgan(':method :url Recebido', {stream: morganStream, immediate: true}))
app.use(morgan(':method :url :status – :total-time Enviado', {stream: morganStream}))
app.use('/views', express.static('views'))
app.use(express.static('public'))

app.use(expressEjsLayouts)
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ limit: '10mb' }))
app.use(multer().array('imagem'))
app.use(router)

export default app
