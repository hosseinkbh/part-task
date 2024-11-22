import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RulesModelDefinition } from "../../models/rules.model";
import RulesController from "./rules.controller";
import RulesService from "./rules.service";
import { ValidateModelDefinition } from "../../models/validate.model";
import { CacheService } from "../cacheService/cache.service";

@Module({
  imports: [
    MongooseModule.forFeature([RulesModelDefinition, ValidateModelDefinition]),
  ],
  controllers: [RulesController],
  providers: [RulesService, CacheService],
})
export class RulesModule {}
