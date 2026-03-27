import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Breadcrumb,
  Layout,
  Menu,
  theme,
  Dropdown,
  Avatar,
  Space,
  notification,
} from "antd";
import { AlarmEventTag } from "../../component/AlarmEventSelect";
import styles from "./index.module.less";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router";
import { publicMenuRoutes } from "../../router";
import Logo from "../../component/Logo";
import { useSelector } from "react-redux";
import { DownOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { BASE_URL } from "../../utils/request";
import { logout } from "../../utils/utils";
import { filterRoutesByRole } from "../../utils/permission";
import RoleTag from "../../component/RoleTag";
import { getUnhandledAlarmList } from "../../services/alarmApi";
const { Header, Content, Footer, Sider } = Layout;

const App = () => {
  const user = useSelector((state) => state.user);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  // 未处理告警列表
  const unHandleedListRef = useRef([]);
  // 侧边栏是否折叠
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState({
    openKeys: [],
    selectedKeys: [],
  });
  const [api, contextHolder] = notification.useNotification();
  // 过滤菜单
  const menuItems = filterRoutesByRole(publicMenuRoutes, user.role.roleId);

  // 根据当前路径生成面包屑
  const breadcrumbItems = useMemo(() => {
    const generateBreadcrumb = (
      routes,
      currentPath,
      parentPath = "",
      result = [],
    ) => {
      for (const route of routes) {
        const routePath = parentPath
          ? `${parentPath}/${route.path}`
          : `/home/${route.path}`;

        if (routePath && pathname === routePath) {
          result.push({
            title: (
              <>
                {route.icon}
                <span>{route.label}</span>
              </>
            ),
          });
          return result;
        }

        if (route.children) {
          const childResult = generateBreadcrumb(
            route.children,
            currentPath,
            routePath,
            [
              ...result,
              {
                title: (
                  <>
                    {route.icon}
                    <span>{route.label}</span>
                  </>
                ),
              },
            ],
          );
          if (childResult) {
            return childResult;
          }
        }
      }
      return null;
    };

    const breadcrumbs = generateBreadcrumb(menuItems, pathname);
    return breadcrumbs
      ? [{ title: "首页", href: "/home" }, ...breadcrumbs]
      : [{ title: "首页", href: "/home" }];
  }, [pathname, menuItems]);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // 更新选中菜单
  useEffect(() => {
    const updateSelectedMenu = () => {
      console.log(pathname);
      const list = pathname.split("/");
      setSelectedMenu({
        openKeys: [...selectedMenu.openKeys, list[list.length - 2]],
        selectedKeys: [list[list.length - 1]],
      });
    };
    updateSelectedMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  // 监听未处理告警列表变化
  useEffect(() => {
    const timer = setInterval(async () => {
      const { data = [] } = await getUnhandledAlarmList();
      // 比较有新增的告警就弹窗提示
      const newUnHandleedList = data.filter(
        (item) =>
          !unHandleedListRef.current.some((item2) => item2.id === item.id),
      );
      if (newUnHandleedList.length > 0) {
        api.error({
          title: `有${newUnHandleedList.length}条新的未处理告警`,
          description: (
            <Space vertical>
              <span>点击告警进行跳转</span>
              <Space wrap>
                {newUnHandleedList.map((item) => (
                  <AlarmEventTag
                    alarmEvent={item.alarmEvent}
                    alarm={item}
                    closeIcon={<CloseCircleOutlined />}
                    onClick={() => navigate(`/home/AlarmCenter?id=${item.id}`)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                      e.currentTarget.style.boxShadow =
                        "0 2px 8px rgba(0, 0, 0, 0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                    style={{
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </Space>
            </Space>
          ),
          duration: 0,
        });
      }
      unHandleedListRef.current = data;
    }, 5000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout className={styles.layout}>
      {contextHolder}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <Logo isHideTitle={collapsed} />
        <Menu
          theme="dark"
          openKeys={selectedMenu.openKeys}
          selectedKeys={selectedMenu.selectedKeys}
          onOpenChange={(openKeys) =>
            setSelectedMenu({ ...selectedMenu, openKeys })
          }
          mode="inline"
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header
          className={styles.header}
          style={{ background: colorBgContainer }}
        >
          <Breadcrumb items={breadcrumbItems} />
          <Dropdown
            arrow
            menu={{
              items: [
                {
                  key: "1",
                  label: <NavLink to="/home/user/userInfo">账号信息</NavLink>,
                },
                {
                  key: "2",
                  label: "退出登录",
                },
              ],
              onClick: ({ key }) => {
                if (key === "2") {
                  // 退出登录
                  logout();
                }
              },
            }}
          >
            <Space>
              <span>欢迎 {user.userName} 登录</span>
              <DownOutlined />
              <RoleTag role={user.role} />
              <Avatar src={BASE_URL + user.avatar} />
            </Space>
          </Dropdown>
        </Header>
        <Content className={styles.content}>
          <div
            style={{
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
        {/* <Footer className={styles.footer}>This is footer</Footer> */}
      </Layout>
    </Layout>
  );
};
export default App;
