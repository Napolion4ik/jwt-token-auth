const Router = require("express").Router
const userController = require("../controlers/user-controler")
const authMiddelware = require("../middelwares/auth-middelware")

const {body} = require('express-validator')

const router = new Router();

router.post('/registration',body('email').isEmail(),body('password').isLength({min: 3, max: 32}),userController.registration)
router.post('/login',userController.login)
router.post('/logout', userController.logout)
router.get('/activate/:link', userController.activation)
router.get('/refresh', userController.refresh)
router.get('/users',authMiddelware, userController.getUsers)



module.exports = router