use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() -> Result<(), JsValue> {
    // Use `web_sys`'s global `window` function to get a handle on the global
    // window object.
    let window = web_sys::window().expect("no global `window` exists");
    let document = window.document().expect("should have a document on window");
    let body = document.body().expect("document should have a body");

    // Manufacture the element we're gonna append
    let val = document.create_element("p")?;
    val.set_inner_html("Hello in your browser!");

    body.append_child(&val)?;

    Ok(())
}

#[wasm_bindgen]
pub fn validate_password(password: String) -> Result<(), JsValue> {
    return domain::validate_password(password).map_err(|e| JsValue::from_str(&e));
}
