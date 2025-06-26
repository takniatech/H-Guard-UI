import { CONFIG } from 'src/config-global';

import { UserView } from 'src/sections/user/view';
import OrdersTable from 'src/sections/order/orders-table';
import StoresManagement from 'src/sections/store/store-management';
// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Stores - ${CONFIG.appName}`}</title>

        <StoresManagement />
      {/* <UserView /> */}
    </>
  );
}
