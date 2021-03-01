import { Router } from 'express'

import UserController from '@modules/Users/controllers/UserController'

import SurveysController from '@modules/Surveys/controllers/SurveysController'

import SendMailController from '@modules/SurveyUser/controllers/SendMailController'

import AnswerController from '@modules/Surveys/controllers/AnswerController'

import NpsController from '@modules/Surveys/controllers/NpsController'

const router = Router()

const userController = new UserController()

const surveysController = new SurveysController()

const sendMailController = new SendMailController()

const answerController = new AnswerController()

const npsController = new NpsController()

router.post('/users', userController.create)

router.post('/surveys', surveysController.create)

router.get('/surveys', surveysController.show)

router.post('/sendMail', sendMailController.execute)

router.get('/answers/:value', answerController.execute)

router.get('/nps/:survey_id', npsController.execute)

export { router }
