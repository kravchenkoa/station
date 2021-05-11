# station
Where capabilities are born.

**note**: we are now using public superface packages so please update (or delete) your `.npmrc` not to use superface private registry.

Also, check `.npmrc` in "home" directory.

## Install

Install dependencies: 
```
yarn install
```

Build TS files:
```
yarn build
```
set .env variables from .env.example. For publishing you need to set SUPERFACE_STORE_REFRESH_TOKEN you can obtain it on https://superface.dev/auth/github

Repository is not released to NPM so to use it link it locally:
```
yarn link
```

## Commands
  <!-- commands -->
* [`station check`](#station-check)
* [`station compile`](#station-compile)
* [`station create DOCUMENTINFO`](#station-create-documentinfo)
* [`station e2e DOCUMENTINFO MAP`](#station-e2e-documentinfo-map)
* [`station generate PROFILENAME`](#station-generate-profilename)
* [`station publish PATH`](#station-publish-path)

## `station check`

Checks if all profiles have maps with coresponding version, scope, name, usecase definitions and providers

```
USAGE
  $ station check

OPTIONS
  -h, --help   show CLI help
  -q, --quiet  When set to true, disables the shell echo output of action.

EXAMPLES
  $ station check
  $ station check -q
```

_See code: [dist/src/commands/check.ts](https://github.com/superfaceai/station/blob/v0.0.1/dist/src/commands/check.ts)_

## `station compile`

Compiles every profile and map from capabilities directory to superface/grid directory. For now it is safer to use generate command.

```
USAGE
  $ station compile

OPTIONS
  -g, --generate  Generate types for compiled files.
  -h, --help      show CLI help
  -q, --quiet     When set to true, disables the shell echo output of action.

EXAMPLES
  $ station compile
  $ station compile -q
  $ station compile -g
  $ station compile --generate
```

_See code: [dist/src/commands/compile.ts](https://github.com/superfaceai/station/blob/v0.0.1/dist/src/commands/compile.ts)_

## `station create DOCUMENTINFO`

Creates map, profile or provider file with basic template on a local filesystem.

```
USAGE
  $ station create DOCUMENTINFO

ARGUMENTS
  DOCUMENTINFO  Two arguments containing informations about the document.
                1. Document Type - type of document that will be created (profile or map or provider).
                2. Document Name - name of a file that will be created

OPTIONS
  -h, --help   show CLI help
  -q, --quiet  When set to true, disables the shell echo output of action.

EXAMPLES
  $ station create profile sms/service
  $ station create map sms/service twilio
  $ station create profile sms/service -q
  $ station create provider twilio
```

_See code: [dist/src/commands/create.ts](https://github.com/superfaceai/station/blob/v0.0.1/dist/src/commands/create.ts)_

## `station e2e DOCUMENTINFO MAP`

Prepares file structure for e2e testing of specified profile and map

```
USAGE
  $ station e2e DOCUMENTINFO MAP

ARGUMENTS
  DOCUMENTINFO  Profile name in {scope}/{usecase} shape
  MAP           Map name

OPTIONS
  -h, --help   show CLI help
  -q, --quiet  When set to true, disables the shell echo output of action.

EXAMPLES
  $ station e2e sms/service twilio
  $ station e2e sms/service twilio -q
```

_See code: [dist/src/commands/e2e.ts](https://github.com/superfaceai/station/blob/v0.0.1/dist/src/commands/e2e.ts)_

## `station generate PROFILENAME`

Generates .ts files into `superface/types/{scope}` folder, creates or updates `superface/sdk.ts` file and creates or updates `superface/types/{scope}/index.d.ts` file.

```
USAGE
  $ station generate PROFILENAME

ARGUMENTS
  PROFILENAME  Profile name in {scope}/{usecase} shape

OPTIONS
  -h, --help   show CLI help
  -q, --quiet  When set to true, disables the shell echo output of action.

EXAMPLES
  $ station generate sms/service
  $ station generate sms/service -q
```

_See code: [dist/src/commands/generate.ts](https://github.com/superfaceai/station/blob/v0.0.1/dist/src/commands/generate.ts)_

## `station publish PATH`

Uploads map/profile/provider to Store - use paths to `.supr` file for profiles, `.suma` for maps and `.json` for providers. Do not use path ending with `.ast.json` (compiled files).

```
USAGE
  $ station publish PATH

ARGUMENTS
  PATH  Path to profile, map or provider

OPTIONS
  -h, --help        show CLI help
  -p, --production  Publish to production server.
  -q, --quiet       When set to true, disables the shell echo output of action.

EXAMPLES
  $ station publish capabilities/vcs/user-repos/maps/bitbucket.suma
  $ station publish capabilities/vcs/user-repos/maps/bitbucket.suma -p
  $ station publish capabilities/vcs/user-repos/maps/bitbucket.suma -q
```

_See code: [dist/src/commands/publish.ts](https://github.com/superfaceai/station/blob/v0.0.1/dist/src/commands/publish.ts)_
<!-- commandsstop -->

## `yarn test PATH`

Runs test files with suffix `.test.ts`. Running `yarn test` without path will run all test files and will probably fail.

```
USAGE
  $ yarn test PATH

ARGUMENTS
  PATH  Path to test file


EXAMPLES
  $ yarn test capabilities/vcs/user-repos/maps/bitbucket
```

## Adding new capability

First, create new profile:

```
 station create profile {scope}/{usecase}
```
Edit created .supr file

Secondly, create new provider:

```
 station create provider {provider}
```

Edit created .json file

Next, create map for created profile and provider

```
 station create map {scope}/{usecase} {provider}
```

Edit created .suma file and test file (.test.ts)

Compile created files:

```
 station compile
```

Generate types if needed:

```
 station generate {scope}/{usecase}
```

Test created capability:

```
 yarn test {path to test file}
```

Upload newly created files to staging:

```
station publish {path to profile}
station publish {path to map}
station publish {path to provider}
```

Set enviroment to downolad files from staging

```
SUPERFACE_API_URL=https://superface.dev
```

Prepare E2E test file structure:

```
station e2e {scope}/{usecase} {provider}
```

Edit created test file in `/test/e2e` folder and run it.


If it's passing upload files to staging:

```
station publish {path to profile} -p
station publish {path to map} -p
station publish {path to provider} -p
```

Set enviroment to downolad files from production

```
unset SUPERFACE_API_URL
```

Run E2E test file again.

## Enviroment variables

Secretes used for authentication during tests are stored in `.env.capabilities` and loaded using dotenv. Run `cp .env.capabilities.example .env.capabilities` to start from the template.
