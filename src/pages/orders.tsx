import { CONFIG } from 'src/config-global';

import { UserView } from 'src/sections/user/view';
import OrdersTable from 'src/sections/order/orders-table';
// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Orders - ${CONFIG.appName}`}</title>

        <OrdersTable />
      {/* <UserView /> */}
    </>
  );
}
