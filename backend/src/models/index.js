import { User } from './User.js';
import { Task } from './Task.js';
import { RefreshToken } from './RefreshToken.js';

User.hasMany(Task, {
  foreignKey: 'userId',
  as: 'tasks',
  onDelete: 'CASCADE',
});

Task.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

User.hasMany(RefreshToken, {
  foreignKey: 'userId',
  as: 'refreshTokens',
  onDelete: 'CASCADE',
});

RefreshToken.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

export { User, Task, RefreshToken };
