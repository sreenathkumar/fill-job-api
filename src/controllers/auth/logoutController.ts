import * as express from 'express';



//controller for handling logout
const logoutController = async (req: express.Request, res: express.Response) => {
    //do something
    res.send({ status: 'success', message: 'logged out successfully' });
}

export default logoutController;