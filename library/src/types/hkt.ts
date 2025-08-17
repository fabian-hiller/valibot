export interface BaseHKT<TType extends string = string> {
  type: TType;
  rawArgs: unknown[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  argConstraint: any[];
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

export type CallHKT<
  THKTable extends BaseHKTable,
  TArgs extends InferHKT<THKTable, TType>['argConstraint'],
  TType extends InferHKT<THKTable>['type'] = InferHKT<THKTable>['type'],
> = (InferHKT<THKTable, TType> & {
  rawArgs: TArgs;
})['result'];

export type HKTImplementation<
  THKTable extends BaseHKTable,
  TType extends string = string,
> = (
  ...args: InferHKT<THKTable>['argConstraint']
) => CallHKT<THKTable, InferHKT<THKTable>['argConstraint'], TType> & THKTable;
