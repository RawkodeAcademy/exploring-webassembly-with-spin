from spin_http import Response, Request


def handle_request(request: Request):
    all_headers = dict(request.headers)

    return Response(200,
                    [("content-type", "application/json")],
                    bytes(f'Hello, {all_headers["x-name"]}', "utf-8"))
