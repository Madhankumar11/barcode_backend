import * as service from "../../services/transection/index.js";

export const startTransaction = (req, res) => {
  return service.startTransaction(req, res);
};

export const recordScan = (req, res) => {
  return service.recordScan(req, res);
};

export const getPendingTransaction = (req, res) => {
  return service.getPendingTransaction(req, res);
};

export const restartScan = (req, res) => {
  return service.restartScan(req, res);
};

export const printLabelByTransactionId = (req, res) => {
  return service.printLabelByTransactionId(req, res);
};

export const listTransactions = (req, res) => {
  return service.listTransactions(req, res);
};

export const getTransactionById = (req, res) => {
  return service.getTransactionById(req, res);
};

export const deleteTransaction = (req, res) => {
  return service.deleteTransaction(req, res);
};

export const filterTransactions = (req, res) => {
  return service.filterTransactions(req, res);
};

export const searchTransactions = (req, res) => {
  return service.searchTransactions(req, res);
};




