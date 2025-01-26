const express = require('express');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const { Appointment, User } = require('./models');
require('dotenv').config({ path: '../.env' });

const app = express();
const saltRounds = 10;

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(verified.id);
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(require('./swagger.json')));

app.post('/create-appointments', authenticate, async (req, res) => {
  try {
    const appointment = await Appointment.create({
      ...req.body,
      userId: req.user.id
    });
    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/appointments', authenticate, async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: { userId: req.user.id }
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/appointments/:id', authenticate, async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!appointment) return res.status(404).json({ error: 'Not found' });

    await appointment.update(req.body);
    res.json(appointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/appointments/:id', authenticate, async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!appointment) return res.status(404).json({ error: 'Not found' });

    await appointment.destroy();
    res.json({ message: 'Appointment deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Auth endpoints
app.post('/signup', async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    console.log(req.body);
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    console.log(hashedPassword);
    const user = await User.create({
      email: req.body.email,
      password: hashedPassword
    });
    
    res.status(201).json({
      id: user.id,
      email: user.email
    });
  } catch (error) {
    res.status(400).json({ error: 'Registration failed' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ 
      where: { 
        email: req.body.email.toLowerCase().trim() 
      } 
    });

    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials' 
      });
    }

    const validPass = await bcrypt.compare(
      req.body.password.trim(),
      user.password
    );

    if (!validPass) {
      return res.status(401).json({
        success: false, 
        error: 'Invalid credentials'
      });
    }
    console.log(process.env.JWT_SECRET);
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Răspuns corect pentru succes
    res.status(200).json({
      success: true,
      token,
      user: { 
        id: user.id, 
        email: user.email 
      },
      expiresIn: 3600 // 1 ora în secunde
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));