import { check, CheckResult } from '@superfaceai/cli/dist/logic/check';

import {
  allProfileProviderCombinations,
  arrayDiff,
  loadSuperJson,
  localMaps,
  localProfiles,
  localProviders,
  mapsFiles,
  profilesFiles,
  providersFiles,
} from './util';

export async function checkCapabilities(): Promise<CheckResult[]> {
  const checkCombinations = allProfileProviderCombinations();
  const superJson = loadSuperJson();

  const results: CheckResult[] = [];

  const map: {
    variant?: string; // no reason for variants in Station
  } = {};

  for (const checkCombination of checkCombinations) {
    try {
      const checkResults = await check(
        superJson,
        checkCombination.profile,
        checkCombination.provider,
        map
      );

      results.push(...checkResults);
    } catch (err) {
      if (err instanceof Error) {
        results.push({ kind: 'error', message: err.message });
      } else {
        results.push({ kind: 'error', message: 'Unknown error' });
      }
    }
  }

  return results;
}

export async function checkFiles(): Promise<CheckResult[]> {
  const localFiles: string[] = [];
  localFiles.push(...(await localProviders()));
  localFiles.push(...(await localProfiles()));
  localFiles.push(...(await localMaps()));

  const superJsonFiles: string[] = [];
  superJsonFiles.push(...providersFiles());
  superJsonFiles.push(...profilesFiles());
  superJsonFiles.push(...mapsFiles());

  const notLinkedInSuperJson = arrayDiff(localFiles, superJsonFiles);
  const missingFiles = arrayDiff(superJsonFiles, localFiles);

  const result: CheckResult[] = [];

  notLinkedInSuperJson.forEach(file => {
    result.push({
      kind: 'warn',
      message: `${file} isn't linked in super.json`,
    });
  });

  missingFiles.forEach(file => {
    result.push({
      kind: 'error',
      message: `${file} linked in super.json doesn't exists`,
    });
  });

  return result;
}

export async function checkMockMap(): Promise<CheckResult[]> {
  const superJson = loadSuperJson();
  const results: CheckResult[] = [];

  for (const profileId in superJson.normalized.profiles) {
    const profileSettings = superJson.normalized.profiles[profileId];

    const mockProvider = profileSettings.providers.mock;

    if (!mockProvider) {
      results.push({
        kind: 'error',
        message: `${profileId} is missing mock map`,
      });
    }
  }

  return results;
}

export async function run(print = console.log): Promise<void> {
  const results: CheckResult[] = [];

  results.push(...(await checkCapabilities()));
  results.push(...(await checkFiles()));
  results.push(...(await checkMockMap()));
  // TODO: check test is present

  if (results.length === 0) {
    print('No issues');
    process.exitCode = 0;
  }

  let hasError = false;

  results.forEach(result => {
    if (result.kind === 'error') {
      hasError = true;
    }
    print(`${result.kind}: ${result.message}`);
  });

  process.exitCode = hasError ? 1 : 0;
}

if (require.main === module) {
  void run();
}
