import axios from 'axios';

const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    // server context
    return axios.create({
      baseURL: 'http://ingress-nginx-controller.kube-system.svc.cluster.local',
      headers: req.headers
    });
  }
  return axios.create({ baseURL: '/' })
};

export default buildClient;