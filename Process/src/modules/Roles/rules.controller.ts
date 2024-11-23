import {Body, Controller, Get, Param, Post, Put} from "@nestjs/common";
import {CreateRuleDto, ListRulesPaginationDto, RuleDateDto, UpadateRuleDto,} from "../../dto/rules.dto";
import RulesService from "./rules.service";
import {MongoObjectIdDTO} from "../../dto/global.dto";

@Controller({path: "rules"})
export default class RulesController {
    constructor(private readonly rulesService: RulesService) {
    }

    @Post("create")
    async createRule(
        @Body() body: CreateRuleDto
    ) {
        await this.rulesService.createRule(body);
    }

    @Get("/:id")
    async GetRule(@Param() {id}: MongoObjectIdDTO) {
        return this.rulesService.getRule(id);
    }

    @Get("/list")
    async GetRuleList(@Body() pagination :ListRulesPaginationDto) {
        return this.rulesService.listRules(pagination);
    }

    @Put("/update/:id")
    async updateRule(
        @Param() {id}: MongoObjectIdDTO,
        @Body() body: UpadateRuleDto,
    ) {
        await this.rulesService.updateRule(id, body);
    }

    @Get("/delete/:id")
    async deleteRule(@Param() {id}: MongoObjectIdDTO) {
        await this.rulesService.deActiveRule(id);
    }

    @Get("/occurrence/:id")
    async occurrenceOfRule(
        @Param() {id}: MongoObjectIdDTO,
        @Body() body: RuleDateDto,
    ) {
        return this.rulesService.occurenceOfRule(id, body);
    }

    @Get("agents/:id")
    async getRuleActionPerAgent(@Param() {id}: MongoObjectIdDTO) {
        return this.rulesService.getRuleActionPerAgent(id);
    }
}
