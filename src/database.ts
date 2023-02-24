import { createConnection } from 'typeorm';
import { Catalog } from './entity/Catalog';
import { Order } from './entity/Order';
import { Product } from './entity/Product';
import { User } from './entity/User';
import * as secret from "./secret/config.json";
export const connection = createConnection({
  type: "mysql",
  host: secret.host,
  port: secret.port,
  username: secret.username,
  password: secret.password,
  database: secret.database,
  synchronize: true,
  entities: [__dirname + '/entity/*.ts'] // [User,Product,Catalog,Order]// 
});
