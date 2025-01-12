const express = require('express');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerDocument = require('./swagger.json');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
const { Appointment } = require('./models');

// Endpoint pentru crearea unei programări
app.post('/appointments', async (req, res) => {
  const {
    userId,
    mechanic,
    date,
    time,
    carBrand,
    carModel,
    year,
    description,
  } = req.body;

  try {
    const appointment = await Appointment.create({
      userId,
      mechanic,
      date,
      time,
      carBrand,
      carModel,
      year,
      description,
    });

    res.status(201).json({ message: 'Programare creată cu succes', appointment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const { User } = require('./models');

app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    res.status(201).json({ message: 'Utilizator înregistrat cu succes', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ where: { email } });
      if (user && user.password === password) {
        res.status(200).json({ message: 'Autentificare reușită', user });
      } else {
        res.status(401).json({ message: 'Email sau parolă incorectă' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

app.listen(5000, () => console.log('Server running on http://localhost:5000'));
