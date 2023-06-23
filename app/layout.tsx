import "../styles/globals.scss";
import {Toasts} from "./ToastContainer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <head />
      <body>{children}</body>
      <Toasts/>
    </html>
  )
}
