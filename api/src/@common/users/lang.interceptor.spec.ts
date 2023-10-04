import { describe, expect, it } from 'vitest';
import { LangInterceptor } from './lang.interceptor';

describe('LangInterceptor', () => {
	it('should be defined', () => {
		expect(new LangInterceptor()).toBeDefined();
	});
});
