import type { NextPage } from 'next'
import useSWR from 'swr';
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import GoogleMapReact from 'google-map-react'
import { MarkerInfo } from '../components/MarkerInfo';
import { useState } from 'react';
import * as ReactDOMServer from 'react-dom/server'

const _fetch = (...args: any[]) =>
  fetch(args[0], args[1]).then((res) => res.json());

type Space = {
  id: string
  address: string
  latitude: number
  longitude: number
}



const Home: NextPage = () => {
  const dtla_coords = {
    lat: 34.047662,
    lng: -118.2559477
  }

  const [map, setMap] = useState<google.maps.Map>()
  const spaces = useSWR<Space[], Error>('/api/available-spaces', _fetch);

  const apiIsLoaded = (map: google.maps.Map) => {
    setMap(map)

    if (spaces.data) {
      console.log('render spaces')
      spaces.data.map(space => {
        const info = <MarkerInfo
          address={space.address}
          lat={space.latitude}
          lng={space.longitude}
        ></MarkerInfo>

        const infowindow = new google.maps.InfoWindow({
          content: ReactDOMServer.renderToString(info)
        });

        const marker = new google.maps.Marker({
          position: {
            lat: space.latitude,
            lng: space.longitude
          },
          title: space.address,
          map
        })

        marker.addListener("click", () => {
          infowindow.open({
            anchor: marker,
            map,
            shouldFocus: false,
          } as any);
        });
      })
    } else {
      throw new Error('spaces.data was undefined')
    }
  }

  if (spaces.error) {
    return <h1>Error fetching spaces</h1>
  }

  const mapEl = (
    <GoogleMapReact
      yesIWantToUseGoogleMapApiInternals={true}
      onGoogleApiLoaded={({map, maps}) => apiIsLoaded(map)}
      bootstrapURLKeys={{ key: process.env.REACT_APP_MAPS_API_KEY as string }}
      defaultCenter={dtla_coords}
      defaultZoom={15}
    >
    </GoogleMapReact>
  )

  const loadingEl = (
    <h2 style={{marginTop: '30vh', textAlign: 'center'}}>Loading...</h2>
  )

  return (
    <div className={styles.container}>
      <Head>
        <title>Space Search</title>
        <meta name="description" content="Find a parking space, using this demo!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>Find my Parking</h1>
        <div className="map-container" style={{ height: '90vh', width: '100%' }}>
          { spaces.data ? mapEl : loadingEl}
        </div>
      </main>
    </div>
  )
}

export default Home
