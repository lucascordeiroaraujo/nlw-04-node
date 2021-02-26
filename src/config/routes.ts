import { Router } from 'express'

import UserController from '@modules/Users/controllers/UserController'

import SurveysController from '@modules/Surveys/controllers/SurveysController'

import SendMailController from '@modules/SurveyUser/controllers/SendMailController'

const router = Router()

const userController = new UserController()

const surveysController = new SurveysController()

const sendMailController = new SendMailController()

router.post('/users', userController.create)

router.post('/surveys', surveysController.create)

router.get('/surveys', surveysController.show)

router.post('/sendMail', sendMailController.execute)

export { router }
