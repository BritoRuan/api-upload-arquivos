const express = require('express')
const { uploadFile, getFiles, uploadFileMultiple, deleteFiles } = require('./controllers/controllers')
const multer = require('./middlewares/multer')

const rotas = express()

rotas.use(express.json())

rotas.get('/archive', getFiles)

rotas.post('/upload', multer.single('arquivo'), uploadFile)
rotas.post('/upload-multiple', multer.array('arquivo'), uploadFileMultiple)

rotas.delete('/delete', deleteFiles)

module.exports = rotas
