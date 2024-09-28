import '../styles/globals.css';
import { AuthUserProvider } from "@/firebase/auth"

export default function App({ Component, pageProps }) {
  return (
    <>
    <AuthUserProvider>
      <Component {...pageProps} />
    </AuthUserProvider>
    </>
  );
  }
  