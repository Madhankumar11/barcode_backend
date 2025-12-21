import * as service from "../../../services/master/typeMaster/index.js";

export const createType = (req, res) => {
  return service.createType(req, res);
};

export const getTypeDropdown = (req, res) => {
  return service.getTypeDropdown(req, res);
};
