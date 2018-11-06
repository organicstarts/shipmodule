import React from "react";
import { Switch, Route } from "react-router-dom";
import Main from "./Main";
import BatchList from './components/BatchOrders/BatchList';


const Router = () => (
  <main>
    <Switch>
      <Route exact path="/" component={Main} />
      <Route path="/batch" component={BatchList} />
    </Switch>
  </main>
);

export default Router;
