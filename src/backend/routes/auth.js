const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Mock user database
const users = [];

// Middleware for registering a user
router.post('/register', async (req, res) => {
  try {
    const { username, password, cnpj, codigoANA, endereco, emailResponsavel, telefoneResponsavel } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const cliente = await Cliente.create({
      cnpj,
      codigoANA,
      endereco,
      emailResponsavel,
      telefoneResponsavel,
    });

    const user = await User.create({
      username,
      password: hashedPassword,
      clienteId: cliente.id,
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// Middleware for logging in
router.post('/login', async (req, res) => {
  try {
    const { username, password, deviceType, osType } = req.body;
    
    const user = await User.findOne({ where: { username } });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Execute system adapter
    const pythonProcess = spawn('python', [
      path.join(__dirname, '..', 'system_adapter.py'),
      deviceType,
      osType
    ]);

    let systemConfig = '';

    pythonProcess.stdout.on('data', (data) => {
      systemConfig += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Error: ${data}`);
    });

    pythonProcess.on('close', async (code) => {
      if (code !== 0) {
        return res.status(500).json({ message: 'Error configuring system' });
      }

      try {
        const config = JSON.parse(systemConfig);
        
        // Update instance URL based on device/OS
        const baseUrl = process.env.BASE_URL || 'http://localhost';
        user.cloudInstanceUrl = `${baseUrl}/ahq/${user.id}/${deviceType}/${osType}`;
        await user.save();

        const token = jwt.sign(
          { 
            id: user.id,
            deviceType,
            osType,
            systemConfig: config
          }, 
          process.env.JWT_SECRET, 
          { expiresIn: '1h' }
        );

        res.json({ 
          token, 
          redirectUrl: user.cloudInstanceUrl,
          systemConfig: config
        });
      } catch (error) {
        console.error('Error parsing system config:', error);
        res.status(500).json({ message: 'Error processing system configuration' });
      }
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Middleware for authenticating a user
router.get('/profile', authenticateToken, (req, res) => {
  res.json({ message: 'Profile data', user: req.user });
});

// Token authentication middleware
function authenticateToken(req, res, next) {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

module.exports = router;