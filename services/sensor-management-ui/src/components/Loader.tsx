import * as React from 'react';

const Loader: React.FC<{ message?: string }> = (props) => {
  return (
    <div className="text-center">
      <div className="loader bg-transparent text-blue-700"></div>
      <div className="text-gray-700 text-xl">
        {props.message || 'Please wait...'}
      </div>
    </div>
  );
};

export default Loader;
