import { HandleRequest, HttpRequest, HttpResponse } from "@fermyon/spin-sdk";

const encoder = new TextEncoder();

export const handleRequest: HandleRequest = async function (
	request: HttpRequest,
): Promise<HttpResponse> {
	const response = await fetch("https://google.com");
	const responseBody = await response.text();

	console.log(responseBody);

	return {
		status: 200,
		headers: {},
		body: encoder.encode("").buffer,
	};
};
