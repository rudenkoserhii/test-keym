import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

const TOKEN_TYPE = 'Bearer';
const TOKEN_DELIMITER = ' ';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const authHeader = req?.headers?.authorization;
      if (!authHeader) {
        throw new UnauthorizedException({ message: 'Authorization header missing' });
      }
      
      const [bearer, token] = authHeader?.split(TOKEN_DELIMITER) || [];
      
      if (bearer !== TOKEN_TYPE || !token) {
        throw new UnauthorizedException({ message: 'Invalid Authorization header format' });
      }

      const user = await this.jwtService.verify(token);
      req.user = user;
      return true;
    } catch (error) {
      if (error.message === 'Authorization header missing') {
        throw new UnauthorizedException({ message: 'Authorization header missing' });
      } else if (error.message === 'jwt malformed') {
        throw new UnauthorizedException({ message: 'Invalid or expired token' });
      } else {
        throw new UnauthorizedException({ 
          error: error?.message, 
          message: 'User is not authorized' 
        });
      }
    }
  }
}