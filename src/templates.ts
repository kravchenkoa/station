import { kebabToCamelCase } from './utils';

export function exportTypeTemplate(
  usecase: string,
): string {
  return `export * from './${usecase}'\n`
}
export function profileTemplate(
  usecase: string,
  scope?: string,
  version = '1.0'
): string {
  const name: string = scope ? `${scope}/${usecase}` : `/${usecase}`;

  return `name = "${name}"\nversion = "${version}"\n\n"""\n${usecase} usecase\n"""\nusecase ${kebabToCamelCase(
    usecase
  )} {}`;
}
export function providerTemplate(name: string): string {
  const provider = {
    name,
    services: [
      {
        id: 'default',
        baseUrl: 'noop.localhost',
      },
    ],
    defaultService: 'default',
  };

  return JSON.stringify(provider, null, 2);
}

export function mapTemplate(
  scope: string,
  usecase: string,
  provider: string,
  version = '1.0',
  variant?: string
): string {
  const variantAssignment = variant ? `variant = "${variant}"\n` : '';

  return `profile = "${scope}/${usecase}@${version}"
provider = "${provider}"
${variantAssignment}
map ${kebabToCamelCase(usecase)}{}
`;
}

export function mapTestTemplate(
  scope: string,
  usecase: string,
  provider: string
): string {
  return `
import { SuperfaceClient } from '@superfaceai/one-sdk';

describe('${scope}/${usecase}/${provider}', () => {
  it('performs correctly', async () => {
    const client = new SuperfaceClient();
    const profile = await client.getProfile('${scope}/${usecase}');
    const useCase = profile.getUseCase('${kebabToCamelCase(usecase)}');
    const provider = await client.getProvider('${provider}');

    expect(useCase).not.toBeUndefined();
    expect(provider).not.toBeUndefined();
    //Edit expected value
    //await expect(useCase.perform({}, { provider })).resolves.toEqual()
  })
})
`;
}
