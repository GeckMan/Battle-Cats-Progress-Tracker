"use client";

import { useState } from "react";
import RightPanel, { PanelToggleButton } from "./RightPanel";

export default function RightPanelWrapper() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {!open && <PanelToggleButton onClick={() => setOpen(true)} />}
      <RightPanel open={open} onClose={() => setOpen(false)} />
    </>
  );
}
