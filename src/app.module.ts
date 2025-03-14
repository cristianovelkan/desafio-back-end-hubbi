import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { EnvConfigModule } from './shared/infrastructure/env-config/env-config.module'
import { ProductsModule } from './products/infrastructure/products.module'
import { DatabaseModule } from './shared/infrastructure/database/database.module'

@Module({
  imports: [EnvConfigModule, ProductsModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
