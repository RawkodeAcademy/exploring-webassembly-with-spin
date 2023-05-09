const encoder = new TextEncoder()

export async function handleRequest(request) {

    return {
        status: 200,
        headers: { "foo": "bar" },
        body: request.body,
    }
}
