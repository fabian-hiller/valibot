export interface BaseHKT {
  // used when applying
  rawArgs: unknown[];
  // used by HKTs
  args: this['rawArgs'] extends this['argConstraint'] ? this['rawArgs'] : never;

  // set by HKTs
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  argConstraint: any[];
  result: unknown;

  assignabilityCheck: (...args: this['argConstraint']) => this['result'];
}

export interface BaseHKTable<THKT extends BaseHKT = BaseHKT> {
  /**
   * Supported HKTs.
   */
  readonly '~hkt'?: THKT;
}

export type InferHKT<THKTable extends BaseHKTable> = Extract<
  THKTable['~hkt'],
  BaseHKT
>;

export type PartialApplyHKT<
  THKT extends BaseHKT,
  TArgs extends THKT['argConstraint'],
> = THKT & { rawArgs: TArgs };

export type ApplyHKT<
  THKTable extends BaseHKTable,
  TArgs extends InferHKT<THKTable>['argConstraint'],
> = PartialApplyHKT<InferHKT<THKTable>, TArgs>['result'];

export type HKTImplementation<THKTable extends BaseHKTable> = (
  ...args: InferHKT<THKTable>['argConstraint']
) => ApplyHKT<THKTable, InferHKT<THKTable>['argConstraint']> & THKTable;
