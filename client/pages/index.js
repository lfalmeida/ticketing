import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  return currentUser ? <h1>You are signed in</h1> : <h1>You are not signed in</h1>;
};

LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);
  const currentUser = { currentUser: null }
  try {
    const { data } = await client.get('/api/users/current');
    return data;
  } catch (error) {
    return currentUser;
  }
}

export default LandingPage;