import express from 'express'
import multer from 'multer'
import cors from 'cors'
import nodemailer from 'nodemailer'
import mongoose from 'mongoose'
import checkAuth from './utils/checkAuth.js'
import { registerValidation, loginValidation, direction, course } from './validations.js'
import * as UserController from './controllers/userController.js'
import * as DirectionController from './controllers/DirectionController.js'
import * as CourseController from './controllers/CourseController.js'
import * as sendMailController from './controllers/sendMailController.js'

mongoose
    .connect('mongodb+srv://admin:1234@cluster0.mfwiazl.mongodb.net/kyrsovay?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('DB OK'))
    .catch((error) => console.log('DB error', error))

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'backend/uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    }
})

const app = express()
const upload = multer({ storage })

app.use(express.json());
app.use(cors())

app.use('/uploads', express.static('backend/uploads'))

app.post('/api/send-email', sendMailController.sendMail);

app.post('/login', loginValidation, UserController.login)
app.get('/me', checkAuth, UserController.getMe)
app.post('/register', registerValidation, UserController.register)

// app.post('/upload', upload.single('image'), (req, res) => {
//     res.json({
//         url: `backend/uploads/${req.file.originalname}`
//     })
// })

app.get('/directions', DirectionController.getAll)
app.post('/directions', direction, DirectionController.create)

app.get('/courses', CourseController.getAll)
app.get('/courses/:id', CourseController.getOne)
app.post('/courses', course, CourseController.create)
app.delete('/courses/:id', CourseController.remove)
app.patch('/courses/:id', CourseController.update)


app.listen(3001, () => {
    console.log(`Сервер запущен в проту ${3001}`)
})