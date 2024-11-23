import {Controller, Inject} from "@nestjs/common";
import EventService from "./event.service";
import {ClientKafka, EventPattern} from "@nestjs/microservices";
import {EventDataDto} from "../../dto/event.dto";
import * as process from "node:process";

require('dotenv').config();


export const KAFKA_TOPIC = process.env.KAFKA_TOPIC

@Controller()
export default class EventController {
    constructor(private readonly eventService: EventService,
                @Inject("PROCESS_CLIENT") private readonly client: ClientKafka
    ) {
    }

    @EventPattern(KAFKA_TOPIC)
    async getEvent({data}: EventDataDto) {
        await this.eventService.eventHandler(data);
    }
}
