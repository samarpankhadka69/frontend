import fetch from "node-fetch";

export async function createMailbox({ url, apiKey, localPart, domain, password }) {
  const body = {
    active: "1",
    domain,
    local_part: localPart,
    name: localPart,
    password,
    quota: 1024,
    force_pw_update: "0",
    sender_acl: [domain]
  };
  const r = await fetch(`${url}/api/v1/add/mailbox`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-API-Key": apiKey },
    body: JSON.stringify(body)
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data?.msg || "mailcow error");
  return data;
}
