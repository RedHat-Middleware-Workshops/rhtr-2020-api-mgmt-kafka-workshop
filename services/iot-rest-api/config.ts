import { get } from 'env-var'

const config = {
  DATABASE_URL: get('DATABASE_URL').asString(),
  DB_PORT: get('DB_PORT').default('5432').asPortNumber(),
  DB_USER: get('DB_USER').default('rhtr-user').asString(),
  DB_PASSWORD: get('DB_PASSWORD').default('rhtr-pass').asString(),
  DB_DATABASE: get('DB_DATABASE').default('city-info').asString(),
  DB_HOST: get('DB_HOST').default('iot-psql').asString(),
  HTTP_PORT: get('HTTP_PORT').default('8080').asPortNumber(),
  HTTP_RESPONSE_DELAY: get('HTTP_RESPONSE_DELAY').default('0').asIntPositive(),
  NODE_ENV: get('NODE_ENV').default('dev').asEnum(['dev', 'prod'])
}

export = config
