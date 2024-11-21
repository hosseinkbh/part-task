import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString,IsDate } from "class-validator";
import { logicEnum, StatusEnum } from "../models/rules.model";
import { EventNamesEnum } from "../models/event.model";


export class CreateRuleDto {
@IsNotEmpty()
@IsString()
@IsEnum(EventNamesEnum)
name!: string

@IsNotEmpty()
@IsString()
@IsEnum(logicEnum)
logic!: string

@IsNotEmpty()
@IsNumber()
value!: number
}

export class UpadateRuleDto {
    @IsOptional()
    @IsString()
    @IsEnum(EventNamesEnum)
    name?: string
    
    @IsOptional()
    @IsString()
    @IsEnum(logicEnum)
    logic?: string
    
    @IsOptional()
    @IsNumber()
    value?: number

    @IsOptional()
    @IsString()
    @IsEnum(StatusEnum)
    status?: string

}
    
export class ListRulesPaginationDto {
    @IsOptional()
    @IsNumber()
    skip?:number
    @IsOptional()
    @IsNumber()
    limit?:number
}


export class RuleDateDto {
    @IsDate()
    startDate !:string
    @IsDate()
    endDate !:string

}