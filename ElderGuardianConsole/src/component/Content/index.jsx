import React from "react";
import styles from "./index.module.less";
import { Space } from "antd";
import { GAP } from "../../constant";
export default function Content(props) {
  const { title, children, extra } = props;
  return (
    <div className={styles.content} {...props}>
      {title && (
        <div className={styles.title}>
          <h2>{title}</h2>
          {extra && <div>{extra}</div>}
        </div>
      )}
      <Space
        size={GAP.MEDIUM}
        orientation="vertical"
        className={styles.children}
      >
        {children}
      </Space>
    </div>
  );
}
