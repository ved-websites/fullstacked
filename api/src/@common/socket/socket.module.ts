import { AuthModule } from '$users/auth/auth.module';
import { RolesModule } from '$users/auth/roles/roles.module';
import { PresenceModule } from '$users/presence/presence.module';
import { Global, Module } from '@nestjs/common';
import { MainGateway } from './main.gateway';
import { SocketController } from './socket.controller';
import { SocketService } from './socket.service';
import { WsEventEmitter } from './ts-ws/ws-event.emitter';

const socketDeps = [AuthModule, RolesModule] as const;

@Global()
@Module({
	imports: [PresenceModule, ...socketDeps],
	providers: [WsEventEmitter, SocketService, MainGateway],
	exports: [WsEventEmitter, SocketService, ...socketDeps],
	controllers: [SocketController],
})
export class SocketModule {}
