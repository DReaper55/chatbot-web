"use client";

import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { store } from "@/app/store/redux/reduxStore";

export default function SessionWrapper({ children }: { children: React.ReactNode }) {
  return <SessionProvider><Provider store={store}>{children}</Provider></SessionProvider>;
}
