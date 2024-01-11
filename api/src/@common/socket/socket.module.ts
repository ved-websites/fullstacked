import { LuciaModule } from '$users/auth/lucia/lucia.module';
import { Global, Module } from '@nestjs/common';
import { MainGateway } from './main.gateway';
import { SocketService } from './socket.service';
import { socketDependencies } from './ts-ws/ws-event.decorator';
import { WsEventEmitter } from './ts-ws/ws-event.emitter';

const socketModules = socketDependencies.map((dep) => dep.module);

@Global()
@Module({
	imports: [LuciaModule, ...socketModules],
	providers: [WsEventEmitter, SocketService, MainGateway],
	exports: [WsEventEmitter, SocketService, ...socketModules],
})
export class SocketModule {}
