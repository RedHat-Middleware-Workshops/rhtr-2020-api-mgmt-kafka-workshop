import { get } from 'env-var'

const config = {
  MONGO_CONNECTION_STRING: get('MONGO_CONNECTION_STRING')
    .default('mongodb://mongoadmin@mongoadmin@city-mongodb:27017/city-info')
    .asUrlString(),
  HTTP_PORT: get('HTTP_PORT').default('8080').asPortNumber(),
  HTTP_RESPONSE_DELAY: get('HTTP_RESPONSE_DELAY').default('0').asIntPositive(),
  NODE_ENV: get('NODE_ENV').default('dev').asEnum(['dev', 'prod'])
}

export = config
