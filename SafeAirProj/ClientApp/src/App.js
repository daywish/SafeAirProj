import React, { Component } from 'react';
import { Route, Switch} from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { Counter } from './components/Counter';
import AuthorizeRoute from './components/api-authorization/AuthorizeRoute';
import ApiAuthorizationRoutes from './components/api-authorization/ApiAuthorizationRoutes';
import { ApplicationPaths } from './components/api-authorization/ApiAuthorizationConstants';
import { BuildingsList } from './components/Buildings';
import { BuildingAdding } from './components/BuildingsAdding';

import './custom.css'

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
        <Switch>
         <Route exact path='/' component={Home} />
         <Route path='/counter' component={Counter} />
         <AuthorizeRoute path='/fetch-data' component={FetchData} />
         <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
         <AuthorizeRoute exact path='/buildings' component={BuildingsList} />
         <AuthorizeRoute path='/buildings/add' component={BuildingAdding} />
        </Switch>
      </Layout>
    );
  }
}
