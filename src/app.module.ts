import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReviewsModule } from './reviews/reviews.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';


@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    load: [configuration],
    envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
  }), ReviewsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
