# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-06-17

### Added

- Initial release
- `EventEmitter` class + singleton instance
- `BusEvent` constants for HTTP / Auth / Theme
- `configureEnv` + `isDev` / `isTrial` / `isRelease` / `isWeixin` / `isUni` helpers
- `createStorage` with namespacing, sync/async API, JSON helpers
- `Auth` base class with `ensureLogin()`, token/userInfo storage
- Router helpers: `navigateTo` / `redirectTo` / `switchTab` / `reLaunch` / `navigateBack`
- Formatters: `formatDate` / `formatMoney` / `formatNumber` / `formatShortNumber` / `timeAgo` / `maskPhone` / `maskName`
- Validators: `isPhone` / `isEmail` / `isIdCard` / `isUrl` / `inRange` / `lengthInRange` / `createValidator` (chainable)
- `HttpClient` with request/response/error interceptors, upload/download, business code emission
- Jest tests for emitter, storage, formatter, validator
