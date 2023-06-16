export interface AuthToken {
    accessJwt: string;
    refreshJwt: string;
    handle: string;
    did: string;
}

export const createFirstSession = async (): Promise<boolean> => {
    const decoder = new TextDecoder()
    const kv = spinSdk.kv.openDefault();

    console.log("Loading username and password");
    if (!kv.exists("username") || !kv.exists("password")) {
        console.log("Username and password not found");
        return false;
    }

    const username = decoder.decode(kv.get("username"));
    const password = decoder.decode(kv.get("password"));

    const response = await fetch("https://bsky.social/xrpc/com.atproto.server.createSession", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "identifier": username,
            "password": password,
        })
    })

    console.log(JSON.stringify(response));

    if (response.status !== 200) {
        console.error("Failed to create session");
        return false;
    }

    const authToken = await response.json() as AuthToken;

    kv.set("authToken", JSON.stringify(authToken));

    return true;
}
