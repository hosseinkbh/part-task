import {plainToInstance} from "class-transformer";
import {IsNotEmpty, IsNumber, IsString, validateSync,} from "class-validator";
import * as process from "node:process";

export default class EnvironmentVariables {
    @IsNotEmpty()
    @IsNumber()
    PORT!: number
    @IsNotEmpty()
    @IsString()
    KAFKA_TOPIC!: string
    @IsNotEmpty()
    @IsString()
    KAFKA_BROKER!: string
    @IsNotEmpty()
    @IsString()
    KAFKA_CLIENT_ID!: string
    @IsNotEmpty()
    @IsString()
    KAFKA_GROUP_ID!: string
    @IsNotEmpty()
    @IsString()
    MONGODB_URI!: string
    @IsNotEmpty()
    @IsString()
    REDIS_HOST!: string
    @IsNotEmpty()
    @IsString()
    REDIS_PORT!: string


    static validate(config: Record<string, unknown>) {
        const validatedConfig = plainToInstance(EnvironmentVariables, config, {
            enableImplicitConversion: true,
        });
        const errors = validateSync(validatedConfig, {
            skipMissingProperties: false,
        });

        if (errors.length > 0) {
            throw new Error(errors.toString());
        }
        return validatedConfig;
    }
}

export function getEnv(param: string[]) {
    const result: any = {}
    param.forEach((item) => {
        const env = process.env[item]
        if (!env) {
            const error = {
                name: param,
                message: `Please Set ${param} Environment Variable !!!`
            }
            throw Error(JSON.stringify(error))
        } else {
            result[item] = env
        }
    })
    if (!result) {
        const error = {
            name: param,
            message: `Provided Environment Variable isnt Correct !!!`
        }
        throw Error(JSON.stringify(error))
    }

    return result
}
