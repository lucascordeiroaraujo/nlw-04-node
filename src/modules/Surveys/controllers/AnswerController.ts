import SurveyUserRepository from '@modules/SurveyUser/repositories'

import { Request, Response } from 'express'

import { getCustomRepository } from 'typeorm'

export default class AnswerController {
  async execute(request: Request, response: Response) {
    const { value } = request.params

    const { u } = request.query

    const surveysUsersRepository = getCustomRepository(SurveyUserRepository)

    const surveyUser = await surveysUsersRepository.findOne({
      id: String(u),
    })

    if (!surveyUser) {
      return response.status(400).json({
        error: 'Survey user does not exists!',
      })
    }

    surveyUser.value = value

    await surveysUsersRepository.save(surveyUser)

    return response.status(200).json(surveyUser)
  }
}
