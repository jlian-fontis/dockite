# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.3.0](https://github.com/dockite/dockite/compare/@dockite/core@0.2.2...@dockite/core@0.3.0) (2020-06-25)


### Features

* **core,admin:** add schema imports ([1d94bc8](https://github.com/dockite/dockite/commit/1d94bc8eacfb6c28d5ddf000dd6f9a9b5bbd4456))





## [0.2.2](https://github.com/dockite/dockite/compare/@dockite/core@0.2.1...@dockite/core@0.2.2) (2020-06-24)


### Bug Fixes

* split dockite entrypoints ([a5ef207](https://github.com/dockite/dockite/commit/a5ef207f11934b9cde8ad0df03a17ad5072b54a3))





## [0.2.1](https://github.com/dockite/dockite/compare/@dockite/core@0.2.0...@dockite/core@0.2.1) (2020-06-24)


### Bug Fixes

* split dockite entrypoints ([3fa30c7](https://github.com/dockite/dockite/commit/3fa30c7dfb1da1bef2a4265180aab371b32e32ee))





# 0.2.0 (2020-06-24)


### Bug Fixes

* **core:** ensure entities use GraphQLField alias ([236b58f](https://github.com/dockite/dockite/commit/236b58f3e09991fcee92d7e87614ac7f80af1d54))
* **core:** maintain stable ordering of field groups ([012a601](https://github.com/dockite/dockite/commit/012a601052a867fe4532dba3da1ebccdc5d6ed2b))
* **core:** resolve broken webhooks ([d10677c](https://github.com/dockite/dockite/commit/d10677cb30b3864eb9fb8ec89c7c1d92ace49954))
* **core:** sign jwts correctly ([29c7f32](https://github.com/dockite/dockite/commit/29c7f32f124f4fd2efa70838d442c3f12a665314))
* **core:** simplify root graphql module ([897f87f](https://github.com/dockite/dockite/commit/897f87f0687b1c30049cf7e79827fba0c73517a2))
* **core:** update entities and resolvers for nullable fields ([f4ef9ff](https://github.com/dockite/dockite/commit/f4ef9ff98ab4e3a0e6531795962e06129fd0d1ea))
* **core:** update entities to use base interfaces ([c077ca0](https://github.com/dockite/dockite/commit/c077ca02624de99402349fe9b182d7d104ffa91a))
* **core:** update webhooks to fire and forget ([e8f3ad5](https://github.com/dockite/dockite/commit/e8f3ad51ce84c401d858f5d65086d29120c83557))
* **core:** webhook and webhook calls incorrectly order ([4809033](https://github.com/dockite/dockite/commit/4809033e08645ebea88f773afffbb8e425fb24cd))
* add example .env file ([a5c4204](https://github.com/dockite/dockite/commit/a5c420499e816d2e9d5e7fd430085989d4c9e3c7))
* add linting on commit and make lerna use yarn ([663d53a](https://github.com/dockite/dockite/commit/663d53a6a576ea09fa93a2ad238d1ef80b557f10))
* configure husky and eslint ([0b86401](https://github.com/dockite/dockite/commit/0b86401a255fc55f1a051eebde8bf014f9dd7d23))
* **eslint:** change no-unused-vars to error ([e4af8cc](https://github.com/dockite/dockite/commit/e4af8ccf5349831cae6ec787fb243f4ae2ecf2f0))
* clean package.json and add bcrypt ([3366ef1](https://github.com/dockite/dockite/commit/3366ef168d5a462307d35adb4eaf51928fbe21bb))
* load config during app intialization ([b87bd0a](https://github.com/dockite/dockite/commit/b87bd0af88794f05fdf86940e85155a6e1401845))


### Features

* add authorization ([27b69af](https://github.com/dockite/dockite/commit/27b69afa2e15cc246cea082be245db17be453a78))
* token refreshing ([01245b9](https://github.com/dockite/dockite/commit/01245b9a52a2607e9a21e2cc98ac04824fe31878))
* **core:** add base fields manager ([85e8be3](https://github.com/dockite/dockite/commit/85e8be3c51009f8e3be95e4a6154282cf1e52d5c))
* **core:** add field registration on startup ([ca5ed02](https://github.com/dockite/dockite/commit/ca5ed02e22cb9a9699e5cae89d8d9a8fb588f1d0))
* **core:** add fields to config and set default config values ([8ae4f8c](https://github.com/dockite/dockite/commit/8ae4f8cd93d0f25c71d74f8f6cc166ac9fa55427))
* **core:** add generated graphql schemas ([5b242d1](https://github.com/dockite/dockite/commit/5b242d103520f75941857179c0d6fa89e1145450))
* **core:** add remaining internal resolvers ([c912772](https://github.com/dockite/dockite/commit/c9127725202f115e2108b8fb2505320b7a71abb3))
* **core:** create base document resolver ([75c93ae](https://github.com/dockite/dockite/commit/75c93ae0ff4887c2961c0f000495e7afa173af6a))
* **core:** create base resolvers for schema and webhooks ([3eb552c](https://github.com/dockite/dockite/commit/3eb552c34fc47531c053439b384394323744aaf4))
* **core:** create base webhook-call resolver ([2f0cb90](https://github.com/dockite/dockite/commit/2f0cb9052eaaf9f95103acf5d3bce1f36011a307))
* **core:** create remaining base resolvers and fix runtime errors ([390800b](https://github.com/dockite/dockite/commit/390800b1f6273e715834daef902c72e8ea5bc316))
* **core:** separate graphql schemas ([47c8e4b](https://github.com/dockite/dockite/commit/47c8e4bd6c30460d8d5f3c59311fee39f122a299))
* **core,admin:** add document full text search ([0ba2591](https://github.com/dockite/dockite/commit/0ba2591a1844206001db64d63a356d9d7a7085ed))
* **core,admin:** pagination on search results ([55cf141](https://github.com/dockite/dockite/commit/55cf1410d19b635ba6184d22f5fb92d40fda739e))
* **field-group:** add group field ([5f05dfd](https://github.com/dockite/dockite/commit/5f05dfda7a00a5193d4cdd322b929d3cd27d95ac))
* add auth-checker and refactor common files ([d176cec](https://github.com/dockite/dockite/commit/d176cec16a4ddc56b5c276e7fc05f8caeabd4105))
* add config loading, common types and util methods ([929f2dc](https://github.com/dockite/dockite/commit/929f2dc964e9ec58c09d2a01251ef1c0d4041213))
* add loading of external entities from a config file ([a58cf93](https://github.com/dockite/dockite/commit/a58cf938bd4c889f2a4cb28c45d92358bcc3044d))
* add logging and global app context ([9233875](https://github.com/dockite/dockite/commit/92338754b4f7acaef5923ab5026f550d6b65a9e9))
* add typeorm connection for model migrations ([29cee7b](https://github.com/dockite/dockite/commit/29cee7bd54b5dc9d8818fc13bbf3d36e1616854a))
* create authentication module and fix package.json dependencies ([3f31359](https://github.com/dockite/dockite/commit/3f31359a4ca018e987c9967a2e97107a96367a91))
* create base entities ([7f46399](https://github.com/dockite/dockite/commit/7f46399e80d61f82f7640326a48a4da130b5e9df))
* create initial release-bot ([264bf78](https://github.com/dockite/dockite/commit/264bf78f86e37fc446a4cc7c8649ea47fff97122))
* create module system ([10f2276](https://github.com/dockite/dockite/commit/10f2276e60fd3fd7906b7c259291ec885684e3b6))
* end of april merge  ([#7](https://github.com/dockite/dockite/issues/7)) ([0b4f8a8](https://github.com/dockite/dockite/commit/0b4f8a8ebd6da6118eee6e219817d7c85d611200))
* end of march merge ([add6386](https://github.com/dockite/dockite/commit/add6386a91a2e7368ae8b5b623eb48a74e2e3312))
* improve pagination in resolvers by introducing a many result type ([#10](https://github.com/dockite/dockite/issues/10)) ([8d9dbb1](https://github.com/dockite/dockite/commit/8d9dbb1663d97fe4cb533f9d0b2d06cb247c2654))
* initial commit ([66cd987](https://github.com/dockite/dockite/commit/66cd987a62a027a77da785b144618fadf8e271e8))
* overhaul of external graphql module ([2c52fbe](https://github.com/dockite/dockite/commit/2c52fbee7bd2c290059dd5a3e77b4ad15c47f535))
* overhaul of internal graphql module ([a72f498](https://github.com/dockite/dockite/commit/a72f498d68d6b66f73a3e2f8a89df3afccc9da94))
* refactor ui ([50054f9](https://github.com/dockite/dockite/commit/50054f980c990822e7e6ceffe05d0799f2e5dcd5)), closes [#15](https://github.com/dockite/dockite/issues/15)
* **transformer:** implement base transformer ([4a40531](https://github.com/dockite/dockite/commit/4a40531f7e7af06a40fcb6589298c152bc2e821e))