import { AuthModule } from '$users/auth/auth.module';
import { LuciaModule } from '$users/auth/lucia/lucia.module';
import { RolesModule } from '$users/auth/roles/roles.module';
import { Global, Module } from '@nestjs/common';
import { MainGateway } from './main.gateway';
import { SocketService } from './socket.service';
import { WsEventEmitter } from './ts-ws/ws-event.emitter';

const socketDeps = [AuthModule, RolesModule] as const;

@Global()
@Module({
	imports: [LuciaModule, ...socketDeps],
	providers: [WsEventEmitter, SocketService, MainGateway],
	exports: [WsEventEmitter, SocketService, ...socketDeps],
})
export class SocketModule {}
