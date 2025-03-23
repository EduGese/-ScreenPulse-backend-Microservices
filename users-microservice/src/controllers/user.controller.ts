import { Request, Response, NextFunction } from "express";

import UserService from "../services/user.service";
import mongoose from "mongoose";

class UserController {

  async loginUser(req: Request, res: Response, next: NextFunction) {

    const { email, password } = req.body;
    try {
      const response = await UserService.loginUser(email, password);
      res.json(response);
    } catch (error:any) {
      res.status(401).json({ 
        error: "Authentication failed", 
        message: error.message 
      });
      //next(error);
    }
  }

  async registerUser(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await UserService.registerUser(req.body);
      res.json(response);
    } catch (error: any) {
      res.status(409).json({ 
        error: "Data conflict", 
        message: error.message 
      });
      // next(error);
    }
  }

  async verifyUserExist(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      console.log("UserId",userId);
      //Validacion del tipo userId como ObjectId de mongoose--> moverlo a un middleware de validacion
      if (!mongoose.Types.ObjectId.isValid(userId)) {
         res.status(400).json({ error: "Invalid user ID format" });
         return;
      }
      const response = await UserService.verifyUserExist(userId);
      console.log("Response",response);
      res.json(response);
    } catch (error: any) {
      res.status(404).json({ 
        error: "User not found", 
        message: error.message 
      });
      // next(error);
    }
  }
}

export default new UserController();
