FROM scratch

COPY spin.toml .
COPY hello/target/wasm32-wasi/release/hello.wasm ./hello/target/wasm32-wasi/release/hello.wasm
COPY echo/target/spin-http-js.wasm ./echo/target/spin-http-js.wasm

CMD ["/"]
