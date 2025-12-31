

import * as service from "../../services/reports/index.js";

export const generateTransactionReport = async (req, res) => {
  return service.generateTransactionReport(req, res);
};