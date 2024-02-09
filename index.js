const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const SSLCommerzPayment = require('sslcommerz-lts')
const store_id = 'pemen659fff47a15d1'
const store_passwd = 'pemen659fff47a15d1@ssl'
const is_live = false
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

console.log(process.env.BD_USER)

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.BD_USER}:${process.env.BD_PASS}@cluster0.jfiige1.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const menusCollection = client.db("E-commerce-Shop").collection("menu");
    const blogsCollection = client.db("E-commerce-Shop").collection("blogs");
    const addtocardCollection = client.db("E-commerce-Shop").collection("additemstocards");
    const addtoloveCollection = client.db("E-commerce-Shop").collection("additemstolove");
    const buyproduct = client.db("E-commerce-Shop").collection("buyAllproducts");
    const alluser = client.db("E-commerce-Shop").collection("users");






    // get menus api
    app.post('/buynow', async (req, res) => {
      const uniqID = new ObjectId().toString()
      const data = {
        total_amount: 1000,
        currency: 'BDT',
        tran_id: 'REF123', // use unique tran_id for each api call
        success_url: `http://localhost:5000/success/${uniqID}`,
        fail_url: `http://localhost:5000/faild/${uniqID}`,
        cancel_url: `http://localhost:5000/cancel/${uniqID}`,
        ipn_url: 'http://localhost:3030/ipn',
        shipping_method: 'Courier',
        product_name: 'Computer.',
        product_category: 'Electronic',
        product_profile: 'general',
        cus_name: 'Customer Name',
        cus_email: 'customer@example.com',
        cus_add1: 'Dhaka',
        cus_add2: 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: '01711111111',
        cus_fax: '01711111111',
        ship_name: 'Customer Name',
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
      };
      const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
      sslcz.init(data).then(apiResponse => {
        // Redirect the user to payment gateway
        let GatewayPageURL = apiResponse.GatewayPageURL
        res.send({ url: GatewayPageURL })

        const itemsWithoutId = req?.body?.map(item => {
          // Destructure the object to remove the _id field
          const { _id, ...itemWithoutId } = item;
          return itemWithoutId;
        });

        const orders = itemsWithoutId.map(order => ({
          ...order,
          paymentStatus: false, // Corrected typo "pementStatus" to "paymentStatus"
          trankID: uniqID
        }));

        const result = buyproduct.insertMany(orders);



      });

      app.post('/success/:id', async (req, res) => {
        const filter = { trankID: req.params.id };
        const updateDoc = {
          $set: {
            pementStatus: true
          },
        };
        const result = await buyproduct.updateMany(filter, updateDoc);
        if (result.modifiedCount > 0) {

          res.redirect('https://e-commers-webside.web.app/successpement')


        }
      })

      app.post('/faild/:id', async (req, res) => {
        const filter = { trankID: req.params.id };
        const result = await buyproduct.deleteOne(filter)
        if (result.deletedCount > 0) {
          res.redirect('https://e-commers-webside.web.app/faieldpement')
        }
      })
      app.post('/cancel/:id', async (req, res) => {
        const filter = { trankID: req.params.id };
        const result = await buyproduct.deleteOne(filter)
        if (result.deletedCount > 0) {
          res.redirect('https://e-commers-webside.web.app/faieldpement')
        }
      })
    })


    // get menus api
    app.post('/item', async (req, res) => {
      const result = await menusCollection.insertOne(req.body);
      res.send(result);
    })

    app.delete('/item/:id', async (req, res) => {
      const result = await menusCollection.deleteOne({ _id: new ObjectId(req.params.id) });
      res.send(result);
    })

    // clear 
    app.get('/allloveclear', async (req, res) => {
      const result = await addtoloveCollection.deleteMany({ email: req.query.email });
      res.send(result);
    })

    // clear 
    app.get('/allcardclear', async (req, res) => {
      const result = await addtocardCollection.deleteMany({ email: req.query.email });
      res.send(result);
    })



    // get menus api
    app.put('/item/:id', async (req, res) => {
      const filter = { _id: new ObjectId(req.params.id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          ...req.body
        },
      };
      const result = await menusCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    })

    // get menus api
    app.get('/sameitems', async (req, res) => {
      const result = await menusCollection.find({ category: req.query.category }).toArray();
      res.send(result);
    })

    // get menus api
    app.patch('/sameitems/:id', async (req, res) => {
      const result = await menusCollection.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $push: { customerReviews: req.body } }
      );
      res.send(result);
    })


    // get menus api
    app.get('/menus', async (req, res) => {
      const result = await menusCollection.find().toArray();
      res.send(result);
    })

    // get all pement
    app.get('/allpementitem', async (req, res) => {
      const result = await buyproduct.find().toArray();
      res.send(result);
    })

    app.get('/menu/:id', async (req, res) => {
      const result = await menusCollection.findOne({ _id: new ObjectId(req.params.id) });
      res.send(result);
    })

    // get blogs api
    app.get('/blogs', async (req, res) => {
      const result = await blogsCollection.find().toArray();
      res.send(result);
    })

    // add to cart post
    app.post('/addtocart', async (req, res) => {
      const result = await addtocardCollection.insertOne(req.body);
      res.send(result);
    })
    // add to user
    app.post('/user', async (req, res) => {
      const result = await alluser.findOne({ email: req.body.email })
      if (!result) {
        const user = await alluser.insertOne(req.body);
        res.send(user)
      }
    })

    // add to user
    app.get('/alluser', async (req, res) => {
      const result = await alluser.find().toArray()
      res.send(result)
    })

    // delete to user
    app.delete('/user/:id', async (req, res) => {
      const result = await alluser.deleteOne({ _id: new ObjectId(req.params.id) })
      res.send(result)
    })

    // patch to user
    app.patch('/user/:id', async (req, res) => {
      const filter = { _id: new ObjectId(req.params.id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: `admin`
        },
      };
      const result = await alluser.updateOne(filter, updateDoc, options);
      res.send(result)
    })

    // add to addtolove post
    app.post('/addtolove', async (req, res) => {
      const result = await addtoloveCollection.insertOne(req.body);
      res.send(result);
    })
    // add to cart get
    app.get('/addtocart', async (req, res) => {
      const result = await addtocardCollection.find({ email: req.query.email }).toArray();
      res.send(result);
    })
    // add to addtoloveCollection get
    app.get('/addtolove', async (req, res) => {
      const result = await addtoloveCollection.find({ email: req.query.email }).toArray();
      res.send(result);
    })
    // delete card item
    app.delete('/addtocard/:id', async (req, res) => {
      const result = await addtocardCollection.deleteOne({ _id: new ObjectId(req.params.id) });
      res.send(result);
    })
    // delete addtoloveCollection item
    app.delete('/addtolove/:id', async (req, res) => {
      const result = await addtoloveCollection.deleteOne({ _id: new ObjectId(req.params.id) });
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('e-commerce-shop is running')
})

app.listen(port, () => {
  console.log(`realestate server is running on port ${port}`)
})