import * as React from 'react';
import { useQuery, gql } from '@apollo/client';
import Loader from '../components/Loader';
import { withRouter } from 'react-router-dom';
import { History } from 'history';

const METERS_QUERY = gql`
  query {
    findMeters {
      count
      items {
        address
        uuid
        latitude
        longitude
      }
    }
  }
`;

interface Meter {
  address: string;
  uuid: string;
  latitude: string;
  longitude: string;
}

interface FindMeterQueryResult {
  findMeters: {
    count: number;
    items: Meter[];
  };
}

interface MetersListViewProps {
  history: History;
}

const MetersListView: React.FC<{ history: History }> = ({ history }) => {
  const { loading, error, data } = useQuery<FindMeterQueryResult>(METERS_QUERY);

  if (loading) {
    return (
      <div className="mt-64">
        <Loader />
      </div>
    );
  } else if (error) {
    return (
      <div className="mt-64 text-center">
        <p>An error ocurred: {error?.message}</p>
      </div>
    );
  }

  console.log(data);

  const rows = data?.findMeters.items.map((m, idx) => {
    return (
      <tr
        onClick={() => history.push(`/meters/${m.uuid}`)}
        className="cursor-pointer hover:bg-gray-200"
        key={m.uuid}
      >
        <td className="border px-4 py-2">{m.uuid}</td>
        <td className="border px-4 py-2">{m.address}</td>
        <td className="border px-4 py-2">
          {m.latitude},{m.longitude}
        </td>
        <td className="border px-4 py-2">{'Yes'}</td>
      </tr>
    );
  });

  return (
    <div className="container mx-auto pt-8 fade-in">
      <h2 className="text-3xl">Meters</h2>
      <hr />
      <br />
      <table className="w-full table text-center">
        <thead>
          <tr>
            <th className="px-4 py-2">UUID</th>
            <th className="px-4 py-2">Address</th>
            <th className="px-4 py-2">Lat/Long</th>
            <th className="px-4 py-2">Enabled</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
};

export default withRouter(MetersListView);
