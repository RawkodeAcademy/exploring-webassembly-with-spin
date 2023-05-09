import { HandleRequest, HttpRequest, HttpResponse } from "@fermyon/spin-sdk";

const encoder = new TextEncoder();
const router = utils.Router();

router.get("/", (req) => {
	return {
		status: 200,
		body: encoder.encode(`Hello, Spin! Handling route ${req.url}`).buffer,
	};
});

router.get("/goodbye", ({ params }): HttpResponse => {
	return {
		status: 200,
		body: encoder.encode("Goodbye").buffer,
	};
});

// handleRequest is the entrypoint to the Spin handler.
export const handleRequest: HandleRequest = async function (
	request: HttpRequest,
): Promise<HttpResponse> {
	return await router.handleRequest(request);
};
