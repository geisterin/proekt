const jwt = require('jsonwebtoken');
require('dotenv').config();
const { Klient, Tootaja, Roll } = require('../models');

// Middleware для проверки и расшифровки токена
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log('Auth header:', authHeader);
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1]; // Bearer <token>
  console.log('Token:', token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    let user = null;

    if (decoded.userType === 'klient') {
      user = await Klient.findByPk(decoded.id, {
        include: { model: Roll, foreignKey: 'roll_id' }
      });
    } else if (decoded.userType === 'tootaja') {
      user = await Tootaja.findByPk(decoded.id, {
        include: { model: Roll, foreignKey: 'roll_id' }
      });
    }

    console.log('Found user:', user);

    if (!user) return res.status(404).json({ message: 'User not found' });

    req.user = {
      id: user.klient_id || user.tootaja_id,
      klient_id: user.klient_id || null,
      tootaja_id: user.tootaja_id || null,
      email: user.email,
      roll: user.Roll?.roll_nimi,
      userType: decoded.userType,
    };
    
    console.log('Set user in request:', req.user);

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Роль может быть строкой или массивом

// Проверка роли
const authorizeRoll = (requiredRolls) => {
  return (req, res, next) => {
    const roll = req.user?.roll;
    if (!roll) return res.status(403).json({ message: 'Roll not found' });

    const allowed = Array.isArray(requiredRolls) ? requiredRolls : [requiredRolls];
    if (!allowed.includes(roll)) {
      return res.status(403).json({ message: `Access denied. Required: ${allowed.join(', ')}` });
    }

    next();
  };
};


module.exports = {
  verifyToken,
  authorizeRoll
};
