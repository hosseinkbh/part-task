import { IsMongoId, IsNotEmpty, IsString ,IsDate } from "class-validator";




export class MongoObjectIdDTO {
    @IsNotEmpty()
    @IsString()
    @IsMongoId()
    id!: string;
  }
  

export class DateDto {
  @IsDate()
  date!:string
  } 
