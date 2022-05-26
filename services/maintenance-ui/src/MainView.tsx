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
  status: {
    status_text: MeterState
    timestamp: number
  }
}

const MainView: React.FC<{ token: string }> = ({ token }) => {
  const [ queryState, setQueryState ] = useState<MeterState>('occupied')
  const [ meters, setMeters ] = useState<Meter[]>()
  const [ error, setError ] = useState<Error|undefined>()

  useEffect(() => {
    const fetchMeters = async () => {
      const url = new URL('/meters', process.env.REACT_APP_API_URL as string)

      url.searchParams.set('status', queryState)

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

    setTimeout(() => fetchMeters(), 1000)
  }, [token, queryState])

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
          <option value={key} selected={meter.status.status_text === key}>{MeterStateMap[key]}</option>
        )
      })
      return (
        <div key={`meter-${meter.id}`}>
          <div className="grid grid-cols-5 gap-4 border-t mb-4">
            <div className="col-span-4 pr-4">
              <h3 className="font-semibold text-lg pb-2 pt-2">{meter.address}</h3>
            </div>
            <div className="col-span-1 flex items-start text-right">
              <select className="font-semibold text-gray-700 text-center w-full py-2 uppercase" onChange={(evt) => changeMeterState(evt.target.value, meter.id)}>
                {options}
              </select>
            </div>
          </div>
          <small className="text-xs w-full block mb-2 text-gray-200 text-right">As of {new Date(meter.status.timestamp).toLocaleString()}</small>
        </div>
      )
    })
    return (
      <div>
        <div className="grid grid-cols-5 gap-4 py-4">
          <h2 className="text-2xl text-gray-400 col-span-4">
            Meters
          </h2>
          <h2 className="text-2xl text-gray-400 col-span-1 text-right">
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
