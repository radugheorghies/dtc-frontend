import { QueryClient, QueryClientProvider } from 'react-query';
import { useEffect } from 'react';
import '../styles/globals.css';

const queryClient = new QueryClient();

function App({ Component, pageProps }) {
  // useEffect(() => {
  //   import('@preline/overlay');
  // }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}

export default App;
