import { HandleRequest, HttpRequest, HttpResponse } from "@fermyon/spin-sdk"
import { AuthToken, createFirstSession } from "./createSession";

const encoder = new TextEncoder()
const decoder = new TextDecoder()

interface BlueSkyRequest {
  link: string;
}

export const handleRequest: HandleRequest = async function (request: HttpRequest): Promise<HttpResponse> {
  if (request.method === "OPTIONS") {
    return {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST,OPTIONS",
      },
    }
  }

  const kv = spinSdk.kv.openDefault();

  let credentials: AuthToken;

  console.log("Checking for auth token");
  if (!kv.exists("authToken")) {
    console.log("Doesn't exist. Let's login ...");
    if (false === await createFirstSession()) {
      console.log("Login failed");
      return {
        status: 500,
        body: encoder.encode("Failed to create session").buffer
      }
    }
  }

  const authToken = JSON.parse(decoder.decode(kv.get("authToken"))) as AuthToken;

  const blueSkyRequest = request.json() as BlueSkyRequest;

  if (blueSkyRequest.link === undefined) {
    return {
      status: 400,
      body: encoder.encode("Bad Request").buffer
    }
  }
  // https://staging.bsky.app/profile/rawkode.dev/post/3jxg5urlkmd2s
  const handle = blueSkyRequest.link.split("/")[4];
  const post = blueSkyRequest.link.split("/")[6];

  console.log(`Got handle: ${handle}`);
  console.log(`Got post: ${post}`);

  const blueSkyProfile = (await (await fetch("https://bsky.social/xrpc/com.atproto.identity.resolveHandle?handle=" + handle, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + authToken.accessJwt,
    }
  })).json()) as { did: string };



  const blueSkyPost = (await (await fetch(`https://bsky.social/xrpc/app.bsky.feed.getPostThread?uri=at://${blueSkyProfile.did}/app.bsky.feed.post/${post}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + authToken.accessJwt,
    },
  })).json()) as { thread: { post: { author: { avatar: string, displayName: string, handle: string }, record: { text: string } } } };

  console.log(`Got post: ${blueSkyPost.thread.post.record.text}`);

  console.log("Returning 200");

  return {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: encoder.encode(JSON.stringify(blueSkyPost)).buffer
  }
}
