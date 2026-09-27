import { config } from '../config/env.js';
import * as authService from '../services/authService.js';

const REFRESH_COOKIE = 'refreshToken';

function setRefreshCookie(res, refreshToken) {
  res.cookie(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure: config.cookieSecure,
    sameSite: 'lax',
    path: '/api/auth',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function clearRefreshCookie(res) {
  res.clearCookie(REFRESH_COOKIE, {
    httpOnly: true,
    secure: config.cookieSecure,
    sameSite: 'lax',
    path: '/api/auth',
  });
}

export async function register(req, res, next) {
  try {
    const result = await authService.registerUser(req.body);
    setRefreshCookie(res, result.refreshToken);
    res.status(201).json({
      user: result.user,
      accessToken: result.accessToken,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const result = await authService.loginUser(req.body);
    setRefreshCookie(res, result.refreshToken);
    res.json({
      user: result.user,
      accessToken: result.accessToken,
    });
  } catch (error) {
    next(error);
  }
}

export async function refresh(req, res, next) {
  try {
    const refreshToken = req.cookies?.[REFRESH_COOKIE] || req.body?.refreshToken;

    // No cookie yet (first visit / logged out) — not an error for the UI
    if (!refreshToken) {
      return res.status(200).json({ user: null, accessToken: null });
    }

    const result = await authService.refreshSession(refreshToken);
    setRefreshCookie(res, result.refreshToken);
    res.json({
      user: result.user,
      accessToken: result.accessToken,
    });
  } catch (error) {
    clearRefreshCookie(res);
    next(error);
  }
}

export async function logout(req, res, next) {
  try {
    const refreshToken = req.cookies?.[REFRESH_COOKIE] || req.body?.refreshToken;
    await authService.logoutUser(refreshToken);
    clearRefreshCookie(res);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
