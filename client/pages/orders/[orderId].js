import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id
    },
    onSuccess: (payment) => console.log(payment)
  });

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
    <div>
      <div>Time left to pay: {timeLeft} seconds</div>
      <StripeCheckout
        currency="BRL"
        locale="auto"
        token={(resp) => doRequest({ token: resp.id })}
        stripeKey="pk_test_51Ib3wMENyIfUVZXLqXvKN2Fm6eZFYHjJXo8v8I6raooxUrX7zYOoN5n1dexJpW8oXwKV53mcdvrPeXwho58RSU8Q00o2qAAOzd"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, httpClient) => {
  const { orderId } = context.query;
  const { data } = await httpClient.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default OrderShow;