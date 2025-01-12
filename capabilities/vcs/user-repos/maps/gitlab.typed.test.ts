import { SuperfaceClient } from '../../../../superface/sdk';

describe('vcs/user-repos/github-typed', () => {
  beforeAll(() => {
    jest.setTimeout(10000);
  });

  it('performs correctly', async () => {
    const client = new SuperfaceClient();
    const profile = await client.getProfile('vcs/user-repos');
    const provider = await client.getProvider('gitlab');
    const result = await profile.useCases.UserRepos.perform(
      { user: 'zdne' },
      { provider }
    );

    expect(result.isOk()).toBeTruthy();
    expect(result.unwrap()).toEqual({
      repos: [{ name: 'test', description: 'Hello World!' }],
    });
  });

  it('performs correctly on repositories with empty descriptions', async () => {
    const client = new SuperfaceClient();
    const profile = await client.getProfile('vcs/user-repos');
    const provider = await client.getProvider('gitlab');
    const result = await profile.useCases.UserRepos.perform(
      { user: 'Jakub-Vacek' },
      { provider }
    );

    expect(result.isOk()).toBeTruthy();
    expect(result.unwrap()).toEqual({
      repos: [
        { name: 'empty-test', description: undefined },
        { name: 'ChatApp', description: undefined },
      ],
    });
  });
});
