import Vue, { VNode, ComponentOptions as Vue2ComponentOptions } from 'vue'
import { SetupContext } from '../runtimeContext'
import { Data } from './common'
import { ComponentPropsOptions, ExtractPropTypes } from './componentProps'
import { ComponentRenderProxy } from './componentProxy'
export { ComponentPropsOptions } from './componentProps'

export type ComputedGetter<T> = (ctx?: any) => T
export type ComputedSetter<T> = (v: T) => void

export type ObjectEmitsOptions = Record<
  string,
  ((...args: any[]) => any) | null
>

export type EmitsOptions = ObjectEmitsOptions | string[]

export interface WritableComputedOptions<T> {
  get: ComputedGetter<T>
  set: ComputedSetter<T>
}

export type ComputedOptions = Record<
  string,
  ComputedGetter<any> | WritableComputedOptions<any>
>

export interface MethodOptions {
  [key: string]: Function
}

export type SetupFunction<Props, RawBindings = {}> = (
  this: void,
  props: Props,
  ctx: SetupContext
) => RawBindings | (() => VNode | null) | void

interface ComponentOptionsBase<
  Props,
  D = Data,
  C extends ComputedOptions = {},
  M extends MethodOptions = {}
> extends Omit<
    Vue2ComponentOptions<Vue, D, M, C, Props>,
    'data' | 'computed' | 'method' | 'setup' | 'props'
  > {
  // allow any custom options
  [key: string]: any

  // rewrite options api types
  data?: (this: Props & Vue, vm: Props) => D
  computed?: C
  methods?: M
}

export type ExtractComputedReturns<T extends any> = {
  [key in keyof T]: T[key] extends { get: (...args: any[]) => infer TReturn }
    ? TReturn
    : T[key] extends (...args: any[]) => infer TReturn
    ? TReturn
    : never
}

export type ComponentOptionsWithProps<
  PropsOptions = ComponentPropsOptions,
  RawBindings = Data,
  D = Data,
  C extends ComputedOptions = {},
  M extends MethodOptions = {},
  Props = ExtractPropTypes<PropsOptions>
> = ComponentOptionsBase<Props, D, C, M> & {
  props?: PropsOptions
  emits?: (EmitsOptions | string[]) & ThisType<void>
  setup?: SetupFunction<Props, RawBindings>
} & ThisType<ComponentRenderProxy<Props, RawBindings, D, C, M>>

export type ComponentOptionsWithArrayProps<
  PropNames extends string = string,
  RawBindings = Data,
  D = Data,
  C extends ComputedOptions = {},
  M extends MethodOptions = {},
  Props = Readonly<{ [key in PropNames]?: any }>
> = ComponentOptionsBase<Props, D, C, M> & {
  props?: PropNames[]
  emits?: (EmitsOptions | string[]) & ThisType<void>
  setup?: SetupFunction<Props, RawBindings>
} & ThisType<ComponentRenderProxy<Props, RawBindings, D, C, M>>

export type ComponentOptionsWithoutProps<
  Props = unknown,
  RawBindings = Data,
  D = Data,
  C extends ComputedOptions = {},
  M extends MethodOptions = {}
> = ComponentOptionsBase<Props, D, C, M> & {
  props?: undefined
  emits?: (EmitsOptions | string[]) & ThisType<void>
  setup?: SetupFunction<Props, RawBindings>
} & ThisType<ComponentRenderProxy<Props, RawBindings, D, C, M>>

export type WithLegacyAPI<T, D, C, M, Props> = T &
  Omit<Vue2ComponentOptions<Vue, D, M, C, Props>, keyof T>
