const generateHash = require("../utils/hashGenerator");
const sendEmail = require("../utils/emailService");
const User = require("../model/User");
require("dotenv").config();

const initiatePayment = async (req, res) => {
  const {
    name,
    email,
    phone,
    organization,
    role,
    experience,
    interest,
    previousExperience,
    expectations,
    amount,
  } = req.body;

  const txnid = `TXN${Date.now()}`;

  try {
    // Generate secure hash with environment variables
    const hash = generateHash({
      key: process.env.PAYU_KEY,
      txnid,
      amount,
      productinfo: "FDP Payment",
      firstname: name,
      email,
      surl: "http://localhost:5000/success", // Success URL
      furl: "http://localhost:5000/failure", // Failure URL
      salt: process.env.PAYU_SALT,
    });

    // Insert a new transaction record into the database
    await User.create({
      transaction_id: txnid,
      name,
      email,
      phone,
      organization,
      role,
      experience,
      interest,
      previousExperience,
      expectations,
      amount,
      status: "pending",
    });

    const payload = {
      key: process.env.PAYU_KEY,
      txnid,
      amount,
      productinfo: "FDP Payment",
      firstname: name,
      email,
      surl: "http://localhost:5000/success",
      furl: "http://localhost:5000/failure",
      hash,
    };

    res.json({
      action: "https://test.payu.in/_payment",
      params: payload,
    });

    console.log("Payment initiated:", payload);
  } catch (error) {
    console.error("Error initiating payment and saving data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const paymentSuccess = async (req, res) => {
  const { txnid, status, mode, amount, firstname, email, phone, hash } = req.body;

  try {
    // Validate reverse hash
    const reverseHash = generateHash({
      salt: process.env.PAYU_SALT,
      key: process.env.PAYU_KEY,
      txnid,
      amount,
      productinfo: "FDP Payment",
      firstname,
      email,
      status,
    }, true); // true for reverse hash

    if (hash !== reverseHash) {
      console.error("Hash mismatch in success response");
      return res.status(400).json({ message: "Hash validation failed" });
    }

    // Update transaction status
    await User.update(
      { status: "success", mode },
      { where: { transaction_id: txnid } }
    );

    // Send success email
    await sendEmail({
      to: email,
      subject: "Payment Success - FDP Registration",
      text: `Dear ${firstname}, your payment of INR ${amount} was successful. Thank you for registering.`,
    });

    res.redirect(
      `http://localhost:3000/success?txnid=${txnid}&status=success&mode=${mode}&amount=${amount}&name=${firstname}&email=${email}&phone=${phone}`
    );
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const paymentFailure = async (req, res) => {
  const { txnid, status, amount, firstname, email, phone, hash } = req.body;

  try {
    // Validate reverse hash
    const reverseHash = generateHash({
      salt: process.env.PAYU_SALT,
      key: process.env.PAYU_KEY,
      txnid,
      amount,
      productinfo: "FDP Payment",
      firstname,
      email,
      status,
    }, true); // true for reverse hash

    if (hash !== reverseHash) {
      console.error("Hash mismatch in failure response");
      return res.status(400).json({ message: "Hash validation failed" });
    }

    // Update transaction status
    await User.update(
      { status: "failed" },
      { where: { transaction_id: txnid } }
    );

    // Send failure email
    await sendEmail({
      to: email,
      subject: "Payment Failed - FDP Registration",
      text: `Dear ${firstname}, unfortunately, your payment of INR ${amount} could not be processed. Please try again.`,
    });

    res.redirect(
      `http://localhost:3000/failure?txnid=${txnid}&status=failed&amount=${amount}&name=${firstname}&email=${email}&phone=${phone}`
    );
  } catch (error) {
    console.error("Error updating payment failure status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const fetchAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  initiatePayment,
  fetchAllUsers,
  paymentFailure,
  paymentSuccess,
};
