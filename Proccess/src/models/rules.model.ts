import {ModelDefinition, Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {HydratedDocument, SchemaTimestampsConfig} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export enum logicEnum {
    gt = "gt",
    gte = "gte",
    eq = "eq",
    lt = "lt",
    lte = "lte"
}
export enum StatusEnum{
ACTIVE ="ACTIVE",
DEACTIVE = "DEACTIVE"
}

@Schema({timestamps: true, collection: "rules_model", versionKey: false})
export class RulesModel {
    @Prop({type: String, required: true})
    name!: string;
    @Prop({type: String, required: true, enum: logicEnum})
    logic!: logicEnum;
    @Prop({type: Number, required: true})
    value!: number;
    @Prop({type: String, required: true, enum: StatusEnum, default :StatusEnum.ACTIVE})
    status!: string;
}

export const RulesSchema = SchemaFactory.createForClass(RulesModel);
RulesSchema.plugin(mongooseAggregatePaginate);

export type RulesDocument = HydratedDocument<
    RulesModel & SchemaTimestampsConfig
>;

export const RulesModelDefinition: ModelDefinition = {
    name: RulesModel.name,
    schema: RulesSchema,
};
