import axios from 'axios';

const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    // server context
    return axios.create({
      baseURL: process.env.BASE_URL,
      headers: req.headers
    });
  }
  return axios.create({ baseURL: '/' });
};

export default buildClient;