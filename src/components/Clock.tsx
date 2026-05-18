"use client";

import { useEffect, useState } from "react";

export default function Clock() {
  const [t, setT] = useState("—");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Bratislava",
      hour12: false,
    });
    const update = () => setT(fmt.format(new Date()) + " BTS");
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);
  return <span>{t}</span>;
}
