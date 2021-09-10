import { CLIError } from '@oclif/errors';
import {
  createMap,
  createProfile,
  createProviderJson,
} from '@superfaceai/cli/dist/logic/create';
import { SuperJson } from '@superfaceai/one-sdk';
import { grey } from 'chalk';

import { Command } from '../common';
import { CAPABILITIES_DIR, SUPER_JSON } from '../common/constants';

export default class Create extends Command {
  static strict = false;

  static description =
    'Creates map, profile or provider file with basic template on a local filesystem.';

  static args = [
    {
      name: 'documentInfo',
      required: true,
      description:
        'Two arguments containing informations about the document.\n1. Document Type - type of document that will be created (profile or map or provider).\n2. Document Name - name of a file that will be created',
    },
  ];

  static flags = {
    ...Command.flags,
  };

  static examples = [
    '$ station create profile sms/service',
    '$ station create map sms/service twilio',
    '$ station create profile sms/service -q',
    '$ station create provider twilio',
  ];

  private logCallback? = (message: string) => this.log(grey(message));

  async run(): Promise<void> {
    const { argv, flags } = this.parse(Create);

    if (flags.quiet) {
      this.logCallback = undefined;
    }

    if (argv.length < 2) {
      throw new CLIError('Invalid number of arguments', { exit: 1 });
    }

    const loadedResult = await SuperJson.load(SUPER_JSON);
    const superJson = loadedResult.unwrap();

    const type = argv[0];
    if (type === 'profile') {
      const documentName = argv[1] ?? argv[0];
      const [scope, name] = documentName.split('/');

      await createProfile(
        CAPABILITIES_DIR,
        { scope, name, version: { major: 1 } },
        [name],
        superJson,
        { logCb: this.logCallback }
      );

      // Create map for mock provider
      await createMap(
        CAPABILITIES_DIR,
        {
          scope,
          name,
          provider: 'mock',
          version: { major: 1 },
        },
        [name],
        superJson,
        { logCb: this.logCallback }
      );
    } else if (type === 'map') {
      const provider = argv[2];
      const documentName = argv[1] ?? argv[0];
      const [scope, name] = documentName.split('/');
      if (!provider) {
        throw new CLIError('Missing provider name argument', { exit: 1 });
      }
      await createMap(
        CAPABILITIES_DIR,
        {
          scope,
          name,
          provider,
          version: { major: 1 },
        },
        [name],
        superJson,
        { logCb: this.logCallback }
      );
    } else if (type === 'provider') {
      const provider = argv[1];
      await createProviderJson(CAPABILITIES_DIR, provider, superJson, {
        logCb: this.logCallback,
      });
    }
  }
}
