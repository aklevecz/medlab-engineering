import { Router, Request, Response } from 'express'
import auth from './auth'
import user from './user'
import toad from './toad'

const routes = Router()

routes.use('/auth', auth)
routes.use('/user', user)
routes.use('/toad', toad)

export default routes
