
export function numberWithCommas(x: number) {
  // https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function convertToNumberOrDefaultTo (n: any, defaultValue = 0) {
  const parsedN = parseInt(n)

  if (isNaN(parsedN)) {
    return defaultValue
  } else {
    return parsedN
  }
}

export function getGraphqlHost () {
  const envValue = process.env.IOT_GRAPHQL_HOST

  if (envValue) {
    return envValue
  }

  // Trick that can be used when deployed on OpenShift to create the URL for
  // the GraphQL API service
  return `${window.location.protocol}//${window.location.hostname.replace('sensor-management-ui', 'iot-graphql-api')}/graphql`
}

// The maximum page size for lists
export const PAGE_SIZE = 20
