import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Role } from '@prisma/client';

export const ROLES_KEY = 'roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // get required roles from decorator
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // if no roles required — allow through
    if (!requiredRoles) return true;

    // get user from request
    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req.user;

    // check if user has required role
    return requiredRoles.includes(user.role);
  }
}