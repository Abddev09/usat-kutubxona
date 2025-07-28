import { UserInstance } from "../models";
import { Book } from "../../models/Book";
import { User } from "../../models/User";
import { UserOrder } from "../../models/UserOrder";
import { SequelizeModels } from "../../types/sequelizeModels";
declare global {
  namespace Express {
    interface Request {
      user?: UserInstance;
    }
  }
}
declare global {
  namespace Express {
    interface Request {
      models: typeof SequelizeModels;
      user?: UserInstance;
    }
  }
}
