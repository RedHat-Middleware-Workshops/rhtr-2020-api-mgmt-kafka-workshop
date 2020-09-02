import * as React from 'react';
import {
  FindJunctionQueryResult,
  ALL_JUNCTIONS_QUERY
} from '../data/junctions';
import { ALL_METERS_QUERY, FindMeterQueryResult } from '../data/meters';
import { useQuery } from '@apollo/client';
import Loader from '../components/Loader';
import { numberWithCommas } from '../utils';

const HomeView: React.FC = () => {
  const jQuery = useQuery<FindJunctionQueryResult>(ALL_JUNCTIONS_QUERY);
  const mQuery = useQuery<FindMeterQueryResult>(ALL_METERS_QUERY);

  let component;

  if (mQuery.loading || jQuery.loading) {
    component = (
      <div className="mt-16">
        <Loader />
      </div>
    );
  } else if (mQuery.error || jQuery.error) {
    console.log('junction query error', jQuery.error);
    console.log('meter query error', mQuery.error);
    component = (
      <p className="text-md">
        Whoops. Looks like an error occurred while fetching data.
      </p>
    );
  } else {
    component = (
      <div className="container mx-auto pt-8">
        <div className="flex mb-4">
          <div className="w-1/2 text-center">
            <h3 className="text-gray-700 text-3xl">Meters in Service</h3>
            <h2 className="text-gray-900 text-4xl">
              {numberWithCommas(mQuery.data?.findMeters.count || 0)}
            </h2>
          </div>
          <div className="w-1/2 text-center">
            <h3 className="text-gray-700 text-3xl">Junctions in Service</h3>
            <h2 className="text-gray-900 text-4xl">
              {numberWithCommas(jQuery.data?.findJunctions.count || 0)}
            </h2>
          </div>
        </div>
        <hr />
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="flex justify-center px-8 relative">
        <img
          className="rounded-b-lg"
          style={{ maxHeight: '40vh' }}
          src="images/martin-adams-los-angeles-unsplash.jpg"
          alt="Downtown Los Angeles"
        />
        <span className="text-white text-opacity-50 text-xs absolute bottom-0 pb-1">
          <a href="https://unsplash.com/@martinadams?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">
            Photo by Martin Adams on Unsplash
          </a>
        </span>
      </div>
      {component}
    </div>
  );
};

export default HomeView;
