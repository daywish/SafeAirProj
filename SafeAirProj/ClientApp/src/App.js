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
import { FloorList } from './components/Floors';
import { FloorAdding } from './components/FloorsAdding';
import { ConditionersList } from './components/Conditioners';
import { ConditionerAdding } from './components/ConditionerAdding';
import { RoomList } from './components/Rooms';
import { RoomAdding } from './components/RoomAdding';

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
         <AuthorizeRoute exact path='/buildings/:id/floors' exact component={FloorList} />
         <AuthorizeRoute exact path='/buildings/:id/floors/add' component={FloorAdding} />
         <AuthorizeRoute exact path='/conditioners' component={ConditionersList} />
         <AuthorizeRoute exact path='/conditioners/add' component={ConditionerAdding} />
         <AuthorizeRoute exact path='/buildings/:id/floors/:id/rooms' exact component={RoomList} />
         <AuthorizeRoute exact path='/buildings/:id/floors/:id/rooms/add' component={RoomAdding} />
        </Switch>
      </Layout>
    );
  }
}
