import { isNativeError } from "util/types";

/* Type Definitions */
export type ResultOk<T> = {
  ok: true;
  value: T;
};
export type ResultError = {
  ok: false;
  error: Error;
};
export type Result<T> = ResultOk<T> | ResultError;

/* Type Assertions */
export function isResultOk<T>(result: Result<T>): result is ResultOk<T> {
  return result.ok;
}

export function isResultError(result: Result<unknown>): result is ResultError {
  return !result.ok;
}

/* Data Types Wrappers */
export function resultOk<T>(value: T): ResultOk<T> {
  return {
    ok: true,
    value,
  };
}

export function resultError(e: Error): ResultError {
  return {
    ok: false,
    error: e,
  };
}

/* Data Types Creation Functions */
export function syncResult<T>(fn: () => T): Result<T> {
  try {
    return resultOk(fn());
  } catch (err) {
    if (isNativeError(err)) {
      return resultError(err);
    }
    return resultError(new Error("Unknown (Non Native)"));
  }
}

export async function asyncResult<T>(fn: () => Promise<T>): Promise<Result<T>> {
  try {
    return await fn()
      .then((value) => resultOk(value))
      .catch((err) => resultError(err));
  } catch (err) {
    if (isNativeError(err)) {
      return resultError(err);
    }
    return resultError(new Error("Unknown (Non Native)"));
  }
}
