import React from "react";
import logoImg from "@/assets/images/logo/logo.png";
import styles from "./index.module.less";
export default function Logo({ className, isHideTitle = true }) {
  return (
    <div className={className + " " + styles.logo}>
      <img src={logoImg} className={styles.logoImg} />
      {!isHideTitle && <h1>养老院老人健康监测系统</h1>}
    </div>
  );
}
