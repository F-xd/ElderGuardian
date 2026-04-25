import React from "react";
import { useSelector } from "react-redux";
import AdminDashboard from "./AdminDashboard";
import CaregiverDashboard from "./CaregiverDashboard";
import FamilyDashboard from "./FamilyDashboard";
import ElderDashboard from "./ElderDashboard";

const Options = () => {
  const user = useSelector((state) => state.user);
  const roleId = user.role?.roleId;

  const renderDashboard = () => {
    switch (roleId) {
      case 3:
        return <AdminDashboard />;
      case 2:
        return <CaregiverDashboard />;
      case 1:
        return <FamilyDashboard />;
      case 0:
        return <ElderDashboard />;
      default:
        return <AdminDashboard />;
    }
  };

  return <div className="dashboard-container">{renderDashboard()}</div>;
};

export default Options;
