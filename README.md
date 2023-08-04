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
