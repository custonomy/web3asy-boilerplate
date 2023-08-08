import OrderModel from '../models/OrderModel' 
import Model from "../models/Model";

// Set up webhook through the stripe CLI
// stripe listen --forward-to localhost:4242/webhook
const stripe = require("stripe")(process.env.REACT_APP_STRIPE_SKEY);

// Record the purchase in the db
const handlePaymentIntentSucceeded = async (paymentIntent: any) => {
    console.log("PaymentIntent ID:", paymentIntent.id)
    const trx = await Model.lock();
    try {
      const newTx = await OrderModel.createTx(paymentIntent, trx);
      console.log("new tx: ",newTx)
      await Model.commit(trx);
    } catch (error) {
      Model.rollback(trx, error);
      return
    }
}

export const stripeWebhook = async (request: any, response: any) => {
  let event = request.body;

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
        // Then define and call a method to handle the successful payment intent.
        await handlePaymentIntentSucceeded(paymentIntent);
        break;
    case 'payment_intent.created':
        // const paymentIntent = event.data.object;
        console.log(`PaymentIntent created!`);
        // await handlePaymentIntentSucceeded(paymentIntent);
        break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
};