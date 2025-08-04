import { CONFIG } from 'src/config-global';
import { StoreView } from 'src/sections/store/view';

//--------------------------------------------------------

export default function Page() {
  return (
    <>

      <title>{`Store - ${CONFIG.appName}`}</title>

      <StoreView />

    </>
  );
}
