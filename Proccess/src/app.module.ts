import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ConfigModule, ConfigService} from '@nestjs/config';
import EnvironmentVariables from './helpers/envCheck';
import {ClientsModule, Transport} from '@nestjs/microservices';
import {MongooseModule} from '@nestjs/mongoose';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
    imports: [
        RedisModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory(configService: ConfigService<EnvironmentVariables, true>) {
              return {
                type: "single",
                options: {
                  host: configService.get("REDIS_HOST"),
                  port: +configService.get("REDIS_PORT"),
                },
              };
            },
          }),

        MongooseModule.forRootAsync({
            inject: [ConfigService],
            imports: [ConfigModule],
            useFactory: (
                configService: ConfigService<EnvironmentVariables, true>
            ) => ({
                uri: configService.getOrThrow("MONGODB_URI"),
                connectionFactory(connection) {
                    connection.on("connected", () =>
                        console.log("MongoDb is connected successfully")
                    );
                    connection._events.connected();
                    return connection;
                },
            }),
        }),
        ConfigModule.forRoot({isGlobal: true, validate: EnvironmentVariables.validate}),
        ClientsModule.registerAsync([{
                imports: [ConfigModule],
                inject: [ConfigService],
                name: "PROCCESS_CLIENT",

                useFactory: (configService: ConfigService<EnvironmentVariables, true>) => ({
                    transport: Transport.KAFKA,
                    options: {
                        subscribe :  configService.getOrThrow("KAFKA_TOPIC"),
                        consumer: {
                            groupId: configService.getOrThrow("KAFKA_GROUP_ID"),
                        },
                        client: {
                            brokers:[configService.getOrThrow("KAFKA_BROKER")],
                            clientId: configService.getOrThrow("KAFKA_CLIENT_ID"),
                        },
                    },
                }),
            }]
        ),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
