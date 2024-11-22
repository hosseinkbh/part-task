import { ModelDefinition, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTimestampsConfig, Types } from "mongoose";
import { EventModel } from "./event.model";
import { RulesModel } from "./rules.model";

const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

@Schema({ timestamps: true, collection: "adaption_model", versionKey: false })
export class AdaptationsModel {
  @Prop({ type: String, required: true })
  agentId!: string;
  @Prop({ type: Types.ObjectId, required: true })
  eventId!: EventModel;
  @Prop({ type: Types.ObjectId, required: true })
  ruleId!: RulesModel;
}

export const AdaptionSchema = SchemaFactory.createForClass(AdaptationsModel);
AdaptionSchema.plugin(mongooseAggregatePaginate);
AdaptionSchema.index({ ruleId: 1, createdAt: 1 });
export type AdaptionDocument = HydratedDocument<
  AdaptationsModel & SchemaTimestampsConfig
>;

export const AdaptionModelDefinition: ModelDefinition = {
  name: AdaptationsModel.name,
  schema: AdaptionSchema,
};
