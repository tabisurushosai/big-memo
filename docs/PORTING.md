# Porting guide

This project should stay portable enough to share app logic with future iOS or
Android shells.

## Layer boundaries

- `src/core/` contains pure app logic and shared models. It must not import or
  reference `chrome.*`, DOM APIs, extension manifests, or platform storage APIs.
- `src/storage/` defines the storage interfaces used by the app. Platform code
  should provide an adapter instead of calling storage APIs from core logic.
- `src/platform/` is the place for browser or host-specific helpers such as
  language detection.
- UI code should receive platform behavior through small adapters and keep the
  existing offline-only behavior.

## Storage adapter contract

The persisted app data key is `bigMemoAppData`. Do not change the key or the
stored shape without a migration, because existing users already have data in
that format.

For a new platform:

1. Implement `KeyValueStorageAdapter` with the platform's local, offline storage
   API.
2. Wrap it with `createAppDataStorageAdapter`.
3. Pass the resulting `AppDataStorageAdapter` to `AppRepository`.

Chrome uses `chrome.storage.local` only in `src/storage/chromeStorage.ts`. Native
ports can map the same adapter to their local persistence layer while keeping
`src/core/` unchanged.

## Checks before porting changes

- Run `npm run build`; it includes a core-only typecheck without Chrome types.
- Keep Manifest V3 permissions unchanged for the extension build unless a
  separate, reviewed change explicitly requires otherwise.
- Do not add remote code, external CDNs, external fonts, network APIs, or `eval`.
