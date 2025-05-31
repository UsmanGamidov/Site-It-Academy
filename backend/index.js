import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { registerValidation, loginValidation, direction, course } from './validations.js';

import checkAuth, { isAdmin } from './middleware/checkAuth.js';

import * as UserController from './controllers/userController.js';
import * as DirectionController from './controllers/DirectionController.js';
import * as CourseController from './controllers/CourseController.js';
import * as sendMailController from './controllers/sendMailController.js';
import * as Favorites from './controllers/Favorites.js';
import * as applicationController from './controllers/ApplicationsController.js';

mongoose
    .connect('mongodb+srv://admin:1234@cluster0.mfwiazl.mongodb.net/kyrsovay?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('DB OK'))
    .catch((error) => console.log('DB error', error));

const app = express();

app.use(express.json());
app.use(cors());

// ---------- Favorites ----------
app.get('/favorites', checkAuth, Favorites.getAll);
app.post('/favorites/:courseId', checkAuth, Favorites.create_or_delete);

// ---------- Email ----------
app.post('/api/send-email', sendMailController.sendMail);

// ---------- Auth ----------
app.post('/login', loginValidation, UserController.login);
app.get('/profile/:id', checkAuth, UserController.getMe);
app.patch('/profile/:id', checkAuth, UserController.update);
app.post('/register', registerValidation, UserController.register);

// ---------- Directions ----------
app.get('/directions', DirectionController.getAll);
app.post('/directions', direction, DirectionController.create);

// ---------- Courses ----------
app.get('/courses', CourseController.getAll);
app.get('/courses/:id', CourseController.getOne);
app.post('/courses', course, CourseController.create);
app.delete('/courses/:id', CourseController.remove);
app.patch('/courses/:id', CourseController.update);

// ---------- Applications ----------
app.post('/applications', checkAuth, applicationController.create);
app.get('/applications/user/:userId', checkAuth, applicationController.getUserApplications);
app.get('/applications', checkAuth, isAdmin, applicationController.getAll);
app.patch('/applications/:id/status', checkAuth, isAdmin, applicationController.updateStatus);
app.delete('/applications/:id', checkAuth, isAdmin, applicationController.remove);

// ---------- Start ----------
app.listen("3001", () => {
    console.log(`Сервер запущен на порту ${3001}`);
});
