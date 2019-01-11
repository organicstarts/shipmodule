import React from "react";
import { Switch, Route } from "react-router-dom";
import Main from "./Main";
import BatchList from './components/BatchOrders/BatchList';
import FraudList from './components/FraudOrders/FraudList';
import LogList from './components/AdminLogs/LogList';
import FetchDetail from "./components/FetchOrder/FetchDetail";
import InboundLogging from "./components/InventorySystem/Inbound/InboundLogging";
import InventoryTable from "./components/InventorySystem/InventoryTable/InventoryTable";
import InboundLogTable from "./components/InventorySystem/Inbound/InboundLogTable";
import InventoryReportTable from "./components/InventorySystem/Report/InventoryReportTable";
import ReportLogging from "./components/InventorySystem/Report/ReportLogging";
import OBReportLogging from "./components/InventorySystem/Report/OBReportLogging";
import BabyCareLogging from "./components/InventorySystem/Report/BabyCareLogging";
import ToyLogging from "./components/InventorySystem/Report/ToyLogging";

const Router = () => (
  <main>
    <Switch>
      <Route exact path="/" component={Main} />
      <Route path="/batch" component={BatchList} />
      <Route path="/fraud" component={FraudList} />
      <Route path="/fetch" component={FetchDetail} />
      <Route path="/log" component={LogList} />
      <Route path="/inboundLogging" component={InboundLogging} />
      <Route path="/inboundLogTable" component={InboundLogTable} />
      <Route path="/inventoryTable" component={InventoryTable} />
      <Route path="/inventoryReport" component={InventoryReportTable} />
      <Route path="/reportLogging" component={ReportLogging} />
      <Route path="/obReportLogging" component={OBReportLogging} />
      <Route path="/babycareLogging" component={BabyCareLogging} />
      <Route path="/toyLogging" component={ToyLogging} />
    </Switch>
  </main>
);

export default Router;
