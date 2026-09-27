import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import { sequelize } from '../config/database.js';
import { User, RefreshToken } from '../models/index.js';
import { AppError } from '../utils/AppError.js';
import {
  hashToken,
  refreshExpiryDate,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../utils/tokens.js';

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

async function issueTokenPair(user, transaction) {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  const tokenHash = hashToken(refreshToken);

  await RefreshToken.create(
    {
      userId: user.id,
      tokenHash,
      expiresAt: refreshExpiryDate(),
    },
    { transaction },
  );

  return { accessToken, refreshToken, user: publicUser(user) };
}

export async function registerUser({ name, email, password }) {
  const existing = await User.findOne({ where: { email: email.toLowerCase() } });
  if (existing) {
    throw new AppError('Email is already registered', 409);
  }

  return sequelize.transaction(async (transaction) => {
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create(
      {
        name,
        email: email.toLowerCase(),
        passwordHash,
      },
      { transaction },
    );

    return issueTokenPair(user, transaction);
  });
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ where: { email: email.toLowerCase() } });
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new AppError('Invalid email or password', 401);
  }

  return sequelize.transaction(async (transaction) =>
    issueTokenPair(user, transaction),
  );
}

export async function refreshSession(refreshToken) {
  if (!refreshToken) {
    throw new AppError('Refresh token required', 401);
  }

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  const tokenHash = hashToken(refreshToken);

  return sequelize.transaction(async (transaction) => {
    const stored = await RefreshToken.findOne({
      where: {
        tokenHash,
        userId: payload.sub,
        expiresAt: { [Op.gt]: new Date() },
      },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!stored) {
      throw new AppError('Refresh token revoked or expired', 401);
    }

    const user = await User.findByPk(payload.sub, { transaction });
    if (!user) {
      throw new AppError('User not found', 401);
    }

    await stored.destroy({ transaction });
    return issueTokenPair(user, transaction);
  });
}

export async function logoutUser(refreshToken) {
  if (!refreshToken) {
    return;
  }

  const tokenHash = hashToken(refreshToken);
  await RefreshToken.destroy({ where: { tokenHash } });
}
