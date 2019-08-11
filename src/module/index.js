import userRoutes from './user/user.routes';
import storeRoutes from './store/store.routes';
import billRoutes from './bill/bill.routes';
import reportRoutes from './report/report.routes';
import productRoutes from './product/product.routes';
import customerRoutes from './customer/customer.routes';
import testRoutes from './test/test.routes';

export default app => {
  app.use('/user', userRoutes);
  app.use('/store', storeRoutes);
  app.use('/bill', billRoutes);
  app.use('/report', reportRoutes);
  app.use('/product', productRoutes);
  app.use('/customer', customerRoutes);
  app.use('/test', testRoutes);
};
