import React from "react";
import { Switch, Route } from "react-router-dom";
import Main from "./Main";
import Batch from "./components/BatchOrders/BatchOrders";
import BatchList from "./components/BatchOrders/BatchList";
import Fraud from "./components/FraudOrders/FraudOrders";
import FraudList from "./components/FraudOrders/FraudList";
import LogList from "./components/AdminLogs/LogList";
import Fetch from "./components/FetchOrder/FetchOrder";
import FetchDetail from "./components/FetchOrder/FetchDetail";
import InboundLogging from "./components/InventorySystem/Inbound/InboundLogging";
import InventoryTable from "./components/InventorySystem/InventoryTable/InventoryTable";
import InboundLogTable from "./components/InventorySystem/Inbound/InboundLogTable";
import InventoryReportTable from "./components/InventorySystem/Report/InventoryReportTable";
import ReportLogging from "./components/InventorySystem/Report/ReportLogging";
import ReturnLogging from "./components/InventorySystem/Report/ReturnLogging";
import OBReportLogging from "./components/InventorySystem/Report/OBReportLogging";
import BabyCareLogging from "./components/InventorySystem/Report/BabyCareLogging";
import ToyLogging from "./components/InventorySystem/Report/ToyLogging";

const Router = () => (
  <main>
    <Switch>
      <Route exact path="/" component={Main} />
      <Route path="/batch" component={Batch} />
      <Route path="/batchList" component={BatchList} />
      <Route path="/fraud" component={Fraud} />
      <Route path="/fraudList" component={FraudList} />
      <Route path="/fetch" component={Fetch} />
      <Route path="/fetchDetail" component={FetchDetail} />
      <Route path="/log" component={LogList} />
      <Route path="/inboundLogging" component={InboundLogging} />
      <Route path="/inboundLogTable" component={InboundLogTable} />
      <Route path="/inventoryTable" component={InventoryTable} />
      <Route path="/inventoryReport" component={InventoryReportTable} />
      <Route path="/reportLogging" component={ReportLogging} />
      <Route path="/returnLogging" component={ReturnLogging} />
      <Route path="/obReportLogging" component={OBReportLogging} />
      <Route path="/babycareLogging" component={BabyCareLogging} />
      <Route path="/toyLogging" component={ToyLogging} />
    </Switch>
  </main>
);

export default Router;
