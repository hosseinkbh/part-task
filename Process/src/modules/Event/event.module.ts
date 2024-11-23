import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { EventModelDefinition } from "../../models/event.model";
import EventController from "./event.controller";
import EventService from "./event.service";
import { RulesModelDefinition } from "../../models/rules.model";
import { AdaptionModelDefinition } from "../../models/Adaptations.model";
import { CacheService } from "../cacheService/cache.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Client, ClientsModule, Transport } from "@nestjs/microservices";
import EnvironmentVariables from "../../helpers/envCheck";
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
          imports: [ConfigModule],
          inject: [ConfigService],
          name: "PROCESS_CLIENT",

          useFactory: (
              configService: ConfigService<EnvironmentVariables, true>,
          ) => ({
              transport: Transport.KAFKA,
              options: {
                  subscribe: configService.getOrThrow("KAFKA_TOPIC"),
                  consumer: {
                      groupId: configService.getOrThrow("KAFKA_GROUP_ID"),
                  },
                  client: {
                      brokers: [configService.getOrThrow("KAFKA_BROKER")],
                      clientId: configService.getOrThrow("KAFKA_CLIENT_ID"),
                  },
              },
          }),
      },
  ]),
  
    MongooseModule.forFeature([
      EventModelDefinition,
      RulesModelDefinition,
      AdaptionModelDefinition,
    ]),
  ],
  controllers: [EventController],
  providers: [EventService, CacheService],
})
export class EventModule {}
