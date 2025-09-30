export function rune<T>(value: T): { value: T } {
	let val = $state(value);

	return {
		get value() {
			return val;
		},
		set value(newValue: T) {
			val = newValue;
		},
	};
}
