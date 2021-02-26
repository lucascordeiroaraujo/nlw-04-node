import SurveysRepository from '@modules/Surveys/repositories/SurveysRepository'

import UsersRepository from '@modules/Users/repositories/UsersRepository'

import { Request, Response } from 'express'

import { getCustomRepository } from 'typeorm'

import SurveyUserRepository from '../repositories'

import SendMailService from '../services/SendMailService'

import { resolve } from 'path'
import SurveysController from '@modules/Surveys/controllers/SurveysController'

export default class SendMailController {
  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body

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

    const path = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs')

    const variables = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      link: process.env.URL_MAIL,
      user_id: user.id,
    }

    const surveyAlreadExists = await surveysUsersRepository.findOne({
      where: {
        user_id: user.id,
        value: null,
      },
      relations: ['user', 'survey'],
    })

    if (surveyAlreadExists) {
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

    await SendMailService.execute({
      to: email,
      subject: survey.title,
      variables,
      path,
    })

    await surveysUsersRepository.save(surveyUser)

    return response.json(surveyUser)
  }
}
