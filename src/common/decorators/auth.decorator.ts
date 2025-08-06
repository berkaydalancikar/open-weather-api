import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from './roles.decorator';

export function Auth(...roles: number[]) {
  return applyDecorators(
    UseGuards(AuthGuard('jwt'), RolesGuard),
    Roles(...roles),
  );
}