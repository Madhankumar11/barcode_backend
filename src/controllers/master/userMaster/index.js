import * as service from "../../../services/master/userMaster/index.js";

export const registerManualUser = (req, res) =>
  service.registerManualUser(req, res);

export const registerOrUpdateBiometric = (req, res) =>
  service.registerOrUpdateBiometric(req, res);

export const loginUser = (req, res) =>
  service.loginUser(req, res);

export const forgotPassword = (req, res) =>
  service.forgotPassword(req, res);

export const changePassword = (req, res) =>
  service.changePassword(req, res);

export const refreshAccessToken = (req, res) =>
  service.refreshAccessToken(req, res);

