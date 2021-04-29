import { kebabToPascalCase } from './utils';

export function exportTypeTemplate(usecase: string): string {
  return `export * from './${usecase}'\n`;
}
export function profileTemplate(
  usecase: string,
  scope?: string,
  version = '1.0'
): string {
  const name: string = scope ? `${scope}/${usecase}` : `/${usecase}`;

  return `name = "${name}"\nversion = "${version}"\n\n"""\n${usecase} usecase\n"""\nusecase ${kebabToPascalCase(
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
map ${kebabToPascalCase(usecase)}{}
`;
}

export function mapTestTemplate(
  scope: string,
  usecase: string,
  provider: string
): string {
  return `import { SuperfaceClient } from '../../../../superface/sdk';

describe('${scope}/${usecase}/${provider}-typed', () => {
  it('performs correctly', async () => {
    const client = new SuperfaceClient();
    const profile = await client.getProfile('${scope}/${usecase}');
    const provider = await client.getProvider('${provider}');
    const usecase = profile.useCases.${kebabToPascalCase(usecase)};

    expect(provider).not.toBeUndefined();
    expect(usecase).not.toBeUndefined();

    //Edit input values and expected result
    //const result = await usecase.perform({}, { provider });
    //expect(result.unwrap()).toEqual();
  });
});`;
}