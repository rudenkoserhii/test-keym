import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

const TOKEN_TYPE = 'Bearer';
const TOKEN_DELIMITER = ' ';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();    
    try {
      const authHeader = req?.headers?.authorization;
      console.log('authHeader', authHeader);
      if (!authHeader) {
        throw new UnauthorizedException({ message: 'Authorization header missing' });
      }
      const [bearer, token] = authHeader?.split(TOKEN_DELIMITER) || [];
      
      if (bearer !== TOKEN_TYPE || !token) {
        throw new UnauthorizedException({
          message: 'User is not authorized',
        });
      }

      const user = this.jwtService.verify(token);
      console.log('user', user);

      req.user = user;
      // console.log('req', req);
      return true;
    } catch (error) {
      throw new UnauthorizedException({
        error: error?.message,
        message: 'User is not authorized',
      });
    }
  }
}
