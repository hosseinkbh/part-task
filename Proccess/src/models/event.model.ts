import {ModelDefinition, Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {HydratedDocument, SchemaTimestampsConfig} from "mongoose";

@Schema({timestamps: true, collection: "event_model", versionKey: false})
export class EventModel {
    @Prop({type: String, required: true})
    name!: string;
    @Prop({type: Number, required: true})
    value!: number;
    @Prop({type: Number, required: true})
    agentId!: number;
}

export const EventSchema = SchemaFactory.createForClass(EventModel);
export type EventDocument = HydratedDocument<
    EventModel & SchemaTimestampsConfig
>;
export const EventModelDefinition: ModelDefinition = {
    name: EventModel.name,
    schema: EventSchema,
};
