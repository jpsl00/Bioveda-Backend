const jwtAuthz = require("express-jwt-authz");

export interface ICheckPermissionsOptions {
  checkAllScopes: boolean;
}

export const checkPermissions = (
  permissions: string | string[],
  options?: ICheckPermissionsOptions
) => {
  return jwtAuthz([permissions], {
    customScopeKey: "permissions",
    checkAllScopes: options?.checkAllScopes ?? true,
    failWithError: true,
  });
};
