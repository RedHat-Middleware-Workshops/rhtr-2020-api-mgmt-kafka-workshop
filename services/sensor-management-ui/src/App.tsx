import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import NotFoundView from './views/NotFoundView';
import MetersListView from './views/MetersList';
import JunctionsListView from './views/JunctionsList';
import MeterDetailView from './views/MeterDetailView';
import HomeView from './views/HomeView';
import Nav from './components/Nav';

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: process.env.IOT_GRAPHQL_HOST,
  cache: new InMemoryCache()
});
console.log('connecting to graphql service at', process.env.IOT_GRAPHQL_HOST)


const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="flex flex-col h-screen justify-between">
          <Nav />
          <main className="mb-auto h-10">
            <Switch>
              <Route exact path={"/"} component={HomeView} />
              <Route exact path={"/junctions"} component={JunctionsListView} />
              <Route exact path={"/meters"} component={MetersListView} />
              <Route path={"/meters/:id"} component={MeterDetailView} />
              <Route component={NotFoundView} />
            </Switch>
          </main>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default hot(App);
