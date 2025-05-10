// export type PathValue<T, P> = 
//   P extends [infer K, ...infer Rest]
//     ? K extends keyof T
//       ? Rest extends string[]
//         ? PathValue<T[K], Rest>
//         : T[K]
//       : never
//     : T;
export {};
