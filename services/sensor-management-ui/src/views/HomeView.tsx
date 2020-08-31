import * as React from 'react';
import LosAngeles from '../images/martin-adams-los-angeles-unsplash.jpg';

const HomeView: React.FC = () => {
  return (
    <div className="fade-in">
      <div className="flex justify-center px-8 relative">
        <img
          className="rounded-b-lg"
          style={{ maxHeight: '40vh' }}
          src={LosAngeles}
          alt="Downtown Los Angeles"
        />
        <span className="text-white text-opacity-50 text-xs absolute bottom-0 pb-1">
          <a href="https://unsplash.com/@martinadams?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">
            Photo by Martin Adams on Unsplash
          </a>
        </span>
      </div>
      <div className="container mx-auto pt-8">
        <div className="flex mb-4">
          <div className="w-1/2 text-center">
            <h3 className="text-gray-700 text-3xl">Meters in Service</h3>
            <h2 className="text-gray-900 text-4xl">10,634</h2>
          </div>
          <div className="w-1/2 text-center">
            <h3 className="text-gray-700 text-3xl">Junctions in Service</h3>
            <h2 className="text-gray-900 text-4xl">1,271</h2>
          </div>
        </div>
        <hr />
      </div>
    </div>
  );
};

export default HomeView;
