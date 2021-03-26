import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async appContext => {
  const httpClient = buildClient(appContext.ctx);

  let pageProps;
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  try {
    const { data } = await httpClient.get('/api/users/current');
    return {
      pageProps,
      ...data
    }
  } catch (error) {
    return {
      pageProps,
      currentUser: null
    };
  }
};

export default AppComponent;