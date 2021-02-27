import SurveysRepository from '@modules/Surveys/repositories/SurveysRepository'

import UsersRepository from '@modules/Users/repositories/UsersRepository'

import { Request, Response } from 'express'

import { getCustomRepository } from 'typeorm'

import SurveyUserRepository from '../repositories'

import SendMailService from '../services/SendMailService'

import { resolve } from 'path'

import * as yup from 'yup'

export default class SendMailController {
  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body

    const schema = yup.object().shape({
      email: yup.string().email().required(),
      survey_id: yup.string().required(),
    })

    try {
      await schema.validate(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({
        err,
      })
    }

    const usersRepository = getCustomRepository(UsersRepository)

    const surveysRepository = getCustomRepository(SurveysRepository)

    const surveysUsersRepository = getCustomRepository(SurveyUserRepository)

    const user = await usersRepository.findOne({ email })

    if (!user) {
      return response.status(400).json({
        error: 'User does not exists',
      })
    }

    const survey = await surveysRepository.findOne({
      id: survey_id,
    })

    if (!survey) {
      return response.status(400).json({
        error: 'Surveys does not exists!',
      })
    }

    const surveyAlreadExists = await surveysUsersRepository.findOne({
      where: {
        user_id: user.id,
        value: null,
      },
      relations: ['user', 'survey'],
    })

    const path = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs')

    const variables = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      link: process.env.URL_MAIL,
      survey_id: '',
    }

    if (surveyAlreadExists) {
      variables.survey_id = surveyAlreadExists.id

      await SendMailService.execute({
        to: email,
        subject: survey.title,
        variables,
        path,
      })

      return response.json(surveyAlreadExists)
    }

    const surveyUser = surveysUsersRepository.create({
      user_id: user.id,
      survey_id,
    })

    await surveysUsersRepository.save(surveyUser)

    variables.survey_id = surveyUser.id

    await SendMailService.execute({
      to: email,
      subject: survey.title,
      variables,
      path,
    })

    return response.json(surveyUser)
  }
}
