import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RolesModelDefinition } from "../../models/roles.model";
import RolesController from "./roles.controller";
import RolesService from "./roles.service";

@Module({
  imports: [
    MongooseModule.forFeature([RolesModelDefinition]),
  ],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
