import { NotificationProvider } from "@/components/notification-provider";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (<NotificationProvider><Component {...pageProps} /></NotificationProvider>);
}
