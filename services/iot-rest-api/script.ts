require('make-promises-safe')

import { meter, meter_update, PrismaClient } from '@prisma/client'
import { SwaggerOptions } from '@fastify/swagger'
import { FastifyCorsOptions } from '@fastify/cors'
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

const meterIdParamsSchema = {
  type: 'object',
  properties: {
    id: {
      description: 'The meter ID',
      type: 'string'
    }
  }
}

const meterInfoSchema = {
  type: 'object',
  description: 'The parking meter details, including status if known.',
  properties: {
    id: { type: 'string' },
    address: { type: 'string' },
    latitude: { type: 'number' },
    longitude: { type: 'number' },
    status: {
      type: ['object', 'null'],
      properties: {
        timestamp: {
          type: 'number'
        },
        status_text: {
          type: 'string',
          enum: ['maintenance', 'available', 'occupied', 'out-of-service', 'unknown']
        }
      }
    }
  }
}

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

async function getMeterById (meterId: string) {
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
app.register(require('@fastify/cors'), {
  // Enable CORS in dev mode
  origin: NODE_ENV === 'dev'
} as FastifyCorsOptions)

app.route<{ Querystring: GetMetersQuery }>({
  method: 'GET',
  url: '/meters',
  schema: {
    response: {
      200: {
        type: 'array',
        description: 'List of parking meters and their latest status, if known.',
        items: meterInfoSchema
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
    /**
     * This query does not take into account that some meters may not yet have
     * a status.
     *
     * A better, but ugly, raw SQL query is available here https://gist.github.com/evanshortiss/ddcffaef631b61e6a42ccb46f90d3cd2#fetch-all-meters-with-given-status
     * This raw query works if you change meter_info => meter and meter_status_evals01 => meter_update
     */
    const { page = 1, search, status } = req.query
    const pageSize = 50

    const meters = await prisma.meter.findMany({
      take: pageSize,
      skip: pageSize * page,
      // Perform text search on the address if "search" is present in query
      where: {
        address: {
          search: search
        }
      },

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
      200: meterInfoSchema
    },
    params: meterIdParamsSchema
  },
  handler: async (req) => getMeterById(req.params.id)
})

type MeterUpdateBody = {
  status: 'maintenance'|'available'|'unknown'|'out-of-service'|'occupied'
}
type MeterUpdateParams = {
  id: string
}


app.route<{ Body: MeterUpdateBody, Params: MeterUpdateParams }>({
  method: 'POST',
  url: '/meters/:id',
  schema: {
    params: meterIdParamsSchema,
    body: {
      type: 'object',
      properties: {
        status: {
          enum: ['maintenance', 'available', 'unknown', 'out-of-service', 'occupied']
        }
      }
    },
    response: {
      200: meterInfoSchema
    }
  },
  handler: async (req, reply) => {
    const { status } = req.body
    const { id } = req.params

    await prisma.meter_update.create({
      data: {
        meter_id: id,
        status_text: status,
        timestamp: new Date()
      }
    })

    return getMeterById(id)
  }
})

signals.forEach((sig: string) => {
  process.on(sig, () => {
    app.log.info(`exiting due to ${sig}`)
    process.exit(0)
  })
});

app.listen(HTTP_PORT, '0.0.0.0', (err) => {
  if (err) {
    throw err
  }

  app.log.info(`listening on 0.0.0.0:${HTTP_PORT}`)
});
