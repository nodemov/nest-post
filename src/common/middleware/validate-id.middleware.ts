import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ValidateIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;

    if (id !== undefined) {
      // Check if id is a valid integer
      const numId = Number(id);
      
      if (!Number.isInteger(numId) || numId < 1 || isNaN(numId)) {
        throw new BadRequestException(
          `Validation failed (numeric string is expected for path parameter 'id')`,
        );
      }
    }

    next();
  }
}
