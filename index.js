const express = require('express')
const mongoose = require('mongoose');
const app = express();
const cors = require('cors')
const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes")


const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
  REDIS_URL,
  REDIS_PORT,
  SESSION_SECRET
} = require("./config/config.js");

const session = require("express-session") 
const redis = require("redis")
//let RedisStore = require("connect-redis")(session); resdis version 6
let RedisStore = require("connect-redis").default; // redis version 7

const redisClient = redis.createClient({
  url: 'redis://redis:6379'
});

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("error", (err) => {
  console.error("Redis Error:", err)
});
redisClient.connect().catch(console.error)
const port = process.env.PORT || 3000;



const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
  mongoose
    .connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useFindAndModify: false,
    })
    .then(() => {
      console.log("succesfully connected to DB")
    })
    .catch((e) => {
      console.log(e);
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

app.use(express.json())
app.use(cors({}))
app.set('trust proxy');
// Initialize store.
let redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
})

app.use(
  session({
    store: redisStore,
    secret: SESSION_SECRET,
    cookie: {
      secure: false,
      resave: false,
      saveUninitialized: false,
      httpOnly: true,
      maxAge: 30000,
    },
  })
);


app.get('/api/v1', (req, res) => {
  console.log('this is me')
  res.send('Hellow misu! hbd to masud osman working!!')
})

app.use('/api/v1/posts',postRouter)
app.use('/api/v1/users',userRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})