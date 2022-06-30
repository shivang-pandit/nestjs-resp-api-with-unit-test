
import { ForbiddenException, Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express-serve-static-core';
import { Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private jwtService: JwtService
    ) { }
    async use(req: Request, res: Response, next: NextFunction) {
        if (!req.get('auth_token')) {
            throw new ForbiddenException('auth_token is required');
        }
        
        try {
            let jwt = await this.jwtService.verify(req.get('auth_token'),{ secret: process.env.JWT_ENCRYPTION });
            if (!jwt) {
                throw new UnauthorizedException('Invalid Auth!')
            }
            req.body.user_id = jwt.user_id
        } catch (e) {
            //console.log("jwt error =>", e)
            throw new UnauthorizedException('Invalid login details!')
        }
        
        next();
    }
}
