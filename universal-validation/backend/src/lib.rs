use anyhow::Result;
use bytes::Bytes;
use domain::validate_password;
use spin_sdk::{
    http::{Request, Response},
    http_component,
};

#[http_component]
fn backend(req: Request) -> Result<Response> {
    let default_bytes = Bytes::new();
    let password = String::from_utf8(
        req.body()
            .as_ref()
            .unwrap_or_else(|| &default_bytes)
            .to_vec(),
    )
    .unwrap_or_else(|_| "".to_string());

    match validate_password(password) {
        Ok(_) => Ok(http::Response::builder()
            .status(200)
            .body(Some("Passed".into()))?),
        Err(error) => Ok(http::Response::builder()
            .status(401)
            .body(Some(error.into()))?),
    }
}
