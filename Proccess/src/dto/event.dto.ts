import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { EventNamesEnum } from "../models/event.model";


export class EventDataDto {
@IsNotEmpty()
@IsString()
agentId!: string

@IsNotEmpty()
@IsString()
@IsEnum(EventNamesEnum)
name!: string

@IsNotEmpty()
@IsNumber()
value!: string
}