import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {getEnv} from './helpers/envCheck';
import {MicroserviceOptions, Transport} from "@nestjs/microservices";
import * as dotenv from 'dotenv';

async function bootstrap() {
    dotenv.config();
    const envs = getEnv(["PORT", "KAFKA_TOPIC", "KAFKA_GROUP_ID", "KAFKA_BROKER", "KAFKA_CLIENT_ID"])
    const app = await NestFactory.create(AppModule);
    const microService = app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.KAFKA
        , options: {
            consumer: {
                groupId: envs.KAFKA_GROUP_ID,
            },
            client: {
                brokers: [envs.KAFKA_BROKER],
                clientId: envs.KAFKA_CLIENT_ID,
            },
        },

    })
    await app.startAllMicroservices()
    await app.listen(envs.PORT);
}

bootstrap();
