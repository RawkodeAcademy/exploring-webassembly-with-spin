// import { connect } from "@planetscale/database";
import type {
	HandleRequest,
	HttpRequest,
	HttpResponse,
} from "@fermyon/spin-sdk";

const encoder = new TextEncoder();

export const handleRequest: HandleRequest = async (
	request: HttpRequest,
): Promise<HttpResponse> => {
	const url = new URL(request.uri);
	const hostname = url.hostname;
	const path = url.pathname;

	// const conn = await connect(config);
	// const results = await conn.execute('select 1 from dual where 1=?', [1])

	console.log(`Hello ${hostname} and ${path}`);

	return {
		status: 200,
		headers: { foo: "bar" },
		body: encoder.encode("Hello from JS-SDK").buffer,
	};
};
