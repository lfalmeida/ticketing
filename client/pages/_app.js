import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async appContext => {
  const httpClient = buildClient(appContext.ctx);

  let pageProps = {};
  let currentUser;

  try {
    const { data } = await httpClient.get('/api/users/current');
    if (appContext.Component.getInitialProps) {
      pageProps = await appContext.Component.getInitialProps(appContext.ctx, httpClient, currentUser);
    }
    return {
      pageProps,
      ...data
    };
  } catch (error) {
    console.log(error);
  }

  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx, httpClient);
  }

  return { pageProps };
};

export default AppComponent;