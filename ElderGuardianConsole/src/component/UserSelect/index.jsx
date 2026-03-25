import { Avatar, Button, Select, Space } from "antd";
import React, { useEffect, useState } from "react";
import { apiGetUserList } from "@/services/userApi";
import { BASE_URL } from "@/utils/request";
import UserSelectTable from "@/component/UserSelectTable";
import useModal from "@/hooks/useModal";

export default function UserSelect(props) {
  const { role, onChange, value, showFirst = false } = props;
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [open, onOpen, onClose] = useModal();
  useEffect(() => {
    const getData = async () => {
      const res = await apiGetUserList({
        pageSize: 1000,
        pageNumber: 1,
        condition: { role },
      });
      setUsers(res?.data?.content || []);
      if (showFirst && res?.data?.content.length > 0) {
        onChange(res?.data?.content[0].userId);
        setSelectedUser(res?.data?.content[0]);
      }
    };
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Select
        value={value}
        onChange={(key) => {
          setSelectedUser(users.find((user) => user.userId === key));
          onChange(key);
        }}
        options={users.map((user) => ({
          value: user.userId,
          label: (
            <Space>
              <Avatar size="small" src={BASE_URL + user.avatar} />
              {user.userName}
            </Space>
          ),
        }))}
        style={{ minWidth: "200px" }}
        prefix={
          <Button
            onClick={onOpen}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            type="primary"
            size="small"
          >
            选择用户
          </Button>
        }
        {...props}
      />
      {open && (
        <UserSelectTable
          role={role}
          visible={open}
          onClose={onClose}
          onConfirm={(keys) => {
            setSelectedUser(users.find((user) => user.userId === keys[0]));
            onChange(keys[0]);
          }}
          selectedUsers={selectedUser ? [selectedUser] : []}
          selectionType="radio"
        />
      )}
    </>
  );
}
