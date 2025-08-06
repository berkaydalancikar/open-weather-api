export class SuccessResult<T = unknown> {
  public readonly success = true;

  constructor(public readonly data: T) {}
}