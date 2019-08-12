import { Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'
import { getRepository } from 'typeorm'
import { validate } from 'class-validator'

import { User } from '../entity/User'

class AuthController {
  static login = async (req: Request, res: Response) => {
    //Check if username and password are set
    let { username, password } = req.body
    console.log(username, password)
    if (!(username && password)) {
      res.status(400).send()
    }

    //Get user from database
    const userRepository = getRepository(User)
    let user: User
    try {
      user = await userRepository.findOneOrFail({ where: { username } })
    } catch (error) {
      res.status(401).send()
    }

    //Check if encrypted password match
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      res.status(401).send()
      return
    }

    //Sing JWT, valid for 1 hour
    const token = jwt.sign(
      { userId: user.id, username: user.raptorname },
      process.env.sacret,
      { expiresIn: '1h' },
    )

    //Send the jwt in the response

    res.send({ ...user, token })
  }

  static changePassword = async (req: Request, res: Response) => {
    //Get ID from JWT
    const id = res.locals.jwtPayload.userId

    //Get parameters from the body
    const { oldPassword, newPassword } = req.body
    if (!(oldPassword && newPassword)) {
      res.status(400).send()
    }

    //Get user from the database
    const userRepository = getRepository(User)
    let user: User
    try {
      user = await userRepository.findOneOrFail(id)
    } catch (id) {
      res.status(401).send()
    }

    //Check if old password matchs
    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
      res.status(401).send()
      return
    }

    //Validate de model (password lenght)
    user.password = newPassword
    const errors = await validate(user)
    if (errors.length > 0) {
      res.status(400).send(errors)
      return
    }
    //Hash the new password and save
    user.hashPassword()
    userRepository.save(user)

    res.status(204).send()
  }

  static register = async (req: Request, res: Response) => {
    // const id = res.locals.jwtPayload.userId
    // if (id) {
    //   console.log('why do you have an ID if you are registering?')
    // }
    console.log('ehlo?')
    let { username, email, password } = req.body
    console.log(username, email, password)
    if (!(username && password)) {
      return res
        .status(400)
        .send('either your raptorname or password is missing')
    }

    let user = new User()
    user.raptorname = username
    user.password = password
    user.email = email
    user.role = 'spore'

    //Validate if the parameters are ok
    const errors = await validate(user)
    if (errors.length > 0) {
      res.status(400).send(errors)
      return
    }

    //Hash the password, to securely store on DB
    user.hashPassword()

    //Try to save. If fails, the username is already in use
    const userRepository = getRepository(User)
    try {
      await userRepository.save(user)
    } catch (e) {
      res.status(409).send('username already in use')
      return
    }

    const token = jwt.sign(
      { userId: user.id, username: user.raptorname },
      process.env.sacret,
      { expiresIn: '1hr' },
    )

    res.send({ ...user, token })
  }
}
export default AuthController
