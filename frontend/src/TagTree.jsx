// TagTree.js
import React, { useState, useEffect } from "react";
import Tag from "./Tag";
import axios from "axios";

const TagTree = () => {
  const [tree, setTree] = useState(null);
  const [exportedData, setExportedData] = useState("");
  const [treeId, setTreeId] = useState(null);

  // Fetch the tree data from backend
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/trees")
      .then((response) => {
        if (response.data.length > 0) {
          // If data exists, load the first tree in the database
          setTree(response.data[0].tree);
          setTreeId(response.data[0].id);
        } else {
          // If no data exists, set an initial tree structure
          setTree({
            name: "root",
            children: [
              {
                name: "child1",
                children: [
                  { name: "child1-child1", data: "c1-c1 Aloha" },
                  { name: "child1-child2", data: "c1-c2 JS" },
                ],
              },
              { name: "child2", data: "c2-nc Universe" },
            ],
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching tree data:", error);
      });
  }, []);

  // Handle adding a new child to a specified path
  const handleAddChild = (parentPath) => {
    const newTree = { ...tree };
    let current = newTree;

    parentPath.forEach((index) => {
      current = current.children[index];
    });

    if (current.data) {
      delete current.data;
      current.children = [{ name: "New Child", data: "Data" }];
    } else {
      current.children.push({ name: "New Child", data: "Data" });
    }

    setTree(newTree);
  };

  // Handle changing data at a specific path
  const handleDataChange = (path, newData) => {
    const newTree = { ...tree };
    let current = newTree;

    path.forEach((index) => {
      current = current.children[index];
    });

    current.data = newData;
    setTree(newTree);
  };

  //(saving/updating) tree data to the backend
  const handleExport = () => {
    const exportedString = JSON.stringify(tree, null, 2);
    setExportedData(exportedString);

    if (treeId) {
      // If tree already exists, update it
      axios
        .put(`http://localhost:8000/api/trees/${treeId}`, { tree })
        .then((response) => {
          console.log("Tree updated in database:", response.data);
        })
        .catch((error) => {
          console.error("Error updating tree:", error);
        });
    } else {
      // If tree is new, create it
      axios
        .post("http://localhost:8000/api/trees", { tree })
        .then((response) => {
          console.log("Tree saved to database:", response.data);
          setTreeId(response.data.id); // Set the treeId after saving
        })
        .catch((error) => {
          console.error("Error saving tree:", error);
        });
    }
  };

  if (!tree) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ width: "100%", padding: "10px", backgroundColor: "#f5f5f5" }}>
      <Tag
        node={tree}
        path={[]}
        onAddChild={handleAddChild}
        onDataChange={handleDataChange}
      />
      <button
        onClick={handleExport}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          display: "block",
          margin: "10px auto",
        }}
      >
        Export
      </button>
      {exportedData && (
        <pre
          style={{
            marginTop: "20px",
            backgroundColor: "#f0f0f0",
            padding: "15px",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
            width: "100%",
          }}
        >
          {exportedData}
        </pre>
      )}
    </div>
  );
};

export default TagTree;
