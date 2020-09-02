import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import {
  generateGetByIdQuery,
  GetMeterQueryResult,
  Meter
} from '../data/meters';
import { useQuery } from '@apollo/client';
import Loader from '../components/Loader';
import GoogleMapReact, { BootstrapURLKeys, MapOptions } from 'google-map-react';

interface RouteMatchParams extends RouteComponentProps<{ id: string }> {}

const client: BootstrapURLKeys = {
  key: process.env.GOOGLE_MAPS_API_KEY || '',
  client: 'rhtr-sensor-management-ui'
};

const options: MapOptions = {
  zoomControl: false,
  panControl: false,
  gestureHandling: 'cooperative'
};

function getCenter(meter: Meter) {
  return {
    lat: parseFloat(meter.latitude),
    lng: parseFloat(meter.longitude)
  };
}

function addMarker(map: google.maps.Map, meter: Meter) {
  const marker = new google.maps.Marker({
    position: getCenter(meter)
  });

  marker.setMap(map);
}

const MeterDetailView: React.FC<RouteMatchParams> = (props) => {
  const { loading, error, data } = useQuery<GetMeterQueryResult>(
    generateGetByIdQuery(props.match.params.id)
  );

  let content: JSX.Element;

  if (loading) {
    content = (
      <div className="mt-64">
        <Loader />
      </div>
    );
  } else if (error || !data?.getMeter) {
    content = (
      <div className="mt-64 text-center">
        <p>An error ocurred: {error?.message}</p>
      </div>
    );
  } else {
    content = (
      <div className="flex">
        <div className="flex-1">
          <h3 className="text-xl text-gray-600">Address</h3>
          <p className="text-xl text-gray-900">{data?.getMeter.address}</p>
          <br />

          <h3 className="text-xl text-gray-600">UUID</h3>
          <p className="text-xl text-gray-900">{data?.getMeter.uuid}</p>
          <br />

          <h3 className="text-xl text-gray-600">
            GPS Coordinates (Latitude, Longitude)
          </h3>
          <p className="text-xl text-gray-900">
            {data?.getMeter.latitude}, {data?.getMeter.longitude}
          </p>
          <br />
        </div>
        <div className="flex-1" style={{ height: '50vh' }}>
          <GoogleMapReact
            onGoogleApiLoaded={(m) =>
              addMarker(m.map as google.maps.Map, data.getMeter)
            }
            defaultZoom={14}
            defaultCenter={getCenter(data.getMeter)}
            options={options}
            bootstrapURLKeys={client}
          ></GoogleMapReact>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-8 fade-in mb-8">
      <h2 className="text-3xl">Meter Details</h2>
      <hr />
      <br />
      {content}
    </div>
  );
};

export default withRouter(MeterDetailView);
