import "@/styles/globals.css";
import 'react-quill/dist/quill.snow.css';
import 'quill/dist/quill.snow.css'; // Import Quill's default snow theme CSS
import '@/styles/blog_styles.css';
import Layout from './components/layout'
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css'; // Import the CSS
import { AuthUserProvider } from "@/firebase/auth";
config.autoAddCss = false; 
 
export default function MyApp({ Component, pageProps }) {
  return (
    <AuthUserProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthUserProvider>
  )
}