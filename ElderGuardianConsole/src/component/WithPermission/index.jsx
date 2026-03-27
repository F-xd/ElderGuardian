import React from "react";
import { useSelector } from "react-redux";
import { hasPermission } from "../../utils/permission";

/**
 * 权限校验组件
 * @param {React.ReactNode} children 有权限时渲染的子组件
 * @param {string|string[]} permission 所需权限（单个权限或权限数组）
 * @param {React.ReactNode} fallback 无权限时渲染的内容，默认为 null
 * @returns {React.ReactNode}
 */
export default function WithPermission({
  children,
  permission,
  fallback = null,
}) {
  console.log(children);
  console.log(permission);
  const user = useSelector((state) => state.user);

  if (!user || !user.role) {
    return fallback;
  }

  const hasAuth = hasPermission(user.role.roleId, permission);

  return hasAuth ? children : fallback;
}
