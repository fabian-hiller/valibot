export interface BaseHKT<TType extends string = string> {
  type: TType;
  rawArgs: unknown[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  argConstraint: any[];
  args: this['rawArgs'] extends this['argConstraint'] ? this['rawArgs'] : never;
  result: unknown;
}

export interface HKTable<THKT extends BaseHKT = BaseHKT> {
  readonly '~hkt'?: THKT;
}

export type InferHKT<THKTable extends HKTable> = NonNullable<THKTable['~hkt']>;

export type CallHkt<
  THKTable extends HKTable,
  TArgs extends InferHKT<THKTable>['argConstraint'],
  TType extends InferHKT<THKTable>['type'] = InferHKT<THKTable>['type'],
> = (Extract<InferHKT<THKTable>, { type: TType }> & {
  rawArgs: TArgs;
})['result'];
