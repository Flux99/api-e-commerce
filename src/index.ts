import { createConnection } from 'typeorm';
import {User} from "./entity/User";
createConnection({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'newroot',
  password: 'password',
  database: 'db_connect',
  synchronize: true,
  entities: [__dirname + '/entity/*.ts']
})
  .then(async (connection) => {
    console.log('Connected to MySQL');
      // Create
    //   const user = new User();
    //   user.firstName = "John";
    //   user.lastName = "Doe";
    //   user.email = "abc@email.com";
    //   await connection.manager.save(user);
    //   console.log("User has been saved");
  
    //   // Read
    //   const users = await connection.manager.find(User);
    //   console.log("Loaded users: ", users);
  
    //   // Update
    //   const userToUpdate = users[0];
    //   userToUpdate.firstName = "Jane";
    //   await connection.manager.save(userToUpdate);
    //   console.log("User has been updated");
  
    //   // Delete
    //   const userToDelete = users[1];
    //   await connection.manager.remove(userToDelete);
    //   console.log("User has been deleted");
  })
  .catch((err) => {
    console.error('Failed to connect to MySQL', err);
  });
