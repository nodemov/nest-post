import {
  Controller,
  Get,
  Post,
  Body,
  Render,
  Req,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AuthGuard } from './guards/auth.guard';

@Controller({ path: 'auth', version: '1' })
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @Render('auth/login')
  @ApiOperation({ summary: 'Show login page' })
  showLogin(@Session() session: Record<string, any>) {
    if (session.admin) {
      return { redirect: '/v1/posts/web' };
    }
    return { error: null };
  }

  @Post('login')
  @ApiOperation({ summary: 'Process login' })
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
    @Session() session: Record<string, any>,
    @Res() res: Response,
  ) {
    try {
      const admin = await this.authService.validateAdmin(username, password);
      session.admin = admin;
      return res.redirect('/v1/posts/web');
    } catch (error) {
      return res.render('auth/login', {
        error: 'Invalid username or password',
      });
    }
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout' })
  logout(@Session() session: Record<string, any>, @Res() res: Response) {
    session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
      }
      res.redirect('/v1/auth/login');
    });
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  @Render('auth/profile')
  @ApiOperation({ summary: 'Show profile page' })
  showProfile(@Session() session: Record<string, any>) {
    return { admin: session.admin };
  }
}
