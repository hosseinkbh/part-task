import {ModelDefinition, Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {HydratedDocument, SchemaTimestampsConfig} from "mongoose";

export enum EventNamesEnum {
    temperature="temperature",
    speed="speed",
    volt="volt",
    noise="noise",
    light="light"
} 

@Schema({timestamps: true, collection: "event_model", versionKey: false})
export class EventModel {
    @Prop({type: String, required: true ,enum:EventNamesEnum})
    name!: EventNamesEnum;
    @Prop({type: Number, required: true})
    value!: number;
    @Prop({type: String, required: true})
    agentId!: string;
}

export const EventSchema = SchemaFactory.createForClass(EventModel);
export type EventDocument = HydratedDocument<
    EventModel & SchemaTimestampsConfig
>;
export const EventModelDefinition: ModelDefinition = {
    name: EventModel.name,
    schema: EventSchema,
};
