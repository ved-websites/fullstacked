declare module 'gulp-prompt' {
	type PromptQuestionBase<Type extends 'input' | 'password' | 'checkbox', Name extends string> = {
		type: Type;
		name: Name;
		message?: string;
		templateOptions?: Record<string, string>;
		validate?: (value: string) => boolean;
	};

	type PromptQuestionInput<Name extends string> = PromptQuestionBase<'input', Name>;
	type PromptQuestionPassword<Name extends string> = PromptQuestionBase<'password', Name>;
	type PromptQuestionCheckbox<Name extends string> = PromptQuestionBase<'checkbox', Name> & {
		choices: string[];
		pageSize?: number;
	};

	type PromptQuestion<Name extends string> = PromptQuestionInput<Name> | PromptQuestionPassword<Name> | PromptQuestionCheckbox<Name>;

	type PromptCallback<Name extends string, Type = string> = (res: { [key in Name]: Type }) => void;

	export function prompt<Name extends string>(questions: PromptQuestion<Name> | PromptQuestion<Name>[], cb?: PromptCallback<Name>);

	type ConfirmOptions = {
		message: string;
		default?: boolean;
	};

	export function confirm(options?: string | ConfirmOptions);
}
