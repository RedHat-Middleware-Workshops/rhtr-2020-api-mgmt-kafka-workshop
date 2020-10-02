import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonProgressBar, IonButton } from '@ionic/react';
import './Meters.css';
import { getMeterEventsUrl } from '../utils';

interface MeterData {
  address: string
  status_text: string
  meter_id: string
  timestamp: number
  latitude: string
  longitude: string
}


type LoadingType = 'determinate' | 'indeterminate'
interface ConnectionState {
  colour: string
  message: string
  type: LoadingType
}

const STREAM_URL = getMeterEventsUrl().toString()
const CONNECTION_STATES: Record<string, ConnectionState> = {
  CONNECTED: {
    colour: 'primary',
    message: 'Streaming Events',
    type: 'indeterminate'
  },
  CONNECTING: {
    colour: 'warning',
    message: 'Connecting to Stream',
    type: 'indeterminate'
  },
  ERROR: {
    colour: 'danger',
    message: 'Disconnected',
    type: 'determinate'
  }
}

const Meters: React.FC = () => {
  let source: undefined|EventSource
  const [events, setEvents] = useState<Array<MeterData>>([])
  const [loadingColour, setLoadingColour] = useState(CONNECTION_STATES.CONNECTING.message)
  const [loadingMessage, setLoadingMessage] = useState(CONNECTION_STATES.CONNECTING.message)
  const [loadingType, setLoadingType] = useState<LoadingType>(CONNECTION_STATES.CONNECTING.type)
  const [listening, setListening] = useState<Boolean>(false)

  useEffect(() => {
    if (listening) {
      console.log('skipping meters page hook')
      return
    }

    console.log('running meters page hook')
    connect()
  }, [])

  const connect = () => {
    console.log('opening a connection to:', STREAM_URL)

    setLoadingColour(CONNECTION_STATES.CONNECTING.colour)
    setLoadingMessage(CONNECTION_STATES.CONNECTING.message)
    setLoadingType(CONNECTION_STATES.CONNECTING.type)

    source = new EventSource(STREAM_URL);
    source.onopen = () => {
      console.log('connection opened to:', STREAM_URL)

      setTimeout(() => {
        setLoadingColour(CONNECTION_STATES.CONNECTED.colour)
        setLoadingMessage(CONNECTION_STATES.CONNECTED.message)
        setLoadingType(CONNECTION_STATES.CONNECTED.type)
      }, 1000)
    }

    source.onerror = () => {
      // Delay the status change so a user sees a connection attempt, even
      // if they have no WiFi/Cell reception
      setTimeout(() => {
        console.log('meter stream encountered error. closing')

        setListening(false)
        setLoadingColour(CONNECTION_STATES.ERROR.colour)
        setLoadingMessage(CONNECTION_STATES.ERROR.message)
        setLoadingType(CONNECTION_STATES.ERROR.type)

        source?.close()
      }, 1000)
    }

    source.onmessage = (evt) => {
      console.log('meter event received', evt)

      const data = JSON.parse(evt.data) as MeterData

      // Append data to our dataset, and limit dataset length
      events.unshift(data)
      events.splice(20)

      setEvents([...events])
    };

    setListening(true)
  }

  let list: JSX.Element|undefined

  if (events.length !== 0) {
    const listItems = events.map((e) => {
      return (
        <IonItem className="blink" key={`${e.meter_id}-${e.timestamp}`}>
          <IonLabel>
            <h2>{e.address}</h2>
            <p>{e.status_text.toUpperCase()} as of {new Date(e.timestamp/1000).toLocaleTimeString()}</p>
          </IonLabel>
        </IonItem>
      )
    })

    list = <IonList>{listItems}</IonList>
  }


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Meters</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen scrollY={false}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Meters</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonProgressBar color={loadingColour} value={1} type={loadingType}></IonProgressBar>
        <div className="ion-padding ion-text-center">
          <p>{loadingMessage}</p>
          {
            loadingMessage === CONNECTION_STATES.ERROR.message ? <IonButton onClick={() => connect()}>Reconnect</IonButton> : ''
          }
        </div>
        <IonContent scrollY={true}>
          {list}
        </IonContent>
      </IonContent>
    </IonPage>
  );
};

export default Meters;
