const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
require('dotenv').config();
const stripe = require('stripe');

// Set your live publishable key
const stripe = require('stripe')('pk_test_51SfOkr5mk4zFR7Rf2TqOQBGS865miaj17CoVQEtyivdwt83Rw1SB3WQfRnPkRDEPL37TwASrbLzOGnDhCsHsiM3g00N9eiY4DT');

var app = express();

// view engine setup (Handlebars)
app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }))
app.use(express.json({}));

/**
 * Home route
 */
app.get('/', function(req, res) {
  res.render('index');
});

/**
 * Checkout route
 */
app.get('/checkout', async(req, res) => {
  
  // Just hardcoding amounts here to avoid using a database
  const item = req.query.item;
  let title, amount, error;

  switch (item) {
    case '1':
      title = "The Art of Doing Science and Engineering"
      amount = 2300      
      break;
    case '2':
      title = "The Making of Prince of Persia: Journals 1985-1993"
      amount = 2500
      break;     
    case '3':
      title = "Working in Public: The Making and Maintenance of Open Source"
      amount = 2800  
      break;     
    default:
      // Included in layout view, feel free to assign error
      error = "No item selected"      
      break;
  };
  
  const intent = await stripe.paymentIntents.create({
  title: title,
  amount: amount,
  currency: 'aud',
  error: error,
  automatic_payment_methods: {
    enabled: true,
  },
});
  res.render('checkout', { client_secret: intent.client_secret });
});

const options = {
  clientSecret: '{{client_secret}}',
  // Fully customizable with appearance API.
  appearance: {/*...*/},
};

// Set up Stripe.js and Elements to use in checkout form, passing the client secret obtained in a previous step
const elements = stripe.elements(options);

// Create and mount the Payment Element
const paymentElementOptions = { layout: 'accordion'};
const paymentElement = elements.create('payment', paymentElementOptions);
paymentElement.mount('#payment-element');


/**
 * Success route
 */
app.get('/success', function(req, res) {
  res.render('success');
});

/**
 * Start server
 */

app.listen(3000, () => {
  console.log('Getting served on port 3000');
});
