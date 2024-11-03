import React, { useState } from "react";

const Tag = ({ node, path, onAddChild, onDataChange }) => {
  const [collapsed, setCollapsed] = useState(false);

  const handleToggle = () => {
    setCollapsed(!collapsed);
  };

  const handleAddChild = () => {
    onAddChild(path);
  };

  const handleDataChange = (e) => {
    onDataChange(path, e.target.value);
  };

  return (
    <div
      style={{
        width: "100%",
        marginBottom: "10px",
        boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          backgroundColor: "#a0b0d0",
          padding: "5px",
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        <button
          onClick={handleToggle}
          style={{
            marginRight: "10px",
            background: "black",
            color: "white",
            border: "none",
            padding: "5px",
            fontSize: "1em",
            cursor: "pointer",
          }}
        >
          {collapsed ? ">" : "v"}
        </button>
        <strong style={{ color: "white", fontSize: "1.1em", flexGrow: 1 }}>
          {node.name}
        </strong>
        <button
          onClick={handleAddChild}
          style={{
            background: "rgb(83 83 83)",
            color: "white",
            padding: "5px 10px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            alignSelf: "flex-end",
          }}
        >
          Add Child
        </button>
      </div>
      {!collapsed && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#dbe4f3",
            border: "1px solid #ccc",
            width: "100%",
          }}
        >
          {node.data !== undefined && (
            <div style={{ marginBottom: "10px" }}>
              <label>Data: </label>
              <input
                type="text"
                value={node.data}
                onChange={handleDataChange}
                style={{
                  padding: "5px",
                  marginLeft: "5px",
                  width: "90%",
                  backgroundColor: "#333",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                }}
              />
            </div>
          )}
          {node.children && (
            <div style={{ marginLeft: "20px" }}>
              {node.children.map((child, index) => (
                <Tag
                  key={index}
                  node={child}
                  path={[...path, index]}
                  onAddChild={onAddChild}
                  onDataChange={onDataChange}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Tag;
