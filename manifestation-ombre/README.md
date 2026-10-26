# La Manifestation de l'Ombre

A virtual map of the Champs-Élysées. Each person who signs up to support the shopkeepers (and to say no to looting and rioters) adds a red dot to the avenue. The dot appears live for every visitor.

## Run it locally

```bash
cd manifestation-ombre
npm start          # http://localhost:3000
```

There are no dependencies to install. Node 18 or later is enough.

## Put it online

Any host that runs Node will work: Render, Railway, Fly.io, a VPS, and so on.

- **Start command:** `npm start`, run from the `manifestation-ombre` folder.
- **Persistent disk:** sign-ups are saved to `data/soutiens.json`. On a host whose disk is wiped on every redeploy (for example, the free tier on Render), mount a persistent disk and set `DATA_DIR` to that folder. Otherwise the dots disappear.

| Variable | Purpose |
| --- | --- |
| `PORT` | Listening port (provided by the host) |
| `DATA_DIR` | Folder where sign-ups are stored |
| `ADMIN_TOKEN` | Secret token that lets you remove an inappropriate sign-up |

## Moderation

To remove a sign-up, get its `id` from `GET /api/soutiens`, then run:

```bash
curl -X DELETE https://your-site/api/soutiens/<id> \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

The dot disappears live for everyone.

## Protections in place

- Only a first name or nickname is collected. The city and message are optional. No email is collected, and IP addresses are never written to disk.
- Each connection is limited to 5 sign-ups per hour.
- A hidden trap field filters out bots.
- Text length is capped and HTML is stripped from inputs.
