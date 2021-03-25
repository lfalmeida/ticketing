import axios from 'axios';
import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  return <h1>Landing Page</h1>;
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