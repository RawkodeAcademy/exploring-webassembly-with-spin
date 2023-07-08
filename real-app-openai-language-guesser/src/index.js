const encoder = new TextEncoder("utf-8");

export async function handleRequest(request) {
  const apiKey = spinSdk.config.get("openai_token");

  const queryString = await request.text();
  const formData = new URLSearchParams(queryString);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `What language is this? '${formData.get("text")}'`,
        },
      ],
      temperature: 0.7,
    }),
  });

  const data = await response.json();

  return {
    status: 200,
    body: encoder.encode(data.choices[0].message.content).buffer,
  };
}
