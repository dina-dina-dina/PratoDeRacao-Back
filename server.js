// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const tutorRoutes = require("./routes/tutors");
const petRoutes = require("./routes/pets");
const weightRoutes = require('./routes/weights');

const app = express();



// Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve arquivos estáticos

// Middleware para Socket.io
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Rotas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tutors", tutorRoutes);
app.use("/api/pets", petRoutes);
app.use('/api/weights', weightRoutes);

// Conexão com o MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Conectado ao MongoDB");

    // Iniciar o servidor após a conexão bem-sucedida
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Erro ao conectar ao MongoDB:", error);
  });


