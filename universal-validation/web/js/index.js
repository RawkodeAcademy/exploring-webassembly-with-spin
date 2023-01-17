const a = import("../../wasm/pkg").catch(console.error);
a.then((m) => m.validate_password("password"));
