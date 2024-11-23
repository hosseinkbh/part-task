import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {RulesModel, StatusEnum} from "../../models/rules.model";
import {CreateRuleDto, ListRulesPaginationDto, RuleDateDto, UpadateRuleDto,} from "../../dto/rules.dto";
import {AdaptationsModel} from "../../models/Adaptations.model";
import {CacheService} from "../cacheService/cache.service";
import {Model, Types} from "mongoose";

@Injectable()
export default class RulesService {
    constructor(
        @InjectModel(RulesModel.name)
        private readonly ruleModel: Model<RulesModel>,
        @InjectModel(AdaptationsModel.name)
        private readonly AdaptionModel: Model<AdaptationsModel>,
        private readonly cacheService: CacheService,
    ) {
    }

    async createRule(data: CreateRuleDto) {
        const rule = await this.ruleModel.create(data);
        await this.cacheService.SetKeyValue(`rule-${rule._id}`, data);
    }

    async getRule(id: string) {
        const cachedValue = await this.cacheService.getKeyValue(`rule-${id}`);
        if (cachedValue) {
            return cachedValue;
        } else {
            return this.ruleModel.findById(id);
        }
    }

    async listRules(paginationData :ListRulesPaginationDto) {
        const {skip, limit} = paginationData;
        const paginate = {
            skip: skip ? +skip : 0,
            limit: limit ? +limit : 50,
        };
        return this.ruleModel.find({},{},{skip :paginate.skip,limit :paginate.limit});
    }

    async updateRule(id: string, values: UpadateRuleDto) {
        const {logic, name, status, value} = values;
        const validatedInputs: Partial<UpadateRuleDto> = {};

        if (logic) validatedInputs.logic = logic;
        if (name) validatedInputs.name = name;
        if (status) validatedInputs.status = status;
        if (value) validatedInputs.value = value;

        const updatedRule = await this.ruleModel.findByIdAndUpdate(
            id,
            validatedInputs,
            {new: true},
        );
        const cacheParam = {
            name: updatedRule?.name,
            value: updatedRule?.value,
            logic: updatedRule?.logic,
        };
        await this.cacheService.SetKeyValue(`rule-${id}`, cacheParam);
    }

    async deActiveRule(id: string) {
        await this.cacheService.Delete(`rule-${id}`);
        await this.ruleModel.findByIdAndUpdate(id, {status: StatusEnum.DEACTIVE});
    }

    async occurenceOfRule(id: string, dates: RuleDateDto) {
        const {startDate, endDate,startTime,endTime} = dates;
        console.log(startDate ,endDate)
        const start = `${startDate}T${startTime}`
        const end = `${endDate}T${endTime}`
        console.log(start,end);
        
        return this.AdaptionModel.aggregate([
            {
                $match: {
                    ruleId: new Types.ObjectId(id),
                },
            },
            {
                $match: {
                    createdAt: {
                        $gte: new Date(start),
                        $lte: new Date(end)
                    },
                },
            },
            {
                $project: {
                    createdAt: 1,
                    agentId: 1,
                },
            },
            {
                $group: {
                    _id: "$agentId",
                    dates: {$push: "$createdAt"},
                },
            },
        ]);
    }

    async getRuleActionPerAgent(id: string) {
        return this.AdaptionModel.aggregate([
            {
                $match: {
                    ruleId:new Types.ObjectId(id),
                },
            },
            {
                $group: {
                    _id: "$agentId",
                    counts: {
                        $sum: 1,
                    },
                },
            },
            {
                $sort: {
                    counts: -1,
                },
            },
        ]);
    }
}
