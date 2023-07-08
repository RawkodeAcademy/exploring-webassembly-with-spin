FROM scratch

COPY ./spin.toml /
COPY ./echo/target/spin-http-js.wasm /echo/target/spin-http-js.wasm
COPY ./hello/target/wasm32-wasi/release/hello.wasm /hello/target/wasm32-wasi/release/hello.wasm

CMD ["/"]
