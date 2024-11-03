import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import TagTree from "./TagTree.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TagTree />
  </StrictMode>
);
