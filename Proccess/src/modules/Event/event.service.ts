import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {EventModel} from "../../models/event.model";
import {Model} from "mongoose";
import {EventDataDto} from "../../dto/event.dto";
import {logicEnum, RulesModel} from "../../models/rules.model";
import {ValidateModel} from "../../models/validate.model";
import {InjectRedis} from "@nestjs-modules/ioredis";
import Redis from "ioredis";


@Injectable()
export default class EventService {
    constructor(@InjectModel(EventModel.name) private readonly eventModel: Model<EventModel>,
                @InjectModel(RulesModel.name) private readonly ruleModel: Model<RulesModel>,
                @InjectModel(ValidateModel.name) private readonly validateModel: Model<ValidateModel>
        , @InjectRedis() private readonly Redis: Redis
    ) {
    }

    async eventHandler(event: EventDataDto) {
        const createdEvent = await this.eventModel.create(event);
        const rulesKeys = await this.Redis.keys(`rule-/*`)
        if (rulesKeys) {
            for(const key of rulesKeys) {
                const rule = await this.Redis.hgetall(key)
                if (event.name === rule.name) {
                    switch (rule.logic) {
                        case logicEnum.eq: {
                            if (event.value === rule.value)
                                await this.validateModel.create({
                                    agentId: event.agentId,
                                    eventId: createdEvent._id,
                                    ruleId: key
                                })
                            break;
                        }
                        case logicEnum.gt: {
                            if (event.value > rule.value)
                                await this.validateModel.create({
                                    agentId: event.agentId,
                                    eventId: createdEvent._id,
                                    ruleId: key
                                })
                            break;


                        }
                        case logicEnum.gte: {
                            if (event.value >= rule.value)
                                await this.validateModel.create({
                                    agentId: event.agentId,
                                    eventId: createdEvent._id,
                                    ruleId: key
                                })
                            break;

                        }
                        case logicEnum.lt: {
                            if (event.value < rule.value)
                                await this.validateModel.create({
                                    agentId: event.agentId,
                                    eventId: createdEvent._id,
                                    ruleId: key
                                })
                            break;


                        }
                        case logicEnum.lte: {
                            if (event.value <= rule.value)
                                await this.validateModel.create({
                                    agentId: event.agentId,
                                    eventId: createdEvent._id,
                                    ruleId: key
                                })
                            break;
                        }
                        default :{
                            break;
                        }
                    }

                }
            }
        }


    }
}