import {InjectRedis} from "@nestjs-modules/ioredis";
import {Injectable} from "@nestjs/common";
import Redis from "ioredis";


@Injectable()
export class CacheService {
    constructor(@InjectRedis() private readonly Redis: Redis) {
    }

    async getKeys(type: string) {
        return this.Redis.keys(`${type}-`)
    }

    async SetKeyValue(
        id: string, value: Object
    ) {
        await this.Redis.hset(id, value)

    }

    async Delete(id: string) {
        await this.Redis.del([id])
    }

    async getKeyValue(id: string) {
        return this.Redis.hgetall(id)
    }

}