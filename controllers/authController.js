const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const db = require("../config/db");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY || "secret";
const transporter = nodemailer.createTransport({
  host : "smtp.gmail.com",
  port : 587,
  secure : false,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  },
});

const generateRandomPassword = () => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

exports.register = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) return res.status(400).json({ message: "Password tidak cocok" });
  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  db.run(
    "INSERT INTO users (name, email, password, otp) VALUES (?, ?, ?, ?)",
    [name, email, hashedPassword, otp],
    function (err) {
      if (err) return res.status(500).json({ message: "Email sudah digunakan" });
      transporter.sendMail({ from: process.env.EMAIL_USER, to: email, subject: "Kode Verifikasi", text: `Kode OTP Anna: ${otp}` });
      res.json({ message: "Registrasi berhasil, cek email untuk OTP" });
    }
  );
};

exports.verify = (req, res) => {
  const { email, otp } = req.body;
  db.get("SELECT * FROM users WHERE email = ? AND otp = ?", [email, otp], (err, user) => {
    if (!user) return res.status(400).json({ message: "OTP salah atau email tidak ditemukan" });
    db.run("UPDATE users SET isVerif = 1, otp = NULL WHERE email = ?", [email]);
    res.json({ message: "Verifikasi berhasil" });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err) {
      console.error(`Error fetching user: ${err.message}`);
      return res.status(500).json({ status: "error", message: "Internal server error" });
    }
    if (!user) {
      return res.status(400).json({ status: "error", message: "Email atau password salah" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(`Password valid: ${isPasswordValid}`);
    if (!isPasswordValid) {
      return res.status(400).json({ status: "error", message: "Email atau password salah" });
    }
    if (user.isVerif === 0) {
      return res.status(400).json({ status: "error", message: "Akun belum diverifikasi" });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ status: "success", message: "Login berhasil", data: user, token });
  });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const newPassword = generateRandomPassword();
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  console.log(`New password: ${newPassword}`);
  console.log(`Hashed password: ${hashedPassword}`);

  db.run("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, email], (err) => {
    if (err) {
      console.error(`Error updating password: ${err.message}`);
      return res.status(400).json({ status: "error", message: "Email tidak ditemukan" });
    }
    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password",
      text: `Password baru Anda adalah: ${newPassword}`
    });
    res.json({ status: "success", message: "Password baru telah dikirim ke email" });
  });
};

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (!user || user.otp !== otp) {
      return res.status(400).json({ status: "error", message: "Kode OTP salah atau email tidak ditemukan" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    db.run("UPDATE users SET password = ?, otp = NULL WHERE email = ?", [hashedPassword, email], () => {
      res.json({ status: "success", message: "Password berhasil direset" });
    });
  });
};



