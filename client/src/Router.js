import React from "react";
import { Switch, Route } from "react-router-dom";
import Main from "./Main";
import BatchList from './components/BatchOrders/BatchList';
import FraudList from './components/FraudOrders/FraudList';
import LogList from './components/AdminLogs/LogList';
import FetchDetail from "./components/FetchOrder/FetchDetail";
import InventoryLogging from "./components/InventorySystem/InventoryLogging";
import InventoryLogTable from "./components/InventorySystem/InventoryLogTable";
import InventoryReportTable from "./components/InventorySystem/InventoryReportTable";

const Router = () => (
  <main>
    <Switch>
      <Route exact path="/" component={Main} />
      <Route path="/batch" component={BatchList} />
      <Route path="/fraud" component={FraudList} />
      <Route path="/fetch" component={FetchDetail} />
      <Route path="/log" component={LogList} />
      <Route path="/inventoryLogging" component={InventoryLogging} />
      <Route path="/inventoryTable" component={InventoryLogTable} />
      <Route path="/inventoryReport" component={InventoryReportTable} />
    </Switch>
  </main>
);

export default Router;
