import { RedisModule } from "@nestjs-modules/ioredis";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import EnvironmentVariables from "../../helpers/envCheck";
import { CacheService } from "./cache.service";

@Module({
    imports:[RedisModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory(configService: ConfigService<EnvironmentVariables, true>) {
          return {
            type: "single",
            options: {
              host: configService.get("REDIS_HOST"),
              port: +configService.get("REDIS_PORT"),
            },
          };
        },
      }),

    ],
    providers:[CacheService],
    exports:[CacheService]
})
export class CacheModule {}