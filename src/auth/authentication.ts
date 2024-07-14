import passport from "passport"
import express from 'express'


export const authenticateUser = async (req: express.Request, res: express.Response) => {
   passport.authenticate('local', (err: any, user: any, info: any) => {
      console.log('info', user);
   })
}