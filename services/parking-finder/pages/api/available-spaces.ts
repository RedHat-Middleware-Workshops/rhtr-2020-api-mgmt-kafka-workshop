// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { get } from 'env-var'
import got, { OptionsOfJSONResponseBody } from 'got'

const API_URL = get('API_URL').required().asUrlObject()
const API_KEY = get('API_KEY').asString()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url = new URL('/meters', API_URL)
  const spaces = await got({
    url,
    searchParams: {
      status: 'avaiilable',
      user_key: API_KEY ? API_KEY : undefined
    }
  } as OptionsOfJSONResponseBody)

  res.setHeader('content-type', 'application/json')
  res.status(200).end(spaces.body)
}
