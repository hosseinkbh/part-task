import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { EventModelDefinition } from "../../models/event.model";
import EventController from "./event.controller";
import EventService from "./event.service";

@Module({
  imports: [
    MongooseModule.forFeature([EventModelDefinition]),
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class AppModule {}
