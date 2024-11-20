import {ModelDefinition, Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {HydratedDocument, SchemaTimestampsConfig} from "mongoose";

export enum logicEnum {
    gt = "gt",
    gte = "gte",
    eq = "eq",
    lt = "lt",
    lte = "lte"
}

@Schema({timestamps: true, collection: "roles_model", versionKey: false})
export class RolesModel {
    @Prop({type: String, required: true})
    name!: string;
    @Prop({type: String, required: true, enum: logicEnum})
    logic!: logicEnum;
    @Prop({type: Number, required: true})
    value!: number;
}

export const RolesSchema = SchemaFactory.createForClass(RolesModel);
export type RolesDocument = HydratedDocument<
    RolesModel & SchemaTimestampsConfig
>;
export const RolesModelDefinition: ModelDefinition = {
    name: RolesModel.name,
    schema: RolesSchema,
};
