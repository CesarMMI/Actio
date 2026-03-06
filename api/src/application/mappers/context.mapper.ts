import { Context } from '../../domain/entities/context.entity';
import { ContextDto } from '../dtos/contexts/context.dto';

export function toContextDto(ctx: Context): ContextDto {
  return {
    id: ctx.id,
    name: ctx.getName(),
    description: ctx.description,
    active: ctx.isActive(),
  };
}
