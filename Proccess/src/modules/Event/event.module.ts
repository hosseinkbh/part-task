import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { EventModelDefinition } from "../../models/event.model";
import EventController from "./event.controller";
import EventService from "./event.service";
import { RulesModelDefinition } from "../../models/rules.model";
import { AdaptionModelDefinition } from "../../models/Adaptations.model";
import { CacheService } from "../cacheService/cache.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      EventModelDefinition,
      RulesModelDefinition,
      AdaptionModelDefinition,
    ]),
  ],
  controllers: [EventController],
  providers: [EventService, CacheService],
})
export class EventModule {}
