import { Injectable } from '@nestjs/common';

@Injectable()
export class CryptoService {
	static readonly DEFAULT_RANDOM_STRING_LENGTH = 15;

	generateId(length = CryptoService.DEFAULT_RANDOM_STRING_LENGTH) {
		return this.generateRandomString(length);
	}

	generateRandomInteger(max: bigint) {
		const inclusiveMaxBitLength = (max - BigInt(1)).toString(2).length;
		const shift = inclusiveMaxBitLength % 8;
		const bytes = new Uint8Array(Math.ceil(inclusiveMaxBitLength / 8));

		try {
			crypto.getRandomValues(bytes);
		} catch (_e) {
			throw new Error('Failed to retrieve random bytes');
		}

		// This zeroes bits that can be ignored to increase the chance `result` < `max`.
		// For example, if `max` can be represented with 10 bits, the leading 6 bits of the random 16 bits (2 bytes) can be ignored.
		if (shift !== 0) {
			bytes[0]! &= (1 << shift) - 1;
		}

		function bigIntFromBytes(bytes: Uint8Array): bigint {
			if (bytes.byteLength < 1) {
				throw new TypeError('Empty Uint8Array');
			}

			let decoded = BigInt(0);

			for (let i = 0; i < bytes.byteLength; i++) {
				decoded += BigInt(bytes[i]!) << BigInt((bytes.byteLength - 1 - i) * 8);
			}

			return decoded;
		}

		let result = bigIntFromBytes(bytes);

		while (result >= max) {
			try {
				crypto.getRandomValues(bytes);
			} catch (_e) {
				throw new Error('Failed to retrieve random bytes');
			}

			if (shift !== 0) {
				bytes[0]! &= (1 << shift) - 1;
			}

			result = bigIntFromBytes(bytes);
		}

		return result;
	}

	generateRandomString(length = CryptoService.DEFAULT_RANDOM_STRING_LENGTH, alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789') {
		let result = '';

		for (let i = 0; i < length; i++) {
			const randomAlphabetIndex = Number(this.generateRandomInteger(BigInt(alphabet.length)));

			result += alphabet[randomAlphabetIndex];
		}

		return result;
	}

	generateRandomSafeString(length = CryptoService.DEFAULT_RANDOM_STRING_LENGTH) {
		// Human readable alphabet lower-upper cased (a-z, 0-9 without l, o, 0, 1 to avoid confusion)
		const alphabet = 'abcdefghijklmnpqrstuvwxyzABCDEFGHIJKLMNPQRSTUVWXYZ23456789';

		return this.generateRandomString(length, alphabet);
	}

	generateSecureRandomString() {
		// Human readable alphabet (a-z, 0-9 without l, o, 0, 1 to avoid confusion)
		const alphabet = 'abcdefghijklmnpqrstuvwxyz23456789';

		// Generate 24 bytes = 192 bits of entropy.
		// We're only going to use 5 bits per byte so the total entropy will be 192 * 5 / 8 = 120 bits
		const bytes = new Uint8Array(24);

		crypto.getRandomValues(bytes);

		let id = '';

		for (const byte of bytes) {
			// >> 3 s"removes" the right-most 3 bits of the byte
			id += alphabet[byte >> 3];
		}

		return id;
	}

	async hashSecret(secret: string) {
		const secretBytes = new TextEncoder().encode(secret);

		const secretHashBuffer = await crypto.subtle.digest('SHA-256', secretBytes);

		return new Uint8Array(secretHashBuffer);
	}

	constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
		if (a.byteLength !== b.byteLength) {
			return false;
		}

		let c = 0;

		for (let i = 0; i < a.byteLength; i++) {
			c |= a[i]! ^ b[i]!;
		}

		return c === 0;
	}
}
