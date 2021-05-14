import { SuperfaceClient } from './superface/sdk';

describe('vcs/pull-request/gitlab-e2e', () => {
  beforeAll(() => {
    jest.setTimeout(10000);
    //Load super.json for tested usecase
    process.env.SUPERFACE_PATH = './test/e2e/vcs/pull-request/superface/super.json';
  })

  it('performs correctly', async () => {
    const client = new SuperfaceClient();
    const profile = await client.getProfile('vcs/pull-request');
    const provider = await client.getProvider('gitlab');
    const usecase = profile.useCases.PullRequest;

    expect(provider).not.toBeUndefined();
    expect(usecase).not.toBeUndefined();

    const result = await usecase.perform(
      { owner: 'Jakub-Vacek', repo: 'empty-test', identifier: 1 },
      { provider }
    );
    expect(result.unwrap()).toEqual({
      id: 1,
      sha: '8c64ce23d626c5bf345ce90fa5af329569d62c9a',
      title: 'Update README.md',
      url: 'https://gitlab.com/Jakub-Vacek/empty-test/-/merge_requests/1',
    });
  });
});
