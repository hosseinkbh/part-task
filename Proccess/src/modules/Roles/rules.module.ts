import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RulesModelDefinition } from "../../models/rules.model";
import RulesController from "./rules.controller";
import RulesService from "./rules.service";

@Module({
  imports: [
    MongooseModule.forFeature([RulesModelDefinition]),
  ],
  controllers: [RulesController],
  providers: [RulesService],
})
export class RulesModule {}
