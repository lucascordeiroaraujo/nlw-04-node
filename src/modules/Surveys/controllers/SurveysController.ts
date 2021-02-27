import { Request, Response } from 'express'

import { getCustomRepository } from 'typeorm'

import SurveysRepository from '../repositories/SurveysRepository'

import * as yup from 'yup'

export default class SurveysController {
  async create(request: Request, response: Response) {
    const { title, description } = request.body

    const schema = yup.object().shape({
      title: yup.string().required(),
      description: yup.string().required(),
    })

    try {
      await schema.validate(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({
        err,
      })
    }

    const surveysRepository = getCustomRepository(SurveysRepository)

    const survey = surveysRepository.create({
      title,
      description,
    })

    await surveysRepository.save(survey)

    return response.status(201).json(survey)
  }

  async show(request: Request, response: Response) {
    const surveysRepository = getCustomRepository(SurveysRepository)

    const all = await surveysRepository.find()

    return response.json(all)
  }
}
