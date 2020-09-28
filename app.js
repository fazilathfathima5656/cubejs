const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://fazilath:8639450270@firstcluster.7kl0s.mongodb.net/eventdb?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });

// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     client.close();
//   });


const Event = require('./models/event')
const app = express();

const events = [];
app.use(bodyParser.json());

app.use('/', graphqlHTTP({
    schema: buildSchema(`
    type Event {
        _id: ID!
        title:String!
        description:String!
        price:Float!
        date:String!
    }
    type RootQuery{
        events: [Event!]!
                    
    }

    input EventInput{
        _id: ID!
        title:String!
        description:String!
        price:Float!
        date:String!
    }
    type RootMutation {
       createEvent(eventInput:EventInput): Event

    }
        
    schema{
              
        query:RootQuery
              
        mutation:RootMutation
            }

          `),
    rootValue: {
        events: () => {
            return Event.find()
                .then(events => {
                    return events.map(event => {
                        return { ...event._doc };
                    })

                })
                .catch(err => {
                    console.log(err);
                    throw err;
                });
        },
        createEvent: (args) => {
            //     const event ={
            //         _id: args.eventInput._id,
            //         title:args.eventInput.title,
            //         description:args.eventInput.description,
            //         price:args.eventInput.price,
            //         date:args.eventInput.date
            // };

            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date)
            });

            return event
                .save()
                .then(result => {
                    console.log(result);
                    return { ...result._doc };
                })
                .catch(err => {
                    console.log(err);
                    throw err;
                });
        },
    },
    graphiql: true
})

)

// app.get('/', (req, res, next) => {
//     res.send("Hello world!");
// })

// mongodb+srv://fazilath:<password>@firstcluster.7kl0s.mongodb.net/<dbname>?retryWrites=true&w=majority

// mongoose.connect(`mongodb+srv://fazilath:8639450270f@firstcluster.7kl0s.mongodb.net/<dbname>?retryWrites=true&w=majority`
//  ).then(()=>{
//         app.listen(3000);
//     }).catch(err =>{
//      console.log(err);
//  });




//  mongoose.connect(`mongodb+srv://fazilath:8639450270f@firstcluster.7kl0s.
//  mongodb.net/events?retryWrites=true&w=majority`
//  ).then(()=>{
//         app.listen(3000);
//         console.log('connection established');
//     }).catch(err =>{
//      console.log(err);
//  });

mongoose.connect('mongodb://localhost:27017/event', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
}).then(()=>{
    app.listen(3000);
    console.log('connection established');
})
.catch((err)=>{
console.log(err);
})