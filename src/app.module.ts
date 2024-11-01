import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './dataSource';
import { UserModule } from './modules/user/user.module';
import { ServiceGroupModule } from './modules/service-group/service-group.module';
import { TeamModule } from './modules/team/team.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    ServiceGroupModule,
    TeamModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
