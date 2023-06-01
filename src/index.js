import React from "react";
import { createRoot } from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { RegistryProvider, createRegistry } from "@wordpress/data";

import "./index.css";
import App from "./App";

const registry = createRegistry({});

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <RegistryProvider value={registry}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </RegistryProvider>
);

// ReactDOM.render(
//   <RegistryProvider value={ registry }>
//     <React.StrictMode>
//       <App />
//     </React.StrictMode>
//   </RegistryProvider>,
//   document.getElementById('root')
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
