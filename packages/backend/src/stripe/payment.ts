const stripe = require("stripe")(process.env.REACT_APP_STRIPE_SKEY);

const calculateOrderAmount = (items: any) => {
    return 2100;
};

export const createPayment = async (req:any, res:any) => {
    const { items } = req.body;
  
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(items),
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });
  
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  };