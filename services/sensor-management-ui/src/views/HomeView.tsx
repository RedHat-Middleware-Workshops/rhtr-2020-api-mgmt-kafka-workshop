import * as React from 'react';
import LosAngeles from '../images/martin-adams-los-angeles-unsplash.jpg'

const HomeView: React.FC = () => {
  return (
    <div className="fade-in">
      <div className="flex justify-center px-8">
        <img className="rounded-b-lg" style={{maxHeight: '40vh'}} src={LosAngeles} alt="Downtown Los Angeles"/>
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
        <hr/>
      </div>

      <footer className="flex items-center justify-center h-10 bg-blue-900 text-center">
        <span className="text-white text-sm">Photo by <a href="https://unsplash.com/@martinadams?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Martin Adams</a> on <a href="https://unsplash.com/s/photos/los-angeles?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>
      </footer>
    </div>
  );
}

export default HomeView;
