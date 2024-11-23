import {plainToInstance} from "class-transformer";
import {IsNotEmpty, IsString, validateSync,} from "class-validator";
import * as process from "node:process";

export default class EnvironmentVariables {
    @IsNotEmpty()
    @IsString()
    AGENT_ID!: string
    @IsNotEmpty()
    @IsString()
    KAFKA_TOPIC!: string
    @IsNotEmpty()
    @IsString()
    KAFKA_BROKER!: string
    @IsNotEmpty()
    @IsString()
    KAFKA_CLIENT_ID!: string

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
        if(result){
            return result
        }
    const error = {
        name: param,
        message: `Provided Environment Variable isnt Correct !!!`
    }
    throw Error(JSON.stringify(error))

}
