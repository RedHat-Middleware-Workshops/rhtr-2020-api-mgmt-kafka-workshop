
const SSE_HOSTNAME = process.env.REACT_APP_SSE_HOSTNAME

function getServerSentEventsHostname () {
  if (SSE_HOSTNAME) {
    return SSE_HOSTNAME
  }

  if (window.location.hostname.includes('localhost')) {
    throw new Error('REACT_APP_SSE_HOSTNAME environment variable must be set during local development/deployment')
  }

  // Trick that can be used when deployed on OpenShift to create the URL
  // for services in the same namespace (assuming a consistent naming scheme)
  return `${window.location.protocol}//${window.location.hostname.replace('mobile-app', 'iot-sse-server')}`
}

export function getMeterEventsUrl () {
  const hostname = getServerSentEventsHostname()

  const u = new URL('/meters/stream', hostname)

  console.log('generated meters stream URL is:', u.toString())

  return u
}
