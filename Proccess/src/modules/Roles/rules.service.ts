import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { RulesModel, StatusEnum } from "../../models/rules.model";
import { AggregatePaginateModel, Model } from "mongoose";
import { CreateRuleDto, ListRulesPaginationDto, RuleDateDto, UpadateRuleDto } from "../../dto/rules.dto";
import Redis from "ioredis";
import { InjectRedis } from "@nestjs-modules/ioredis";
import { ValidateModel } from "../../models/validate.model";



@Injectable()
export default class RulesService{

    constructor(@InjectModel(RulesModel.name) private readonly ruleModel :AggregatePaginateModel<RulesModel>,
    @InjectModel(ValidateModel.name) private readonly validateModel :AggregatePaginateModel<ValidateModel>
    ,@InjectRedis() private readonly Redis: Redis){}

   async createRule(data:CreateRuleDto){
    const rule = await this.ruleModel.create(data)
    await this.Redis.hset(`rule-${rule._id}`,data)
    }
    async getRule (id:string){
       const cachedValue =  await this.Redis.hgetall(`rule-${id}`);
    if(cachedValue){
   return cachedValue
    }else{
       return this.ruleModel.findById(id)
}
}
    async listRules(paginationData: ListRulesPaginationDto ){
        const {skip , limit} = paginationData
        const paginate = {
            skip:skip ?+skip : 0,
            limit:limit ?+limit :50,
        }
        return this.ruleModel.find({},{},paginate)
    }
    async updateRule (id:string,values:UpadateRuleDto){
    const {logic,name,status,value } = values
    const validatedInputs:Partial<UpadateRuleDto> = {};

    if(logic)
    validatedInputs.logic = logic
    if(name)
        validatedInputs.name = name
    if(status)
        validatedInputs.status = status
    if(value)
        validatedInputs.value = value

       const updatedRule =  await this.ruleModel.findByIdAndUpdate(id,validatedInputs ,{new :true})
       const cacheParam = {name :  updatedRule?.name,
        value : updatedRule?.value,
        logic : updatedRule?.logic
       }
       await this.Redis.hset(`rule-${id}`,cacheParam)
    }
    async deActiveRule(id:string){
        await this.Redis.hdel(`rule-${id}`)
        await this.ruleModel.findByIdAndUpdate(id,{status : StatusEnum.DEACTIVE})
    }
    async occurenceOfRule(id:string,dates:RuleDateDto){
    const {startDate , endDate} = dates;
        this.validateModel.aggregate([{
            $match:{"ruleId" : id
            },},
            {
                $match :{
                createdAt : {$and: [{
                        $gte: new Date(startDate).toISOString()
                    }, {$lte: new Date(endDate).toISOString()}]
                }}
                
            },{
                $project: {
                    "createdAt": 1,
                    "agentId": 1
                },
            },{
                $group: {
                    _id: "$agentId",
                    dates: {$push: "$createdAt"}
                },
            }])
    }
    async getRuleActionPerAgent (id:string){
        await this.validateModel.aggregate([
            {
                $match : {
                    ruleId : id
                }
            },{
                $group: {
                    _id: "$agentId",
                    counts: {
                        $sum: 1
                    }
                }
            }, {
                $sort: {
                    counts: -1
                }
            }
        ])

    }
}