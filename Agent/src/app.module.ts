import {Module} from '@nestjs/common';
import {AppService} from './app.service';
import {ClientsModule, Transport} from '@nestjs/microservices';
import {ConfigModule, ConfigService} from '@nestjs/config';
import EnvironmentVariables from './helpers/envCheck';
import {ScheduleModule} from '@nestjs/schedule';

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true, validate: EnvironmentVariables.validate}),
        ScheduleModule.forRoot(),
        ClientsModule.registerAsync([{
            imports: [ConfigModule],
            inject: [ConfigService],
            name: "KAFKA_CLIENT",
            useFactory: (configService: ConfigService<EnvironmentVariables, true>) => ({
                transport: Transport.KAFKA,
                options: {
                    client: {
                        brokers: configService.getOrThrow("KAFKA_BROKER"),
                        clientId: configService.getOrThrow("KAFKA_CLIENT_ID"),
                    },
                },
            })
        }]),
    ],
    providers: [AppService],
})
export class AppModule {
}
