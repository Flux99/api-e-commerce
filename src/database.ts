import { DataSource,DataSourceOptions } from 'typeorm';
// import { Catalog } from './entity/Catalog';
// import { Order } from './entity/Order';
// import { Product } from './entity/Profile';
import { User } from './entity/User';
import * as secret from "./secret/db-config.json";
const connectionPromise:DataSourceOptions = {
  type: "mysql",
  host: secret.host,
  port: secret.port,
  username: secret.username,
  password: secret.password,
  database: secret.database,
  synchronize: true,
  entities: [__dirname + '/entity/*.ts'] // [User,Product,Catalog,Order]// 
};
const Datasource = new DataSource(connectionPromise);
export default Datasource;