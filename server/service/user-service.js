const userModal = require("../models/user-modal");
const bcrypt = require("bcrypt")
const uuid = require('uuid')
const mailService = require('./mail-service')
const tokenService = require("./token-service");
const userDto = require("../dtos/user-dtos");
const ApiError = require('../exeptions/api-error');
const UserData = require("../dtos/user-dtos");



class UserService {
    async registration (email,password) {
        const candidate = await userModal.findOne({email});
        if (candidate) {
            throw ApiError.BadRequest(`Користувач з поштовим адресом ${email}  вже існує!`)
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const activationLink = uuid.v4();
        const user = await userModal.create({email, password: hashPassword, activationLink})

        // await mailService.sendActivationMail(email,`${process.env.API_URL}/api/activate/${activationLink}`  )

        const userDta = new userDto(user)
        const tokens = tokenService.generateTokens({...userDta})

        await tokenService.saveToken(userDta.id, tokens.refreshToken)

        return{
            ...tokens,
            user: userDta
        }
    }


    async activete(activationLink) {
        const user = await userModal.findOne({activationLink});
        if(!user) {
            throw new ApiError.BadRequest("Некоректне посилання активації")
        }

        user.isActivated = true;
        await user.save();

    }


    async login (email, password) {
        const user = await userModal.findOne({email});

        if (!user) {
            throw ApiError.BadRequest("Користувача з таким email не знайдено!")
        }

        const isPassEquals = await bcrypt.compare(password, user.password);

        if(!isPassEquals) {
            throw ApiError.BadRequest("Невырний пароль")
        }

        const userData = new userDto(user);

        const tokens = tokenService.generateTokens({...userData});

        await tokenService.saveToken(userData.id, tokens.refreshToken)

        return{
            ...tokens,
            user: userData
        }
    }

    async logout (refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh (refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnautorizedError();
        }

        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFrontDB = tokenService.findToken(refreshToken);
        if(!userData || !tokenFrontDB) {
            throw ApiError.UnautorizedError();
        }
        const user = await userModal.findById(userData.id)
        const userDta = new userDto(user);

        const tokens = tokenService.generateTokens({...userDta});

        await tokenService.saveToken(userDta.id, tokens.refreshToken)

        return{
            ...tokens,
            user: userData
        }

    }


    async getAllUsers() {
        const users = await userModal.find();
        return users;
    }
}

module.exports = new UserService();