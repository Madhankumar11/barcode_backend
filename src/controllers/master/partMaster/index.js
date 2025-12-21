import * as service from "../../../services/master/partMaster/index.js";

export const createPart = async (req, res) => {
  return service.createPart(req, res);
};

export const getParts = async (req, res) => {
  return service.getParts(req, res);
};

export const updatePart = async (req, res) => {
  return service.updatePart(req, res);
};

export const deletePart = async (req, res) => {
  return service.deletePart(req, res);
};

export const getPartIdDropdown = async (req, res) => {
  return service.getPartIdDropdown(req, res);
};

export const getPartNameDropdown = async (req, res) => {
  return service.getPartNameDropdown(req, res);
};
