import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import dotenv from 'dotenv';
import SparkPost from 'sparkpost';

dotenv.config();
const sparky = new SparkPost(process.env.SPARKPOST_API_KEY);

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post('/', async (c) => { 
  const {email, name} = await c.req.json() 
  sparky.transmissions.send({
    options: { sandbox: false },
    content: {
        from: process.env.EMAIL,
        subject: `BikeStore - Hello ${name}`,
        html: '<html><body><p>You will recieve our response in a few days!</p></body></html>'
    },
    recipients: [{ address: email }]
})
    .then(data => {
        console.log('Woohoo! You just sent your first mailing!', data);
    })
    .catch(err => {
        console.log('Whoops! Something went wrong', err);
    });
    return c.json({email, name})
})

const port = parseInt(process.env.PORT ?? '3000');
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port
})


