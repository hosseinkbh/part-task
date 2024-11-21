import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreateRuleDto } from "../../dto/rules.dto";
import RulesService from "./rules.service";
import { MongoObjectIdDTO } from "../../dto/global.dto";



@Controller({path:"rules"})
export default class RulesController {

  constructor(private readonly rulesService :RulesService){}  

@Post("create")
async createRule(
    @Body() body:CreateRuleDto
){
    await this.rulesService.createRule(body)
}
@Get("/:id")``
async GetRule(
    @Param() {id}:MongoObjectIdDTO
){
    // await this.rulesService.createRule(body)
}
@Get("/occurrence/:id")
async occurrenceOfRule(
    @Param() {id}:MongoObjectIdDTO
){
    // await this.rulesService.createRule(body)
}
@Get("agents/:id")
async agentAppliedRules() {}


}