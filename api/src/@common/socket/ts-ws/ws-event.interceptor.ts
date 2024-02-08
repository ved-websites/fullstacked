import { SocketService } from '$socket/socket.service';
import type { TypedWebSocket } from '$socket/types';
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, of, switchMap } from 'rxjs';
import { ZodError } from 'zod';
import { EventRoute, EventRouteInput, EventRouteOutput, RouteEventHandler } from '~contract';
import { EVENT_ROUTE_METADATA_KEY } from './ws-event.decorator';
import { WsEventEmitter } from './ws-event.emitter';

@Injectable()
export class WsEventInterceptor implements NestInterceptor {
	private readonly logger = new Logger(WsEventInterceptor.name);

	constructor(
		private readonly reflector: Reflector,
		private readonly socketService: SocketService,
		private readonly wsEventEmitter: WsEventEmitter,
	) {}

	intercept(context: ExecutionContext, next: CallHandler) {
		const wsContext = context.switchToWs();

		const pattern = wsContext.getPattern();

		if (pattern === 'ping') {
			return of();
		}

		const socket = wsContext.getClient<TypedWebSocket>();
		const wsData = wsContext.getData<EventRouteInput>();

		if (!('type' in wsData)) {
			this.socketService.sendError(socket, 'Missing request type!');

			return of();
		}

		const { type, uid } = wsData;

		const unsubPattern = `unsub:${socket.session!.id}:${pattern}${uid ? `:${uid}` : ''}`;

		if (type === 'unsubscribe') {
			this.wsEventEmitter.emit(unsubPattern);

			return of();
		}

		const eventRoute = this.reflector.get<EventRoute>(EVENT_ROUTE_METADATA_KEY, context.getHandler());

		let input: ReturnType<NonNullable<(typeof eventRoute)['input']>['parse']> | undefined;

		try {
			input = eventRoute.input?.parse(wsData.input);
		} catch (error) {
			if (error instanceof ZodError) {
				this.socketService.sendError(socket, {
					message: 'Wrong input data!', // TODO : Translate this
					errors: error.errors,
				});
			} else {
				this.logger.error('Error other than expected ZodError happened...', error instanceof Error ? error.stack : undefined);
			}

			return of();
		}

		const flushPattern = this.socketService.createFlushPattern(socket);

		return next.handle().pipe(
			switchMap((impl: RouteEventHandler | undefined) => {
				return new Observable<EventRouteOutput<unknown>>((observer) => {
					const listener = async (emittedData: unknown) => {
						const getFormattedValue = async () => {
							const parseOutput = await eventRoute.emitted.safeParseAsync(emittedData);

							if (!parseOutput.success) {
								this.logger.error(
									`Wrong value passed to emitted data structure of pattern "${pattern}", what's that about?`,
									parseOutput.error,
								);
								return;
							}

							const formattedData = this.socketService.formatData(parseOutput.data, uid, eventRoute.type);

							if (impl && typeof impl === 'function') {
								try {
									const partialImplOutput = await impl({
										socket,
										uid,
										input,
										data: emittedData as object,
									});

									if (!partialImplOutput) {
										return;
									}

									return {
										...formattedData,
										...partialImplOutput,
									};
								} catch (error) {
									// Do not handle badly written backend code.
									this.logger.error(
										`The implementation of 'handleWsEvent' in provided stack errored out!`,
										error instanceof Error ? error.stack : undefined,
									);
								}

								return;
							}

							return formattedData;
						};

						const value = await getFormattedValue();

						if (!value) {
							return;
						}

						observer.next(value);
					};

					this.wsEventEmitter.on(pattern, listener);

					const finishSub = () => {
						socket.off('close', finishSub);

						this.wsEventEmitter.off(pattern, listener);
						this.wsEventEmitter.off(unsubPattern, finishSub);
						if (flushPattern) {
							this.wsEventEmitter.off(flushPattern, finishSub);
						}

						observer.complete();

						this.logger.debug(`User unsubbed from pattern '${pattern}' : ${socket.user?.email}`);
					};

					socket.on('close', finishSub);

					this.wsEventEmitter.on(unsubPattern, finishSub);
					if (flushPattern) {
						this.wsEventEmitter.on(flushPattern, finishSub);
					}
				});
			}),
		);
	}
}
