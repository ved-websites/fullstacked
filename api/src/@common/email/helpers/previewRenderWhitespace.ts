export function previewRenderWhitespace(text: string) {
	const whiteSpaceCodes = '\xa0\u200C\u200B\u200D\u200E\u200F\uFEFF';
	const maxPreviewLength = 150;

	return whiteSpaceCodes.repeat(Math.max(0, maxPreviewLength - text.length));
}
