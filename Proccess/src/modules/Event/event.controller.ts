import {Controller} from "@nestjs/common";
import EventService from "./event.service";
import {EventPattern} from "@nestjs/microservices";
import {ConfigService} from "@nestjs/config";
import {EventDataDto} from "../../dto/event.dto";
import * as process from "procces:node"

@Controller()
export default class EventController {
    constructor(private readonly eventService: EventService,
                private readonly configService: ConfigService
    ) {
    }
    @EventPattern(process.env.KAFKA_BROKER)
    async getEvent(data: EventDataDto) {
        await this.eventService.eventHandler(data)
    }
}