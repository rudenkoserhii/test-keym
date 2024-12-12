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

  /**
   * @desc Validates the JWT token from the `Authorization` header and attaches the user to the request object.
   *       This guard is used to protect routes that require authentication.
   * @param {ExecutionContext} context - The execution context that contains the request and other metadata.
   * @returns {boolean | Promise<boolean> | Observable<boolean>} - Returns `true` if the user is authorized, otherwise throws an `UnauthorizedException`.
   * @throws {UnauthorizedException} - Throws if the `Authorization` header is missing, invalid, or the JWT token is invalid or expired.
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();    
    try {
      const authHeader = req?.headers?.authorization;
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
      req.user = user;

      return true;
    } catch (error) {
      throw new UnauthorizedException({
        error: error?.message,
        message: 'User is not authorized',
      });
    }
  }
}
