import * as service from "../../services/transection/index.js";

export const createOrUpdateTransaction = (req, res) => {
  return service.createOrUpdateTransaction(req, res);
};

// export const printTransactionLabel = (req, res) => {
//   return service.printTransactionLabel(req, res);
// };

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




