export interface BaseHKT<TType extends string = string> {
  type: TType;
  rawArgs: unknown[];
  argConstraint: unknown[];
  args: this['rawArgs'] extends this['argConstraint'] ? this['rawArgs'] : never;
  result: unknown;
}

export interface BaseHKTable<THKT extends BaseHKT = BaseHKT> {
  /**
   * Supported HKTs.
   */
  readonly '~hkt'?: THKT;
  readonly '~hktType': THKT['type'];
}

export type InferHKT<
  THKTable extends BaseHKTable,
  TType extends string = string,
> = Extract<NonNullable<THKTable['~hkt']>, { type: TType }>;

export type PartialApplyHKT<
  THKT extends BaseHKT,
  TArgs extends THKT['argConstraint'],
> = THKT & { rawArgs: TArgs };

export type ApplyHKT<
  THKTable extends BaseHKTable,
  TArgs extends InferHKT<THKTable, TType>['argConstraint'],
  TType extends InferHKT<THKTable>['type'] = InferHKT<THKTable>['type'],
> = PartialApplyHKT<InferHKT<THKTable, TType>, TArgs>['result'];

export type HKTImplementation<
  THKTable extends BaseHKTable,
  TType extends string = string,
> = (
  ...args: InferHKT<THKTable>['argConstraint']
) => ApplyHKT<THKTable, InferHKT<THKTable>['argConstraint'], TType> & THKTable;
