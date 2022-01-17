import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <main className="container mx-auto py-12">
      <Component {...pageProps} />
    </main>
  );
}

export default MyApp;
