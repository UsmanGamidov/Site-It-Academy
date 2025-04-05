import { body } from 'express-validator'


export const loginValidation = [
    body('email').isEmail(),
    body('password').isLength({min: 5}),
]

export const registerValidation = [
    body('fullName').isLength({min: 3}),
    body('email').isEmail(),
    body('password').isLength({min: 6}),
    body('avatarUrl').optional().isURL(),
]

export const direction = [
    body('title').isLength({min: 5}).isString(),
    body('tags').isLength().isString(),
]