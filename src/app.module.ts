import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { EnvConfigModule } from './shared/infra/env-config/env-config.module'
import { ProductsModule } from './products/infrastructure/products.module'

@Module({
  imports: [EnvConfigModule, ProductsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
