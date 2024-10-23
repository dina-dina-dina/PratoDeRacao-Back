require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http"); // Import http to create the server
const { Server } = require("socket.io"); // Import Socket.IO

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const tutorRoutes = require("./routes/tutors");
const petRoutes = require("./routes/pets");
const weightRoutes = require("./routes/weights");

const app = express();

// Create the HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with the server
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (you can restrict this if needed)
    methods: ["GET", "POST"],
  },
});

// Middleware to use `Socket.IO` in requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Socket.IO connection handling (optional)
io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve static files

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tutors", tutorRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/weights", weightRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Conectado ao MongoDB");

    // Start the server after successful MongoDB connection
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Erro ao conectar ao MongoDB:", error);
  });
