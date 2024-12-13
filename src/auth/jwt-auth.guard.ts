import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MESSAGES } from 'constants/messages.enum';

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
        throw new UnauthorizedException({ message: MESSAGES.AUTH_HEADER_MISSING });
      }
      
      const [bearer, token] = authHeader?.split(TOKEN_DELIMITER) || [];
      
      if (bearer !== TOKEN_TYPE || !token) {
        throw new UnauthorizedException({ message: MESSAGES.INVALID_AUTH_HEADER });
      }

      const user = await this.jwtService.verify(token);
      req.user = user;
      return true;
    } catch (error) {
      if (error.message === MESSAGES.AUTH_HEADER_MISSING) {
        throw new UnauthorizedException({ message: MESSAGES.AUTH_HEADER_MISSING });
      } else if (error.message === MESSAGES.JWT_MAILFORMED) {
        throw new UnauthorizedException({ message: MESSAGES.INVALID_TOKEN });
      } else {
        throw new UnauthorizedException({ 
          error: error?.message, 
          message: MESSAGES.NOT_AUTHORIZED 
        });
      }
    }
  }
}