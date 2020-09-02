import { useState } from 'react';
import * as React from 'react';
import { useQuery } from '@apollo/client';
import Loader from '../components/Loader';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import { History } from 'history';
import {
  FindMeterQueryResult,
  generatePagedQuery,
  generateNameContainsSearchQuery
} from '../data/meters';
import { parse, stringify } from 'query-string';
import { convertToNumberOrDefaultTo, PAGE_SIZE } from '../utils';

interface MeterListViewProps extends RouteComponentProps {
  history: History;
}

const MetersListView: React.FC<MeterListViewProps> = (props) => {
  const parsedQuery = parseQueryParams();

  const [searchTermValue, setSearchTermValue] = useState<string>(
    parsedQuery.search
  );
  const { loading, error, data } = useQuery<FindMeterQueryResult>(
    generateGraphQuery()
  );

  // Used to prevent pagination overflow
  const MAX_PAGES = Math.ceil((data?.findMeters.count || 0) / PAGE_SIZE);

  function parseQueryParams() {
    const query = parse(props.location.search);
    const searchQueryValue = query.search;
    const pageQueryValue = query.page;

    return {
      search: Array.isArray(searchQueryValue) ? '' : searchQueryValue || '',
      page: Array.isArray(pageQueryValue)
        ? 0
        : convertToNumberOrDefaultTo(pageQueryValue)
    };
  }

  /**
   * Generates the GraphQL querystring for the current page render
   */
  function generateGraphQuery() {
    if (parsedQuery.search !== '') {
      // Query using the given search term
      return generateNameContainsSearchQuery(
        parsedQuery.search,
        parsedQuery.page * PAGE_SIZE,
        PAGE_SIZE
      );
    } else {
      // Query from the start of all meters
      return generatePagedQuery(parsedQuery.page * PAGE_SIZE, PAGE_SIZE);
    }
  }

  const applySearch = () => {
    if (!searchTermValue) {
      return;
    }

    props.history.push(`/meters/?search=${searchTermValue.toUpperCase()}`);
  };

  const clearSearch = () => {
    props.history.push(`/meters/`);
    setSearchTermValue('');
  };

  const nextPage = () => {
    if (parsedQuery.page + 1 >= MAX_PAGES) {
      return;
    }

    const query = stringify({
      search: searchTermValue,
      page: parsedQuery.page + 1
    });

    props.history.push(`/meters/?${query}`);
  };

  const prevPage = () => {
    if (parsedQuery.page === 0) {
      return;
    }

    const query = stringify({
      search: searchTermValue,
      page: parsedQuery.page - 1
    });

    props.history.push(`/meters/?${query}`);
  };

  let content: JSX.Element;
  if (loading) {
    content = (
      <div className="mt-64">
        <Loader />
      </div>
    );
  } else if (error) {
    content = (
      <div className="mt-64 text-center">
        <p>An error ocurred: {error?.message}</p>
      </div>
    );
  } else {
    // const paging =
    const rows = data?.findMeters.items.map((m, idx) => {
      return (
        <tr className="hover:bg-gray-200 fade-in" key={m.uuid}>
          <td className="border px-4 py-2">
            <Link className="underline text-blue-700" to={`/meters/${m.id}`}>
              {m.uuid}
            </Link>
          </td>
          <td className="border px-4 py-2">{m.address}</td>
          <td className="border px-4 py-2">
            {m.latitude},{m.longitude}
          </td>
          <td className="border px-4 py-2">{'Yes'}</td>
        </tr>
      );
    });

    content = (
      <div>
        <div className="flex">
          <form
            onSubmit={(e) => {
              applySearch();
              e.preventDefault();
              return false;
            }}
            className="flex-1 w-full max-w-md mx-auto"
          >
            <div className="flex items-center border-b border-blue-700 py-2">
              <input
                value={searchTermValue}
                onChange={(e) => setSearchTermValue(e.target.value)}
                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                type="text"
                placeholder="Search by address..."
                aria-label="Search"
              />
              <button
                onClick={() => applySearch()}
                className="flex-shrink-0 bg-blue-700 hover:bg-blue-900 border-blue-700 hover:border-blue-900 text-sm border-4 text-white py-1 px-2 rounded"
                type="button"
              >
                Search
              </button>
              <button
                onClick={() => clearSearch()}
                className="flex-shrink-0 border-transparent border-4 text-blue-700 hover:text-blue-800 text-sm py-1 px-2 rounded"
                type="button"
              >
                Clear
              </button>
            </div>
          </form>
          {/* See: https://tailwindui.com/components/application-ui/navigation/pagination */}
          <nav className="flex-1 justify-end relative z-0 inline-flex">
            <a
              href="#"
              onClick={() => {
                prevPage();
                return false;
              }}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150"
              aria-label="Previous"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <span className="-ml-px text-blue-700 relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-700">
              Page {parsedQuery.page + 1} of {MAX_PAGES}
            </span>
            <a
              href="#"
              onClick={() => {
                nextPage();
                return false;
              }}
              className="-ml-px relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150"
              aria-label="Next"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </nav>
        </div>
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

        <div className="text-center pt-6"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-8 fade-in mb-8">
      <h2 className="text-3xl">Meters</h2>
      <hr />
      <br />
      {content}
    </div>
  );
};

export default withRouter(MetersListView);
