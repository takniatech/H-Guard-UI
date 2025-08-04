import { CONFIG } from 'src/config-global';

import LookerStudioEmbed from 'src/sections/dashboard/looker-studio-embed';
// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Dashboard - ${CONFIG.appName}`}</title>
      <meta
        name="description"
        content="The starting point for your next project with Minimal UI Kit, built on the newest version of Material-UI ©, ready to be customized to your style"
      />
      <meta name="keywords" content="react,material,kit,application,dashboard,admin,template" />

      <LookerStudioEmbed />
    </>
  );
}
