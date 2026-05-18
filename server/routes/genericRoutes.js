const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const GenericController = require('../controllers/genericController');


router.post('/login', AuthController.login);
router.post('/register', AuthController.register);

// 1. נתיב להבאת כל הפריטים או סינון מורכב (למשל: GET /posts או GET /todos?userId=1)
router.get('/:table', GenericController.getAll);

// 2. נתיב להבאת פריט בודד לפי ה-ID שלו (למשל: GET /users/1)
router.get('/:table/:id', GenericController.getById);

// 3. נתיב חדש: יצירת שורה חדשה בכל טבלה דינמית (למשל: POST /comments או POST /posts)
router.post('/:table', GenericController.create);

// נתיב גנרי למחיקת שורה מכל טבלה לפי ה-ID שלה
router.delete('/:table/:id', GenericController.delete);

router.patch('/:table/:id', GenericController.update);

module.exports = router;