import { IsEnum, IsNotEmpty, IsNumber, IsObject, IsString } from "class-validator";
import { EventNamesEnum } from "../models/event.model";


export class DataEventDto {
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
export class EventDataDto {
    @IsNotEmpty()
    @IsObject()
    data!: DataEventDto
}

