import '@nestjs/swagger';

declare module '@nestjs/swagger' {
  export function ApiBearerAuth(
    name: 'user' | 'admin',
  ): ClassDecorator & MethodDecorator;
}
