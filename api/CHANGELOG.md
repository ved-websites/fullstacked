# Changelog

## [0.1.0](https://github.com/ved-websites/fullstacked/compare/api-v0.0.1...api-v0.1.0) (2025-10-17)


### ⚠ BREAKING CHANGES

* switch from graphql to TS-Rest & (custom) TS-WS (merge #72)
* move create / delete users as admin to tsrest

### Features

* add a shared folder to share schemas and other utils ([8d34f4c](https://github.com/ved-websites/fullstacked/commit/8d34f4c0055fc9cf59a13c3228cc0eec2d31c46f))
* add AuthUser param decorator to extract the auth user directly ([67b7678](https://github.com/ved-websites/fullstacked/commit/67b7678a9cb6e5fbed638b986730650c790a10b2))
* add email address changing mechanish ([7a35b5d](https://github.com/ved-websites/fullstacked/commit/7a35b5d5ed38972fcaab3d221e1be4de6e545c99))
* add forgot_password tsrest handling ([cd86661](https://github.com/ved-websites/fullstacked/commit/cd866614ccfec5c7e26dbe5034252e8f632747d5))
* add frontend ts-ws library ([bebbedb](https://github.com/ved-websites/fullstacked/commit/bebbedb7d94a8f96a5dcf70bf15e7a02f6cea88e))
* add health route ([2fa6d76](https://github.com/ved-websites/fullstacked/commit/2fa6d766c53adc66d5901c0a33a6cbf05baabf1c))
* add realtime user edited features ([41141dd](https://github.com/ved-websites/fullstacked/commit/41141dd7322d8752298aa8fe7d679f09362822b7))
* **api:** add throttling to all requests ([41b724f](https://github.com/ved-websites/fullstacked/commit/41b724fc959d50c34b399ca3317a855b3d6798c7))
* change `emitted` to zod schemas ([4ac5e92](https://github.com/ved-websites/fullstacked/commit/4ac5e9245bf2d6fe186724247cf61b5f491200b2))
* configure initial config for Sentry in the backend ([2ece582](https://github.com/ved-websites/fullstacked/commit/2ece582e04ae9c19b62aa8d2cd48c3648dd797ac))
* create custom ts-ws mini-library to backend for ws-events ([4f9f731](https://github.com/ved-websites/fullstacked/commit/4f9f731428c4127b47d0efa440730baccd836ff6))
* first tsrest implementation ([5416b31](https://github.com/ved-websites/fullstacked/commit/5416b313c5a140e216da1aeaca5065493d53d79c))
* i18n handling ([#69](https://github.com/ved-websites/fullstacked/issues/69)) ([650310d](https://github.com/ved-websites/fullstacked/commit/650310d7a39b0169872435628d07dec93b21df05))
* implement password reset flow ([#70](https://github.com/ved-websites/fullstacked/issues/70)) ([ee4ae59](https://github.com/ved-websites/fullstacked/commit/ee4ae59a506ce3c946ec025276fe8014542fa6ff))
* move create / delete users as admin to tsrest ([8646fbc](https://github.com/ved-websites/fullstacked/commit/8646fbc52898e1f144e8acd50eb93fa5d4be3273))
* move settings actions to tsrest ([21b6cef](https://github.com/ved-websites/fullstacked/commit/21b6cef96c72f53cc59fbd7d142d038a14f427ca))
* overhaul init scripts (perf, migrations, cleanup) ([aa6b590](https://github.com/ved-websites/fullstacked/commit/aa6b5903e60d8e503500bd5f7dd1625b25be553b))
* quick and dirty password change in settings page ([c6ceac2](https://github.com/ved-websites/fullstacked/commit/c6ceac2e452fb62808f1bc1ff67042549ec08dbb))
* remove lucia and roll own auth ([0ebe99b](https://github.com/ved-websites/fullstacked/commit/0ebe99b34294dae24b784b74bc1b413cf3b4eee1))
* revamp usr mgmt to see un/registered users and more actions ([2fb1fe5](https://github.com/ved-websites/fullstacked/commit/2fb1fe5e689ef76718acd16a98ebe9f0a4c6ab64))
* rework event system to use custom definition ([dd051ef](https://github.com/ved-websites/fullstacked/commit/dd051ef540689c149081ad234aff23bd7dcb3cb0))
* switch from graphql to TS-Rest & (custom) TS-WS (merge [#72](https://github.com/ved-websites/fullstacked/issues/72)) ([3c75b7f](https://github.com/ved-websites/fullstacked/commit/3c75b7f0b905e99864203d035875671635174ab4))
* track users sessions and methods to check if user is online ([aa2f78b](https://github.com/ved-websites/fullstacked/commit/aa2f78bd8c6bb38bb8d7f1585b64746f1b4282a2))
* tsrest to admins user list and edit, and optimize DX ([29f1f08](https://github.com/ved-websites/fullstacked/commit/29f1f087e0adfd30ccc93f07bae007631a8dc611))
* tweak emailSendSchema to mark default EMAIL_FROM ([c2865a8](https://github.com/ved-websites/fullstacked/commit/c2865a81c104d6f10c813dd4bf946e14a92eb222))
* update i18n-ally configurations to support refactor templates ([edb5b19](https://github.com/ved-websites/fullstacked/commit/edb5b19680315187e2e067e604b15c41d75f588a))
* update lucia to v3 and overhaul user handling ([c70c73b](https://github.com/ved-websites/fullstacked/commit/c70c73b5b6c1a86956995cbc38cee61b6d4783d0))
* update to node 20 ([b32ef46](https://github.com/ved-websites/fullstacked/commit/b32ef466befbc7d6ed7ffdc54dd6f243a1c92ad2))


### Bug Fixes

* add gulp error logging ([91e7bf7](https://github.com/ved-websites/fullstacked/commit/91e7bf746646f7887bc6f1e0aa0aa03f25d7279c))
* allow for cleaner bucket directory ([2aa9369](https://github.com/ved-websites/fullstacked/commit/2aa936949d0ee2541988260da06eaf18501304b3))
* api not sending cookie delete header on logout ([f7842f0](https://github.com/ved-websites/fullstacked/commit/f7842f02d5ce4cf91faabbe1cdc3f8cd6937d7a4))
* api sourceRoot was borked ([2c77144](https://github.com/ved-websites/fullstacked/commit/2c77144ca5a3e868e76665670f30bd2d7d10647e))
* **api:** make PrismaModule global ([c719ef0](https://github.com/ved-websites/fullstacked/commit/c719ef03373dddaed7ae8f14ba45e8c03fb90680))
* **api:** middleware registration order issue ([2cb0f6d](https://github.com/ved-websites/fullstacked/commit/2cb0f6de0099241e3cfdaa407ea4000ef937b624))
* **api:** remove unused storage folder ([ba34825](https://github.com/ved-websites/fullstacked/commit/ba348251d5c5de2850d2e474256e592d61e4c63a))
* critical issue about bigger files crashing server ([c5b6adc](https://github.com/ved-websites/fullstacked/commit/c5b6adc6a101fea059c0583304f7493a37956580))
* delete picture not working ([8146d0f](https://github.com/ved-websites/fullstacked/commit/8146d0f78261b63a1353014e06c8ed150161e92a))
* delete previous profile picture on successful upload ([a037354](https://github.com/ved-websites/fullstacked/commit/a0373545a8e8a1cad879755a2078bdb1dfd5d5f8))
* do not crash when requesting a password reset on invalid email ([3feed6e](https://github.com/ved-websites/fullstacked/commit/3feed6ebda73cbf8ff425958a495db1a76418146))
* do not set the `online` field when session user changes ([c1faccc](https://github.com/ved-websites/fullstacked/commit/c1facccc97fe67aa89f6456d9eddea824fd8a73d))
* fix reconnection on logout issues ([b39203f](https://github.com/ved-websites/fullstacked/commit/b39203f7f428d8d5cdf9beceb0bdb3d5a6f3b733))
* i18n error not handled on serverside ([bf07a30](https://github.com/ved-websites/fullstacked/commit/bf07a30e41f915f72d89a9fdc2575a076e172329))
* login max age was not set properly ([9157b58](https://github.com/ved-websites/fullstacked/commit/9157b58b4755042b08da6884cf35b8766f2baf67))
* make profile picture images publicly accessible ([9bdb17a](https://github.com/ved-websites/fullstacked/commit/9bdb17aae0963e25bc58e2faca719b4113e9dd9b))
* missing setupApp in ensureGraphqlSchema ([4aa7351](https://github.com/ved-websites/fullstacked/commit/4aa7351302f7f371e24aea3ee478f1c8a77aea48))
* missing type import marker ([cb487a6](https://github.com/ved-websites/fullstacked/commit/cb487a64cf0b0e9109bce7430569822d895c8cf2))
* move to singleton PresenceService, use better types ([5b8cb8a](https://github.com/ved-websites/fullstacked/commit/5b8cb8abefed92adadf218d09bea5348c60d0dac))
* move types into own files for client validation ([cbb4ae7](https://github.com/ved-websites/fullstacked/commit/cbb4ae7bbf54087b68d9c913310094a506f4e88c))
* prevent crashing if backend server is down ([abad45a](https://github.com/ved-websites/fullstacked/commit/abad45ab2d9b2e91ca5b04d406de830bb72ddc95))
* proper async i18n resolver definitions ([75dfc04](https://github.com/ved-websites/fullstacked/commit/75dfc044a18ea6ea5819f22716ef09a9bb91b091))
* proper i18n pathing for prod ([a92fe61](https://github.com/ved-websites/fullstacked/commit/a92fe6119318ae86e26562cfe4bd8fe1c1bd8322))
* proper usage of updating lucia key password, fix tests ([84105e6](https://github.com/ved-websites/fullstacked/commit/84105e67b6b6966115db43ebb76b3ae277bd7fa8))
* revamp error management to make it more robust ([8fb9300](https://github.com/ved-websites/fullstacked/commit/8fb930052d6f6fd674709fa2616ab4fd3d6594ca))
* session cookie refresh not using proper max age ([214c585](https://github.com/ved-websites/fullstacked/commit/214c585b49c4bdf66d4c40485177b11a8d763d83))
* set cookies to api domain ([a3a245e](https://github.com/ved-websites/fullstacked/commit/a3a245ea5d007c0a9bddf76a6093151810b44714))
* standardize sentry env for backend ([41d3342](https://github.com/ved-websites/fullstacked/commit/41d33427f5e498fcf8b3ed56e10b7a23c9b257a3))
* subscription not working on page refresh / initial load ([243ae8a](https://github.com/ved-websites/fullstacked/commit/243ae8af44be56b9c7af2abbd1bd959ca23d2b28))
* tests and deploys ([382c3ac](https://github.com/ved-websites/fullstacked/commit/382c3acb762b7d44e4f71291901499a4ce2180c4))
* **throttler:** do not crash on subscriptions ([9d2ae52](https://github.com/ved-websites/fullstacked/commit/9d2ae5243261f238897bb7eec2714ad15d432f5e))
* track attempts createdAt to prevent multiple session hijacking ([d0d6756](https://github.com/ved-websites/fullstacked/commit/d0d67562962f4bb8e3e77ec09256cd8583f9c14a))
* ts-rest type compat ([b64550a](https://github.com/ved-websites/fullstacked/commit/b64550ab93200cf5e314766e8b6dc4df615c2bd8))
* tweak profile picture event to include old & new refs ([bc1aa6a](https://github.com/ved-websites/fullstacked/commit/bc1aa6abedd71755480b8fcead2f92a6db7d609a))
* type not properly defining what is the possible outcome ([9a339ec](https://github.com/ved-websites/fullstacked/commit/9a339ec10ecf32cba22c16b65e3fd8be9e4c793e))
* TypedI18nModule loading order, and make it global ([7a59f3d](https://github.com/ved-websites/fullstacked/commit/7a59f3d47ec25a2af9a932e5895e59ed3ff2eda7))
* update configs for vscode 1.82.0 ([7af0353](https://github.com/ved-websites/fullstacked/commit/7af03539e996340a31a3e7c5593cdfd37ad996b4))
* use adapter in prisma client functions ([362e775](https://github.com/ved-websites/fullstacked/commit/362e775d87f28c046210184fb2646bc2b9be3025))
* use auth endpoint for websocket auth ([c8f5f7f](https://github.com/ved-websites/fullstacked/commit/c8f5f7fa8e7a19908e2edb0fd52553aed49672f8))
* use http polling for houdini schema generation ([9037df8](https://github.com/ved-websites/fullstacked/commit/9037df887ce53bec0ca1ed3604581e3f35ce581a))
* use stores to allow for easy connection status updates ([9a3bd92](https://github.com/ved-websites/fullstacked/commit/9a3bd92193b1cf363d82c48df1e9c3255968c035))
* wrong bash script syntax ([4d9aeeb](https://github.com/ved-websites/fullstacked/commit/4d9aeeb69b6d51a3a42e49ad5c083e182025d311))
* wrong handshake url and api backend ([70d1561](https://github.com/ved-websites/fullstacked/commit/70d156163b154553029a259839dde94a95fb9ffa))
* wrong paths for layouts and partials dirs ([cc9cb2f](https://github.com/ved-websites/fullstacked/commit/cc9cb2f3eb99e4d45a6cd5cef79ce7301ffed8af))


### Performance Improvements

* force strickNullChecks for zod perfs ([488f17f](https://github.com/ved-websites/fullstacked/commit/488f17f589cb2bafd765f1cf368fa3d07bd71372))
* optimize `exists` method by using `count` instead of `findFirst` ([eb7219e](https://github.com/ved-websites/fullstacked/commit/eb7219ea483390690d30107852178b29b95c1262))
* **profile-picture:** do not wait for minio delete promise ([1e3b6f4](https://github.com/ved-websites/fullstacked/commit/1e3b6f433d16f2e79750455df644694197881a64))


### Tweaks

* change task kill to use script PID instead of executable ([1c1ae5b](https://github.com/ved-websites/fullstacked/commit/1c1ae5bce44885e0cfac3993f737a1832b3b2b25))


### Dependencies

* **api:** fix dev deps ([11927b6](https://github.com/ved-websites/fullstacked/commit/11927b62ac4a0d2507e51d79072f03fc1f9a635c))
* **api:** update all deps & fix migration steps ([89b86d0](https://github.com/ved-websites/fullstacked/commit/89b86d05da8681ede6acf3ecb18986ab1855a9a1))
* update all api deps ([5e16ef8](https://github.com/ved-websites/fullstacked/commit/5e16ef8dfa6246559d18a8c0e24f308d685e1770))
* update all deps and fixed migrations issues ([d788bdd](https://github.com/ved-websites/fullstacked/commit/d788bdd23a794866bebea150b2529fc4fc874973))
* update api deps ([8a14470](https://github.com/ved-websites/fullstacked/commit/8a1447002fd21e20cc82935a37437e7cae1f7152))
* update deps unrelated to prisma 5 ([88b5bc4](https://github.com/ved-websites/fullstacked/commit/88b5bc47b17a18275499dc076beed2e462eb49b9))


### Reverts

* "chore: change generate command to include gql" ([224af57](https://github.com/ved-websites/fullstacked/commit/224af57e811801d626d10a2178c9c08cb26fde3e))
