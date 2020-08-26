import { get } from 'env-var'

const config = {
  MONGODB: {
    DB_USER: get('DB_USER').required().asString(),
    DB_PASSWORD: get('DB_PASSWORD').required().asString(),
    DB_HOST: get('DB_HOST').required().asString(),
    DB_PORT: get('DB_PORT').required().asPortNumber(),
    DB_DATABASE: get('DB_DATABASE').required().asString(),
    DB_AUTHSOURCE: get('DB_AUTHSOURCE').required().asString()
  }
}

export default config
