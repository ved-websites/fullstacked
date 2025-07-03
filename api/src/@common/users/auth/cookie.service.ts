import { Injectable } from '@nestjs/common';
import { CookieOptions } from 'express';
import { Environment, EnvironmentConfig } from '~env';

export function serializeCookie(name: string, value: string, options?: CookieOptions): string {
	const keyValueEntries: Array<[string, string] | [string]> = [];

	keyValueEntries.push([encodeURIComponent(name), encodeURIComponent(value)]);

	if (options?.domain !== undefined) {
		keyValueEntries.push(['Domain', options.domain]);
	}

	if (options?.expires !== undefined) {
		keyValueEntries.push(['Expires', options.expires.toUTCString()]);
	}

	if (options?.httpOnly) {
		keyValueEntries.push(['HttpOnly']);
	}

	if (options?.maxAge !== undefined) {
		keyValueEntries.push(['Max-Age', options.maxAge.toString()]);
	}

	if (options?.path !== undefined) {
		keyValueEntries.push(['Path', options.path]);
	}

	if (options?.sameSite === 'lax') {
		keyValueEntries.push(['SameSite', 'lax']);
	}

	if (options?.sameSite === 'none') {
		keyValueEntries.push(['SameSite', 'None']);
	}

	if (options?.sameSite === 'strict') {
		keyValueEntries.push(['SameSite', 'Strict']);
	}

	if (options?.secure) {
		keyValueEntries.push(['Secure']);
	}

	return keyValueEntries.map((pair) => pair.join('=')).join('; ');
}

@Injectable()
export class CookieService {
	constructor(private readonly env: EnvironmentConfig) {}

	createCookie(cookieName: string, value: string, options?: CookieOptions): Cookie {
		return new Cookie(cookieName, value, { secure: this.env.NODE_ENV === Environment.Production, ...options });
	}

	createBlankCookie(cookieName: string, options?: CookieOptions): Cookie {
		return new Cookie(cookieName, '', {
			maxAge: 0,
			secure: this.env.NODE_ENV === Environment.Production,
			...options,
		});
	}

	parseCookie(header: string, cookieName: string): string | null {
		const cookies = this.parseCookies(header);

		return cookies.get(cookieName) ?? null;
	}

	parseCookies(header: string): Map<string, string> {
		const cookies = new Map<string, string>();
		const items = header.split('; ');

		for (const item of items) {
			const pair = item.split('=');
			const rawKey = pair[0];
			const rawValue = pair[1] ?? '';

			if (!rawKey) continue;

			cookies.set(decodeURIComponent(rawKey), decodeURIComponent(rawValue));
		}

		return cookies;
	}
}

export class Cookie {
	constructor(name: string, value: string, options?: CookieOptions) {
		this.name = name;
		this.value = value;
		this.options = this.baseCookieOptions(options);
	}

	public name: string;
	public value: string;
	public options: CookieOptions;

	protected baseCookieOptions(options?: CookieOptions): CookieOptions {
		return {
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			path: '/',
			...options,
		};
	}

	public serialize(): string {
		return serializeCookie(this.name, this.value, this.baseCookieOptions(this.options));
	}
}
