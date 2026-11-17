import React from "react";
import { BrowserRouter } from "react-router-dom";
import { DesktopDeviceFrame } from "@/components/DesktopDeviceFrame";
import { AppLayout } from "@/components/AppLayout";

export default function App() {
  return (
    <BrowserRouter>
      <DesktopDeviceFrame>
        <AppLayout />
      </DesktopDeviceFrame>
    </BrowserRouter>
  );
}
