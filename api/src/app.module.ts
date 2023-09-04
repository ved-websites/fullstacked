import { Module, type ModuleMetadata } from '@nestjs/common';
import { BaseModules } from './@common/app/app.helpers';
import { MessageModule } from './message/message.module';

const AppImports = [MessageModule] satisfies ModuleMetadata['imports'];

@Module({
	imports: [...BaseModules, ...AppImports],
})
export class AppModule {}
