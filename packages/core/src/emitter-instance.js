import { EventEmitter } from './emitter.js';

/**
 * 全局单例 emitter — 推荐在项目中作为默认事件总线使用
 */
const emitter = new EventEmitter();
export default emitter;
export { EventEmitter };
