import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { EventModel } from "../../models/event.model";
import { Model } from "mongoose";
import { EventDataDto } from "../../dto/event.dto";
import { logicEnum, RulesModel } from "../../models/rules.model";
import { ValidateModel } from "../../models/validate.model";
import { CacheService } from "../cacheService/cache.service";

@Injectable()
export default class EventService {
  constructor(
    @InjectModel(EventModel.name)
    private readonly eventModel: Model<EventModel>,
    @InjectModel(RulesModel.name) private readonly ruleModel: Model<RulesModel>,
    @InjectModel(ValidateModel.name)
    private readonly validateModel: Model<ValidateModel>,
    private readonly cacheService: CacheService,
  ) {}

  async eventHandler(event: EventDataDto) {
    const createdEvent = await this.eventModel.create(event);
    const rulesKeys = await this.cacheService.getKeys("rule");
    let rules: any[] = [];
    if (!rulesKeys) {
      rules = await this.ruleModel.find({ name: event.name });
    } else {
      for (const key of rulesKeys) {
        rules.push(await this.cacheService.getKeyValue(key));
      }
    }
    if (rules && rules.length > 0) {
      for (const rule of rules) {
        if (this.validateEvent(event, rule)) {
          await this.validateModel.create({
            agentId: event.agentId,
            eventId: createdEvent._id,
            ruleId: rule._id,
          });
        }
      }
    }
  }

  private validateEvent(event: EventDataDto, rule: RulesModel) {
    const logic = {
      [logicEnum.eq]: (Eventvalue: number, Rulevalue: number) =>
        Rulevalue === Eventvalue,
      [logicEnum.gt]: (Rulevalue: number, Eventvalue: number) =>
        Rulevalue > Eventvalue,
      [logicEnum.gte]: (Rulevalue: number, Eventvalue: number) =>
        Rulevalue >= Eventvalue,
      [logicEnum.lt]: (Rulevalue: number, Eventvalue: number) =>
        Rulevalue < Eventvalue,
      [logicEnum.lte]: (Rulevalue: number, Eventvalue: number) =>
        Rulevalue <= Eventvalue,
    };
    if (event.name === rule.name) {
      const comparison = logic[rule.logic];
      return comparison(+event.value, rule.value);
    }
  }
}
