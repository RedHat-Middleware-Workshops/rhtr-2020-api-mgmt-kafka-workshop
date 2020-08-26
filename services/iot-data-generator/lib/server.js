'use strict'

require('make-promises-safe')

const createGenerator = require('./generator')
const createDataloader = require('./dataloader')
const express = require('express')
const log = require('barelog')
const { HTTP_PORT } = require('./config')

function startServer (dataloader) {
  const app = express()

  // Mounts liveness/readiness probes
  require('kube-probe')(app)

  app.use(require('compression')())

  app.get('/meters', (req, res) => {
    res.json(dataloader.getMeters())
  })

  app.get('/junctions', (req, res) => {
    res.json(dataloader.getMeters())
  })

  app.get('/', (req, res) => {
    res.end('IoT data generator service. Try visiting /meters or /junctions')
  })

  app.use((err, req, res, next) => {
    log(`express server error: occurred processing request to ${req.method} ${req.url}`)
    log(err)
    res.end('internal server error')
  })

  app.listen(HTTP_PORT, (err) => {
    if (err) {
      throw err
    }

    log(`🚀 IoT data generator server started on port ${HTTP_PORT}`)
  })
}

(async function main () {
  const dataloader = await createDataloader()
  await createGenerator(dataloader.getJunctions(), dataloader.getMeters())
  startServer(dataloader)
})()
