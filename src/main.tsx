import React from "react";
import ReactDOM from "react-dom/client";
import App from "../albumromanticovertical";
import VideoSection from "./VideoSection";
import "./styles.css";

function Root() {
  return (
    <>
      <App />
      <VideoSection />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
