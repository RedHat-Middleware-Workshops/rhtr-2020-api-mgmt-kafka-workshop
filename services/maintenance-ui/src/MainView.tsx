import { useEffect, useState } from "react"
import Spinner from "./Spinner"

const MeterStateMap = {
  'available': 'Available',
  'occupied': 'Occupied',
  'maintenance': 'Maintenance',
  'out-of-service': 'Out-of-Service',
  'unknown': 'Unknown'
}
type MeterState = keyof typeof MeterStateMap
type Meter = {
  id: string
  address: string
  latitude: string
  longitude: number
  status?: {
    status_text: MeterState
    timestamp: number
  }
}

const MainView: React.FC<{ token: string }> = ({ token }) => {
  const [ queryState, setQueryState ] = useState<MeterState>('occupied')
  const [ queryPage, setQueryPage ] = useState<number>(1)
  const [ queryText, setQueryText ] = useState<string>()

  const [ meters, setMeters ] = useState<Meter[]>()
  const [ error, setError ] = useState<Error|undefined>()

  const fetchMeters = async () => {
    setMeters(undefined)

    const url = new URL('/meters', process.env.REACT_APP_API_URL as string)

    url.searchParams.set('status', queryState)
    url.searchParams.set('page', queryPage.toString())

    if (queryText) {
      url.searchParams.set('search', queryText)
    }

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const meters = await response.json() as Meter[]
      setMeters(meters)
    } catch (e) {
      console.error('error fetching products', e)
      setError(e as any)
    }
  }

  useEffect(() => {
    setTimeout(() => fetchMeters(), 500)
  }, [token])

  const changeMeterState = async (status: string, id: string) => {
    const url = new URL(`/meters/${id}`, process.env.REACT_APP_API_URL as string)

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        status
      })
    })

    if (response.status !== 200) {
      alert('Failed to update meter state!')
    } else {
      alert('Meter status updated!')
    }
  }

  if (error) {
    return (
      <div className="w-full my-10 text-center">
        <h2 className="text-2xl pb-5">Failed to fetch Meters</h2>
        <p className="font-mono">Error: {error.message}</p>
      </div>
    );
  } else if (meters) {
    const els = meters.map((meter) => {
      const options = Object.keys(MeterStateMap).map((_key: string) => {
        const key = _key as MeterState
        return (
          <option value={key} key={key}>{MeterStateMap[key]}</option>
        )
      })
      return (
        <div key={`meter-${meter.id}`}>
          <div className="grid grid-cols-5 gap-4 border-t mb-1">
            <div className="col-span-4 pr-4">
              <h3 className="font-semibold text-lg pb-2 pt-2">{meter.address}</h3>
            </div>
            <div className="col-span-1 flex items-start text-right">
              <select defaultValue={meter?.status?.status_text || 'unknown'} className="bg-gray-600 text-white text-center w-full py-2 capitalize" onChange={(evt) => changeMeterState(evt.target.value, meter.id)}>
                {options}
              </select>
            </div>
          </div>
          <small className="text-xs w-full block mb-3 text-gray-400 text-right">{ meter.status ? `As of ${new Date(meter.status.timestamp).toLocaleString()}` : 'Unknown'}</small>
        </div>
      )
    })


    const querySelectOptions = Object.keys(MeterStateMap).map((_key: string) => {
      const key = _key as MeterState
      return (
        <option value={key} key={key}>{MeterStateMap[key]}</option>
      )
    })

    return (
      <div>
        <h2 className="text-2xl text-gray-600 pt-2">Filters</h2>
        <div className="query-options flex pt-2">
          <input value={queryText} className="w-48 p-2 mr-4 outline-0 rounded border-2" type="text" pattern="[A-Za-z0-9]{20}" placeholder="e.g SANTA MONICA" onChange={(e) => { setQueryText(e.target.value) }}/>
          <select defaultValue={queryState} className="w-48 bg-gray-600 text-white text-center w-full py-2 capitalize" onChange={(e) => { setQueryState(e.target.value as MeterState) }}>
            {querySelectOptions}
          </select>
          <input type="button" value="Search" className="w-32 right font-semibold bg-blue-500 text-white rounded ml-auto" onClick={() => fetchMeters()} />
        </div>
        <div className="grid grid-cols-5 gap-4 py-4">
          <h2 className="text-2xl text-gray-600 col-span-4">
            Meters
          </h2>
          <h2 className="text-2xl text-gray-600 col-span-1 text-right">
            Status
          </h2>
        </div>
        {els}
      </div>
    )
  } else {
    return <Spinner message="Fetching Meters"/>
  }
}

export default MainView
