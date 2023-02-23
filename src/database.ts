import { createConnection } from 'typeorm';
import {User} from "./entity/User";
export const connection = createConnection({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'newroot',
  password: 'password',
  database: 'test01',
  synchronize: true,
  entities: [__dirname + '/entity/*.ts']
});
