import * as React from 'react';
import { useQuery } from '@apollo/client';
import Loader from '../components/Loader';
import { withRouter } from 'react-router-dom';
import { History } from 'history';
import {
  FindJunctionQueryResult,
  ALL_JUNCTIONS_QUERY
} from '../data/junctions';

const JunctionsListView: React.FC<{ history: History }> = ({ history }) => {
  const { loading, error, data } = useQuery<FindJunctionQueryResult>(
    ALL_JUNCTIONS_QUERY
  );

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

  const rows = data?.findJunctions.items.map((m, idx) => {
    return (
      <tr
        onClick={() => history.push(`/meters/${m.uuid}`)}
        className="cursor-pointer hover:bg-gray-200 fade-in"
        key={m.uuid}
      >
        <td className="border px-4 py-2">{m.uuid}</td>
        <td className="border px-4 py-2">{m.name}</td>
        <td className="border px-4 py-2">
          {m.latitude},{m.longitude}
        </td>
        <td className="border px-4 py-2">{'Yes'}</td>
      </tr>
    );
  });

  return (
    <div className="container mx-auto pt-8 fade-in mb-8">
      <h2 className="text-3xl">Junctions</h2>
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

export default withRouter(JunctionsListView);
