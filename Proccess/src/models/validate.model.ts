import {ModelDefinition, Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {HydratedDocument, SchemaTimestampsConfig, Types} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { EventModel } from "./event.model";
import { RulesModel } from "./rules.model";

@Schema({timestamps: true, collection: "validate_model", versionKey: false})
export class ValidateModel {
    @Prop({type: String, required: true})
    agentId!: string;
    @Prop({type: Types.ObjectId, required: true})
    eventId!: EventModel;
    @Prop({type: Types.ObjectId, required: true})
    ruleId!: RulesModel;
}


export const ValidateSchema = SchemaFactory.createForClass(ValidateModel);
ValidateSchema.plugin(mongooseAggregatePaginate);
ValidateSchema.index({ruleId:1,createdAt:1})
export type ValidateDocument = HydratedDocument<
    ValidateModel & SchemaTimestampsConfig
>;

export const ValidateModelDefinition: ModelDefinition = {
    name: ValidateModel.name,
    schema: ValidateSchema,
};
