import { SuperfaceClient } from '../../../../superface/sdk';

describe('vcs/user-repos/mock-typed', () => {
  beforeAll(() => {
    jest.setTimeout(10000);
  });

  it('performs correctly', async () => {
    const client = new SuperfaceClient();
    const profile = await client.getProfile('vcs/user-repos');
    const provider = await client.getProvider('mock');
    const result = await profile.useCases.UserRepos.perform(
      { user: 'test' },
      { provider }
    );

    expect(result.isOk()).toBeTruthy();
    expect(result.unwrap()).toEqual({
      repos: [{ name: 'test', description: 'Hello World!' }],
    });
  });
});
