const express = require('express');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { Appointment, User , Cat } = require('./models');
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
  console.log('authenticate');
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  console.log(token);
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
  console.log
  try {
    const appointment = await Appointment.findOne({
      where: {
        id: req.params.id,
        //userId: req.user.id
      }
    });

    if (!appointment) return res.status(404).json({ error: 'Not found' });
    console.log(req.user);
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
      password: hashedPassword,
      role : 'user'
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

app.get('/cats', async (req, res) => {
  console.log('get cats');
  const cats = await Cat.findAll();
  res.json(cats);
});

app.post('/cats',authenticate, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  console.log(req.body);
  console.log("post cats");
  try {
    const requiredFields = ['name', 'specialization', 'image', 'rating', 'availableSlots'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }

    if (req.body.rating < 0 || req.body.rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 0 and 5' });
    }

    const cat = await Cat.create({
      name: req.body.name,
      specialization: req.body.specialization,
      image: req.body.image,
      rating: parseFloat(req.body.rating),
      availableSlots: Array.isArray(req.body.availableSlots) 
        ? req.body.availableSlots 
        : req.body.availableSlots.split(',')
    });
    
    res.status(201).json(cat);
  } catch (error) {
    console.error('Error creating cat:', error);
    res.status(400).json({ error: error.message });
  }
});

app.delete('/cats/:id', authenticate, async (req, res) => {
  console.log
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  
  await Cat.destroy({ where: { id: req.params.id } });
  res.json({ message: 'Cat deleted' });
});

app.post('/cats/login', async (req, res) => {
  try {
    const { name, password } = req.body;
    console.log(name + " " + password);
    if (password !== process.env.CAT_UNIVERSAL_PASSWORD) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const cat = await Cat.findOne({ where: { name } });
    
    console.log(cat);
    if (!cat) {
      return res.status(404).json({ error: 'Cat not found' });
    }

    const token = jwt.sign(
      { id: cat.id, role: 'cat' },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, cat });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});


app.get('/cat/appointments/:id', async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: { catId: req.params.id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email'], 
        },
      ],
    });

    if (!appointments.length) {
      return res.status(404).json({ error: 'No appointments found' });
    }

    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching cat appointments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint pentru a actualiza o programare de mecanic
app.put('/cat/appointments/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      where: {
        id: req.params.id,
        catId: req.cat.id,
      },
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    await appointment.update(req.body);

    res.status(200).json({ message: 'Appointment updated', appointment });
  } catch (error) {
    console.error('Error updating cat appointment:', error);
    res.status(400).json({ error: error.message });
  }
});

// Endpoint pentru a șterge o programare de mecanic
app.delete('/cat/appointments/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      where: {
        id: req.params.id,
        catId: req.cat.id,
      },
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    await appointment.destroy();

    res.status(200).json({ message: 'Appointment deleted' });
  } catch (error) {
    console.error('Error deleting cat appointment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));