# fake-hydro

Now you can put

```sh
HYDRO_ENDPOINT=http://localhost:7777/hydro/api/v1/events
HYDRO_SECRET=blablablablabla
```

in your `.env` and Hydro sending will be enabled locally, but writes
to the `db.json` file.

Start it with:

```sh
npm install
npm run start
```

If you want to test the authorization start it like this:

```sh
HYDRO_SECRET=blablablablabla npm run start
```

You can also set a "highlight". It prints out the parsed event JSON in full
if it's a match. For example:

```sh
npm run start -- exitevent experimentevent
```

or

```sh
HIGHLIGHT=Experiment npm run start
```

These will look at the `event.schema` and compare if the highlight(s)
match (case insensitive and partial).
