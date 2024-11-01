import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './dataSource';
import { UserModule } from './modules/user/user.module';
import { ServiceGroupModule } from './modules/service-group/service-group.module';
import { TeamModule } from './modules/team/team.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    UserModule,
    ServiceGroupModule,
    TeamModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
