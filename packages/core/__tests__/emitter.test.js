describe('EventEmitter', () => {
  let e;

  beforeEach(() => {
    e = new (require('../src/emitter.js')).EventEmitter();
  });

  it('on + emit 基础用法', () => {
    let received;
    e.on('hello', (v) => { received = v; });
    e.emit('hello', 'world');
    expect(received).toBe('world');
  });

  it('once 只触发一次', () => {
    let count = 0;
    e.once('ping', () => { count++; });
    e.emit('ping', 1);
    e.emit('ping', 2);
    expect(count).toBe(1);
  });

  it('off 取消订阅', () => {
    let called = false;
    const cb = () => { called = true; };
    e.on('msg', cb);
    e.off('msg', cb);
    e.emit('msg');
    expect(called).toBe(false);
  });

  it('all — 全部事件触发才执行', () => {
    let count = 0;
    e.all(['a', 'b'], () => { count++; });
    e.emit('a');
    expect(count).toBe(0);
    e.emit('b');
    expect(count).toBe(1);
  });

  it('least — 任一事件触发即执行', () => {
    let count = 0;
    e.least(['a', 'b'], () => { count++; });
    e.emit('a');
    expect(count).toBe(1);
  });

  it('batch — 每个事件都触发回调', () => {
    let count = 0;
    e.batch(['a', 'b'], () => { count++; });
    e.emit('a', 1);
    e.emit('b', 2);
    expect(count).toBe(2);
  });

  it('clear 清空所有订阅', () => {
    let count = 0;
    const cb = () => { count++; };
    e.on('a', cb);
    e.on('b', cb);
    e.clear();
    e.emit('a');
    e.emit('b');
    expect(count).toBe(0);
  });

  it('on 返回的函数可取消订阅', () => {
    let count = 0;
    const cb = () => { count++; };
    const off = e.on('x', cb);
    off();
    e.emit('x');
    expect(count).toBe(0);
  });
});
