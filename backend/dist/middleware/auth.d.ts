import { Request, Response, NextFunction } from "express";
import { UserDocument, UserRole } from "../models/User";
export interface AuthRequest extends Request {
    user?: UserDocument;
}
export declare function authenticate(req: AuthRequest, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
export declare function authorizeRoles(...allowed: UserRole[]): (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare function signJwt(user: UserDocument): string;
//# sourceMappingURL=auth.d.ts.map