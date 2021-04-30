import { createTypedClient } from "@superfaceai/one-sdk";

import { addressCleanAddress } from "./types/address/clean-address";
import { communicationSendEmail } from "./types/communication/send-email";
import { communicationSendMessage } from "./types/communication/send-message";
import { vcsPullRequests } from './types/vcs/pull-requests';
import { vcsSingleFileContent } from './types/vcs/single-file-content';
import { vcsUserRepos } from './types/vcs/user-repos';

export { AddressCleanAddressProfile } from "./types/address/clean-address";
export { CommunicationSendEmailProfile } from "./types/communication/send-email";
export { CommunicationSendMessageProfile } from "./types/communication/send-message";

export { VcsPullRequestsProfile } from "./types/vcs/pull-requests";
export { VcsSingleFileContentProfile } from "./types/vcs/single-file-content";
export { VcsUserReposProfile } from "./types/vcs/user-repos";
export const typeDefinitions = {
  ...addressCleanAddress,
  ...communicationSendEmail,
  ...communicationSendMessage,
  ...vcsPullRequests,
  ...vcsSingleFileContent,
  ...vcsUserRepos
};
export const SuperfaceClient = createTypedClient(typeDefinitions);
export type SuperfaceClient = InstanceType<typeof SuperfaceClient>;
