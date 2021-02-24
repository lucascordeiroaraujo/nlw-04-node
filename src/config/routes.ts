import { Router } from 'express'

import UserController from '../modules/Users/controllers/UserController'

import SurveysController from '../modules/Surveys/controllers/SurveysController'

const router = Router()

const userController = new UserController()

const surveysController = new SurveysController()

router.post('/users', userController.create)

router.post('/surveys', surveysController.create)

router.get('/surveys', surveysController.show)

export { router }
