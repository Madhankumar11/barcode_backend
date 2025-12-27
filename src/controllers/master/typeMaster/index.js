import * as service from "../../../services/master/typeMaster/index.js";

export const createType = (req, res) => {
  return service.createType(req, res);
};

export const getTypeDropdown = (req, res) => {
  return service.getTypeDropdown(req, res);
};

export const updateType = (req, res) => {
  return service.updateType(req, res);
};

export const listTypes = (req, res) => {
  return service.listTypes(req, res);
};

export const getTypeById = (req, res) => {
  return service.getTypeById(req, res);
};

export const deleteType = (req, res) => {
  return service.deleteType(req, res);
};




