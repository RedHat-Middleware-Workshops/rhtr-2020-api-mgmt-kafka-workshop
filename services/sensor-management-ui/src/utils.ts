
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

// The maximum page size for lists
export const PAGE_SIZE = 20
