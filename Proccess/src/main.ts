import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {MicroserviceOptions, Transport} from '@nestjs/microservices';
import {getEnv} from './helpers/envCheck';

async function bootstrap() {
    const envs = getEnv(["KAFKA_GROUP_ID", "KAFKA_BROKER", "KAFKA_CLIENT_ID"])    
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
        transport: Transport.KAFKA,
        options: {
            consumer: {
                groupId: envs.KAFKA_GROUP_ID,
            },
            client: {
            brokers: [envs.KAFKA_BROKER], clientId: envs.KAFKA_CLIENT_ID,
            },
        }
    });
    await app.listen();
}

bootstrap();
