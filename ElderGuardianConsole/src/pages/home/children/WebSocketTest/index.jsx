import React, { useEffect, useState } from "react";
import { Card, Button, Input, Space, message, Tag } from "antd";
import useWebSocket from "@/hooks/useWebSocket";

const WebSocketTest = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const { isConnected, sendMessage, disconnect, reconnect } = useWebSocket({
    onMessage: (data) => {
      setMessages((prev) => [
        ...prev,
        { type: "received", data, time: new Date().toLocaleTimeString() },
      ]);
      message.success("收到新消息");
    },
    onConnect: () => {
      message.success("WebSocket已连接");
    },
    onDisconnect: () => {
      message.warning("WebSocket已断开");
    },
  });

  const handleSendMessage = () => {
    if (!inputMessage.trim()) {
      message.warning("请输入消息内容");
      return;
    }

    const messageData = {
      type: "test",
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    if (sendMessage(messageData)) {
      setMessages((prev) => [
        ...prev,
        {
          type: "sent",
          data: messageData,
          time: new Date().toLocaleTimeString(),
        },
      ]);
      setInputMessage("");
    }
  };
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);
  return (
    <div style={{ padding: "24px" }}>
      <Card title="WebSocket测试工具" style={{ marginBottom: "24px" }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <div>
            <Tag color={isConnected ? "success" : "error"}>
              {isConnected ? "已连接" : "未连接"}
            </Tag>
          </div>
          <Space>
            <Button type="primary" onClick={reconnect} disabled={isConnected}>
              重新连接
            </Button>
            <Button danger onClick={disconnect} disabled={!isConnected}>
              断开连接
            </Button>
          </Space>
        </Space>
      </Card>

      <Card title="发送消息" style={{ marginBottom: "24px" }}>
        <Space>
          <Input
            placeholder="输入要发送的消息"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onPressEnter={handleSendMessage}
            style={{ width: "300px" }}
            disabled={!isConnected}
          />
          <Button
            type="primary"
            onClick={handleSendMessage}
            disabled={!isConnected}
          >
            发送
          </Button>
        </Space>
      </Card>

      <Card title="消息记录">
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          {messages.length === 0 ? (
            <div style={{ textAlign: "center", color: "#999" }}>暂无消息</div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  padding: "12px",
                  marginBottom: "8px",
                  backgroundColor: msg.type === "sent" ? "#e6f7ff" : "#f6ffed",
                  borderRadius: "4px",
                  borderLeft: `4px solid ${msg.type === "sent" ? "#1890ff" : "#52c41a"}`,
                }}
              >
                <div
                  style={{
                    marginBottom: "4px",
                    fontSize: "12px",
                    color: "#666",
                  }}
                >
                  <Tag color={msg.type === "sent" ? "blue" : "green"}>
                    {msg.type === "sent" ? "发送" : "接收"}
                  </Tag>
                  {msg.time}
                </div>
                <pre
                  style={{
                    margin: 0,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {JSON.stringify(msg.data, null, 2)}
                </pre>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default WebSocketTest;
