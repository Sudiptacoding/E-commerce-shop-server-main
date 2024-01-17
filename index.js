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


const data = [
  {
    "_id": "6596ae79cf7baf4b61be377c",
    "category": "shirt",
    "image": [
      "https://i.ibb.co/mXRb4cb/721dbbff1a76aa38489c0aed7ed17ea0.jpg",
      "https://i.ibb.co/ftfjTKt/147aa4af52ce33eeae58a79209bc960d.jpg",
      "https://i.ibb.co/SKX9nSr/27425f2f5d1c0b486ba6173069cc2623.jpg",
      "https://i.ibb.co/rxbNGZs/b84530478e68ff2d158cb2fbe2f142f9.jpg"
    ],
    "name": "Half Sleeve Shirts",
    "price": 79.99,
    "title": "Adobe Illustrator Masterclass",
    "details": "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ducimus commodi necessitatibus illo omnis delectus...",
    "rating": 3,
    "customerReviews": [
      {
        "profileimg": "",
        "name": "Safayet Ahmed",
        "rating": 3,
        "description": "This is the best product that I found from them. They are the best seller in this country.",
        "date": "04/01/2024"
      }
    ]
  },
  {
    "_id": "6596ae79cf7baf4b61be377c",
    "category": "shirt",
    "image": [
      "https://i.ibb.co/mXRb4cb/721dbbff1a76aa38489c0aed7ed17ea0.jpg",
      "https://i.ibb.co/ftfjTKt/147aa4af52ce33eeae58a79209bc960d.jpg",
      "https://i.ibb.co/SKX9nSr/27425f2f5d1c0b486ba6173069cc2623.jpg",
      "https://i.ibb.co/rxbNGZs/b84530478e68ff2d158cb2fbe2f142f9.jpg"
    ],
    "name": "Half Sleeve Shirts",
    "price": 79.99,
    "title": "Adobe Illustrator Masterclass",
    "details": "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ducimus commodi necessitatibus illo omnis delectus...",
    "rating": 3,
    "customerReviews": [
      {
        "profileimg": "",
        "name": "Safayet Ahmed",
        "rating": 3,
        "description": "This is the best product that I found from them. They are the best seller in this country.",
        "date": "04/01/2024"
      }
    ]
  },
  {
    "_id": "6596ae79cf7baf4b61be377c",
    "category": "shirt",
    "image": [
      "https://i.ibb.co/mXRb4cb/721dbbff1a76aa38489c0aed7ed17ea0.jpg",
      "https://i.ibb.co/ftfjTKt/147aa4af52ce33eeae58a79209bc960d.jpg",
      "https://i.ibb.co/SKX9nSr/27425f2f5d1c0b486ba6173069cc2623.jpg",
      "https://i.ibb.co/rxbNGZs/b84530478e68ff2d158cb2fbe2f142f9.jpg"
    ],
    "name": "Half Sleeve Shirts",
    "price": 79.99,
    "title": "Adobe Illustrator Masterclass",
    "details": "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ducimus commodi necessitatibus illo omnis delectus...",
    "rating": 3,
    "customerReviews": [
      {
        "profileimg": "",
        "name": "Safayet Ahmed",
        "rating": 3,
        "description": "This is the best product that I found from them. They are the best seller in this country.",
        "date": "04/01/2024"
      }
    ]
  }
]









async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const menusCollection = client.db("E-commerce-Shop").collection("menus");
    const blogsCollection = client.db("E-commerce-Shop").collection("blogs");
    const addtocardCollection = client.db("E-commerce-Shop").collection("additemstocards");
    const addtoloveCollection = client.db("E-commerce-Shop").collection("additemstolove");
    const buyproduct = client.db("E-commerce-Shop").collection("buyallproductss");
    const alluser = client.db("E-commerce-Shop").collection("user");






    // get menus api
    app.post('/buynow', async (req, res) => {
      const uniqID = new ObjectId().toString()
      const data = {
        total_amount: 100,
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

        const { _id, ...item } = req.body

        const order = {
          item,
          pementStatus: false,
          trankID: uniqID
        }

        const result = buyproduct.insertOne(order);
      });

      app.post('/success/:id', async (req, res) => {
        const filter = { trankID: req.params.id };
        const updateDoc = {
          $set: {
            pementStatus: true
          },
        };
        const result = await buyproduct.updateOne(filter, updateDoc);
        if (result.modifiedCount > 0) {
          res.redirect('http://localhost:5173/successpement')
        }
      })

      app.post('/faild/:id', async (req, res) => {
        const filter = { trankID: req.params.id };
        const result = await buyproduct.deleteOne(filter)
        if (result.deletedCount > 0) {
          res.redirect('http://localhost:5173/faieldpement')
        }
      })
      app.post('/cancel/:id', async (req, res) => {
        const filter = { trankID: req.params.id };
        const result = await buyproduct.deleteOne(filter)
        if (result.deletedCount > 0) {
          res.redirect('http://localhost:5173/faieldpement')
        }
      })
    })




    // sfsdflkjlksadjf
    // Find the product by ID and update it with the new review
    // const result = await collection.updateOne(
    //   { _id: productId },
    //   { $push: { reviews: review } }
    // );





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
      res.send(data[0]);
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