import * as service from "../../../services/master/userMaster/index.js";

export const registerUser = (req, res) =>
  service.registerUser(req, res);

export const updateUser = (req, res) =>
  service.updateUser(req, res);

export const loginUser = (req, res) =>
  service.loginUser(req, res);

export const forgotPassword = (req, res) =>
  service.forgotPassword(req, res);

export const changePassword = (req, res) =>
  service.changePassword(req, res);

export const refreshAccessToken = (req, res) =>
  service.refreshAccessToken(req, res);

