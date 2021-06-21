import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { HelloModule } from './hello/hello.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      autoLoadEntities: true,
      database: `${join(__dirname, '../../', 'udemy-course.db')}`,
      synchronize: true,
      type: 'sqlite',
    }),
    GraphQLModule.forRoot({
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    HelloModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
