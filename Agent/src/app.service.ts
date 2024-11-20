import {Inject, Injectable} from '@nestjs/common';
import {ClientKafka} from '@nestjs/microservices';
import {ConfigService} from '@nestjs/config';
import {Interval} from '@nestjs/schedule';
import {faker} from '@faker-js/faker';

@Injectable()
export class AppService {

    private KAFKA_TOPIC = this.configService.getOrThrow('KAFKA_TOPIC');

    constructor(
        @Inject('KAFKA_CLIENT')
        private readonly kafkaClient: ClientKafka,
        private readonly configService: ConfigService,
    ) {
    }

    @Interval(200)
    async sendData() {
        const data = {
            name: faker.helpers.arrayElement(["temperature", "speed", "volt", "noise", "light"]),
            value: faker.number.int({min: -1000, max: 1000})
        }
        this.kafkaClient.emit(this.KAFKA_TOPIC, {
            agentId: this.configService.getOrThrow("AGENT_ID"),
            data: data
        });
    }
}
