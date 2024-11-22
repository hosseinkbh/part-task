import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RulesModelDefinition } from "../../models/rules.model";
import RulesController from "./rules.controller";
import RulesService from "./rules.service";
import { AdaptionModelDefinition } from "../../models/Adaptations.model";
import { CacheService } from "../cacheService/cache.service";

@Module({
  imports: [
    MongooseModule.forFeature([RulesModelDefinition, AdaptionModelDefinition]),
  ],
  controllers: [RulesController],
  providers: [RulesService, CacheService],
})
export class RulesModule {}
