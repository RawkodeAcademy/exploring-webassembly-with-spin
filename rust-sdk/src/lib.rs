use anyhow::Result;
use spin_sdk::{
    http::{Request, Response},
    http_component,
};

/// A simple Spin HTTP component.
#[http_component]
fn hello_world(req: Request) -> Result<Response> {
    spin_sdk::http::send(
        http::Request::builder()
            .method("GET")
            .uri("https://github.com")
            .body(None)?,
    )
    .map_err(Into::into)
}
