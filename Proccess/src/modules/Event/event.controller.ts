import { Controller } from "@nestjs/common";
import EventService from "./event.service";
import { EventPattern } from "@nestjs/microservices";
import { EventDataDto } from "../../dto/event.dto";

@Controller()
export default class EventController {
  constructor(private readonly eventService: EventService) {}

  @EventPattern(process.env.KAFKA_BROKER)
  async getEvent(data: EventDataDto) {
    await this.eventService.eventHandler(data);
  }
}
