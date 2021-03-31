import { useEffect, useState } from 'react';


const OrderShow = ({ order }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    // called if navigate away this component
    return () => {
      clearInterval(timerId);
    };
  }, []);

  if (timeLeft < 1) {
    return (<div>Order Expired</div>)
  }

  return (
    <div>Time left to pay: {timeLeft} seconds</div>
  );
};

OrderShow.getInitialProps = async (context, httpClient) => {
  const { orderId } = context.query;
  const { data } = await httpClient.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default OrderShow;