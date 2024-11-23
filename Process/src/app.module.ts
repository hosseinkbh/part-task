import {Module} from "@nestjs/common";
import {ConfigModule, ConfigService} from "@nestjs/config";
import EnvironmentVariables from "./helpers/envCheck";
import {MongooseModule} from "@nestjs/mongoose";
import {EventModule} from "./modules/Event/event.module";
import {RulesModule} from "./modules/Roles/rules.module";

@Module({
    imports: [
        MongooseModule.forRootAsync({
            inject: [ConfigService],
            imports: [ConfigModule],
            useFactory: (
                configService: ConfigService<EnvironmentVariables, true>,
            ) => ({
                uri: configService.getOrThrow("MONGODB_URI"),
                connectionFactory(connection) {
                    connection.on("connected", () =>
                        console.log("MongoDb is connected successfully"),
                    );
                    connection._events.connected();
                    return connection;
                },
            }),
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            validate: EnvironmentVariables.validate,
        }),
        EventModule,
        RulesModule,
    ],
})
export class AppModule {
}
