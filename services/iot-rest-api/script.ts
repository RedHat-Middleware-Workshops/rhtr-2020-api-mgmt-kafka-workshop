require('make-promises-safe')

import { meter, meter_update, PrismaClient } from '@prisma/client'
import { SwaggerOptions } from '@fastify/swagger'
import fastify from 'fastify'
import config, { DATABASE_URL, HTTP_PORT, NODE_ENV } from './config'

const signals = ['SIGINT', 'SIGTERM']
const app = fastify({
  logger: NODE_ENV === 'dev'
})

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL ? DATABASE_URL : buildDbUrl()
    }
  }
})

function buildDbUrl () {
  const {
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_PORT,
    DB_DATABASE
  } = config
  return `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`
}

type GetMetersQuery = {
  page: number
  search?: string
  status?: 'available'|'occupied'|'out-of-service'|'unknown'
}

const opts: SwaggerOptions = {
  routePrefix: '/documentation',
  swagger: {
    info: {
      title: 'City Parking Meters API',
      description: 'Provides a REST interface to the city parking meters',
      version: '0.1.0'
    },
    schemes: ['http','https'],
    consumes: ['application/json'],
    produces: ['application/json']
  },
  exposeRoute: true
}

app.register(require('@fastify/swagger'), opts)

app.route<{ Querystring: GetMetersQuery }>({
  method: 'GET',
  url: '/meters',
  schema: {
    response: {
      200: {
        type: 'array',
        description: 'List of parking meters and their latest status, if known.',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            address: { type: 'string' },
            latitude: { type: 'number' },
            longitude: { type: 'number' },
            status: {
              anyOf: [
                {
                  type: 'object',
                  properties: {
                    timestamp: {
                      type: 'number'
                    },
                    status_text: {
                      type: 'string',
                      enum: ['available', 'occupied', 'out-of-service', 'unknown']
                    }
                  }
                },
                {
                  type: 'null'
                }
              ]
            }
          }
        }
      }
    },
    querystring: {
      type: 'object',
      properties: {
        page: {
          type: 'number'
        },
        search: {
          type: 'string'
        },
        status: {
          type: 'string'
        }
      }
    }
  },
  handler: async (req) => {
    const { page = 1, search, status } = req.query
    const pageSize = 20

    const meters = await prisma.meter.findMany({
      take: pageSize,
      skip: pageSize * page,
      // Perform text search on the address if "search" is present in query
      where: search ? {
        address: {
          search: search.split(' ').join(' & ')
        }
      } : undefined,

      include: {
        meter_update: {
          where: status ? {
            status_text: status
          } : undefined,
          take: 1,
          orderBy: {
            timestamp: 'desc'
          }
        }
      }
    })

    return meters.map((m: meter & { meter_update: meter_update[]; }) => {
      const {
        meter_update,
        id,
        latitude,
        longitude,
        address
      } = m

      return {
        status: meter_update[0] ? { status_text: meter_update[0].status_text, timestamp: meter_update[0].timestamp } : null,
        id,
        latitude,
        longitude,
        address
      }
    })
  }
})


type GetMeterParams = {
  id: string
}

app.route<{ Params: GetMeterParams }>({
  method: 'GET',
  url: '/meters/:id',
  schema: {
    response: {
      404: {
        type: 'object',
        properties: {}
      },
      200: {
        type: 'object',
        description: 'The parking meter details, including status if known.',
        properties: {
          id: { type: 'string' },
          address: { type: 'string' },
          latitude: { type: 'number' },
          longitude: { type: 'number' },
          status: {
            anyOf: [
              {
                type: 'object',
                properties: {
                  timestamp: {
                    type: 'number'
                  },
                  status_text: {
                    type: 'string'
                  }
                }
              },
              {
                type: 'null'
              }
            ]
          }
        }
      }
    },
    params: {
      type: 'object',
      properties: {
        id: {
          description: 'The meter ID',
          type: 'string'
        }
      }
    }
  },
  handler: async (req) => {
    const meterId = req.params.id

    const meter = await prisma.meter.findUnique({
      where: {
        id: meterId
      },
      include: {
        meter_update: {
          take: 1,
          orderBy: {
            timestamp: 'desc'
          }
        }
      }
    })

    console.log('found meter', meter)

    if (!meter) {
      return {}
    } else {
      const {
        meter_update,
        id,
        latitude,
        longitude,
        address
      } = meter

      return {
        status: meter_update[0] ? { status_text: meter_update[0].status_text, timestamp: meter_update[0].timestamp } : null,
        id,
        latitude,
        longitude,
        address
      }
    }

  }
})

signals.forEach((sig: string) => {
  process.on(sig, () => {
    console.log(`exiting due to ${sig}`)
    process.exit(0)
  })
});

app.listen(HTTP_PORT, '0.0.0.0', (err) => {
  if (err) {
    throw err
  }

  console.log(`listening on 0.0.0.0:${HTTP_PORT}`)
});
