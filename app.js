// backend/app.js
const express = require("express");
const cors = require("cors");
const paymentRoutes = require("./routes/paymentRoutes");
const sequelize = require("./config/sequelize"); // Adjust this path as needed

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

app.post('/failure', (req, res) => {
  // Handle the payment callback response from PayU
  // You can update the payment status in the database and send a notification to the user
  res.redirect('http://localhost:3000/failure');
});



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
