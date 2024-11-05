// backend/app.js
const express = require("express");
const cors = require("cors");
const paymentRoutes = require("./routes/paymentRoutes");
const sequelize = require("./config/sequelize"); // Adjust this path as needed
const User = require("./model/User");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", paymentRoutes);

app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  console.log("Request body:", req.body);
  console.log("Request query:", req.query);
  next();
});

app.post('/failure', async (req, res) => {

  // const { txnid, status, amount, firstname, email, phone } = req.body;
  // await User.update(
  //   { status: status },
  //   { where: { transaction_id: txnid } }
  // );

  // // Send failure email
  // await sendEmail({
  //   to: email,
  //   subject: "Payment Failed - FDP Registration",
  //   text: `Dear ${firstname}, unfortunately, your payment of INR ${amount} could not be processed. Please try again.`,
  // });

  res.redirect(
    `https://fdp.met.edu/failure?txnid=${txnid}&status=${status}&amount=${amount}&name=${firstname}&email=${email}&phone=${phone}`
  );

});


app.post('/succes', async (req, res) => {
  res.redirect(`https://fdp.met.edu/`)
})



const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Sync database
    await sequelize.sync();
    console.log("Database synchronized.");

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

startServer();
