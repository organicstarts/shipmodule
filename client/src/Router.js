import React from "react";
import { Switch, Route } from "react-router-dom";
import Main from "./Main";
import {
  BatchOrders,
  FraudOrders,
  FetchOrder,
  BatchList,
  FraudList,
  FetchDetail,
  LogList,
  InboundLogging,
  InventoryTable,
  InboundLogTable,
  InventoryReportTable,
  ArchiveLogTable,
  ReportLogging,
  ReturnLogging,
  OBReportLogging,
  BabyCareLogging,
  ToyLogging,
  OpenBrokenTable,
  CancelOrder
} from "./components/";

const Router = () => (
  <main>
    <Switch>
      <Route exact path="/" component={Main} />
      <Route path="/batch" component={BatchOrders} />
      <Route path="/batchList" component={BatchList} />
      <Route path="/fraud" component={FraudOrders} />
      <Route path="/fraudList" component={FraudList} />
      <Route path="/fetch" component={FetchOrder} />
      <Route path="/fetchDetail" component={FetchDetail} />
      <Route path="/log" component={LogList} />
      <Route path="/inboundLogging" component={InboundLogging} />
      <Route path="/inboundLogTable" component={InboundLogTable} />
      <Route path="/archiveLogTable" component={ArchiveLogTable} />
      <Route path="/openBrokenTable" component={OpenBrokenTable} />
      <Route path="/inventoryTable" component={InventoryTable} />
      <Route path="/inventoryReport" component={InventoryReportTable} />
      <Route path="/reportLogging" component={ReportLogging} />
      <Route path="/returnLogging" component={ReturnLogging} />
      <Route path="/obReportLogging" component={OBReportLogging} />
      <Route path="/babycareLogging" component={BabyCareLogging} />
      <Route path="/toyLogging" component={ToyLogging} />
      <Route path="/cancel" component={CancelOrder} />
    </Switch>
  </main>
);

export default Router;
